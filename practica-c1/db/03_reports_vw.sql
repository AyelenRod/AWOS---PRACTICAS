-- Vista 1: Ranking de libros más prestados
-- Grano: Una fila por libro
-- Métricas: Conteo total de préstamos, Rango
-- Verificar: SELECT * FROM vw_most_borrowed_books ORDER BY rank_most_borrowed;
CREATE OR REPLACE VIEW vw_most_borrowed_books AS
SELECT 
    b.id AS book_id,
    b.title,
    b.author,
    COUNT(l.id) AS total_loans,
    RANK() OVER (ORDER BY COUNT(l.id) DESC) AS rank_most_borrowed
FROM books b
JOIN copies c ON b.id = c.book_id
JOIN loans l ON c.id = l.copy_id
GROUP BY b.id, b.title, b.author;

-- Vista 2: Préstamos vencidos con cálculo de días y multa sugerida
-- Grano: Una fila por préstamo vencido activo
-- Métricas: Días de atraso, Multa estimada
-- Verificar: SELECT * FROM vw_overdue_loans WHERE days_overdue > 10;
CREATE OR REPLACE VIEW vw_overdue_loans AS
WITH ActiveOverdue AS (
    SELECT 
        l.id AS loan_id,
        l.due_at,
        l.loaned_at,
        m.name AS member_name,
        b.title AS book_title,
        CURRENT_DATE - l.due_at AS days_overdue
    FROM loans l
    JOIN members m ON l.member_id = m.id
    JOIN copies c ON l.copy_id = c.id
    JOIN books b ON c.book_id = b.id
    WHERE l.returned_at IS NULL AND CURRENT_DATE > l.due_at
)
SELECT 
    *,
    CASE 
        WHEN days_overdue <= 7 THEN days_overdue * 0.50
        ELSE days_overdue * 1.00
    END AS estimated_fine_amount,
    CASE
        WHEN days_overdue > 30 THEN 'CRITICAL'
        WHEN days_overdue > 14 THEN 'HIGH'
        ELSE 'NORMAL'
    END AS urgency_level
FROM ActiveOverdue;

-- Vista 3: Resumen mensual de multas (Pagadas vs Pendientes)
-- Grano: Una fila por mes
-- Métricas: Total de multas, Monto pagado, Monto pendiente
-- Verificar: SELECT * FROM vw_fines_summary;
CREATE OR REPLACE VIEW vw_fines_summary AS
SELECT 
    TO_CHAR(l.due_at, 'YYYY-MM') AS month_str,
    COUNT(f.id) AS total_fines_count,
    SUM(f.amount) AS total_amount_generated,
    SUM(CASE WHEN f.paid_at IS NOT NULL THEN f.amount ELSE 0 END) AS total_paid,
    SUM(CASE WHEN f.paid_at IS NULL THEN f.amount ELSE 0 END) AS total_pending
FROM fines f
JOIN loans l ON f.loan_id = l.id
GROUP BY TO_CHAR(l.due_at, 'YYYY-MM')
HAVING SUM(f.amount) > 0;

-- Vista 4: Actividad y confiabilidad de socios
-- Grano: Una fila por socio
-- Métricas: Total de préstamos, Tasa de devolución a tiempo
-- Verificar: SELECT * FROM vw_member_activity WHERE total_loans > 0;
CREATE OR REPLACE VIEW vw_member_activity AS
SELECT 
    m.id AS member_id,
    m.name,
    m.member_type,
    COUNT(l.id) AS total_loans,
    SUM(CASE WHEN l.returned_at IS NULL AND l.due_at < CURRENT_DATE THEN 1 ELSE 0 END) AS active_overdue_count,
    ROUND(
        (SUM(CASE WHEN l.returned_at <= l.due_at THEN 1 ELSE 0 END)::DECIMAL / NULLIF(COUNT(l.id), 0)) * 100, 
        2
    ) AS on_time_return_rate
FROM members m
LEFT JOIN loans l ON m.id = l.member_id
GROUP BY m.id, m.name, m.member_type
HAVING COUNT(l.id) > 0;

-- Vista 5: Salud del inventario por categoría
-- Grano: Una fila por categoría
-- Métricas: Total de copias, Desglose de disponibilidad
-- Verificar: SELECT * FROM vw_inventory_health;
CREATE OR REPLACE VIEW vw_inventory_health AS
SELECT 
    b.category,
    COUNT(c.id) AS total_copies,
    SUM(CASE WHEN c.status = 'AVAILABLE' THEN 1 ELSE 0 END) AS count_available,
    SUM(CASE WHEN c.status = 'LOANED' THEN 1 ELSE 0 END) AS count_loaned,
    SUM(CASE WHEN c.status = 'LOST' THEN 1 ELSE 0 END) AS count_lost,
    COALESCE(
        ROUND((SUM(CASE WHEN c.status = 'AVAILABLE' THEN 1 ELSE 0 END)::DECIMAL / NULLIF(COUNT(c.id), 0)) * 100, 1),
        0
    ) AS availability_percentage
FROM books b
JOIN copies c ON b.id = c.book_id
GROUP BY b.category;
