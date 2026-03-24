-- db/03_reports_vw.sql

-- 1. Ranking de libros más prestados
-- Retorna: ranking, title, author, total_loans
-- Grain: Un registro por libro que ha sido prestado
-- Métricas: COUNT de préstamos, RANK basado en popularidad
-- VERIFY: SELECT * FROM vw_most_borrowed_books ORDER BY ranking LIMIT 5;
-- VERIFY: SELECT COUNT(*) FROM vw_most_borrowed_books WHERE total_loans > 2;
DROP VIEW IF EXISTS vw_most_borrowed_books;

CREATE VIEW vw_most_borrowed_books AS
SELECT 
    RANK() OVER (ORDER BY COUNT(l.id) DESC) AS ranking,
    b.title,
    b.author,
    COUNT(l.id) AS total_loans
FROM books b
JOIN copies c ON b.id = c.book_id
JOIN loans l ON c.id = l.copy_id
GROUP BY b.id, b.title, b.author;

-- 2. Préstamos vencidos con cálculo de mora
-- Retorna: member_name, book_title, due_date, days_overdue, suggested_fine_amount
-- Grain: Un registro por préstamo vencido activo
-- Métricas: días de atraso (EXTRACT), monto sugerido calculado (CASE)
-- VERIFY: SELECT * FROM vw_overdue_loans WHERE days_overdue > 5;
-- VERIFY: SELECT COUNT(*), SUM(suggested_fine_amount) FROM vw_overdue_loans;
DROP VIEW IF EXISTS vw_overdue_loans;

CREATE VIEW vw_overdue_loans AS
WITH ActiveOverdueLoans AS (
    SELECT 
        l.id AS loan_id,
        m.name AS member_name,
        b.title AS book_title,
        l.due_date,
        EXTRACT(DAY FROM (NOW() - l.due_date))::INTEGER AS days_overdue
    FROM loans l
    JOIN members m ON l.member_id = m.id
    JOIN copies c ON l.copy_id = c.id
    JOIN books b ON c.book_id = b.id
    WHERE l.return_date IS NULL AND l.due_date < NOW()
)
SELECT 
    member_name,
    book_title,
    due_date,
    days_overdue,
    CASE 
        WHEN days_overdue > 0 THEN days_overdue * 5.00
        ELSE 0 
    END AS suggested_fine_amount
FROM ActiveOverdueLoans;

-- 3. Resumen de multas por mes
-- Retorna: month_year, total_fines, collected_amount, pending_amount
-- Grain: Un registro por mes con actividad de multas
-- Métricas: COUNT, SUM con CASE para pagadas/pendientes
-- VERIFY: SELECT * FROM vw_fines_summary ORDER BY month_year DESC;
-- VERIFY: SELECT SUM(collected_amount), SUM(pending_amount) FROM vw_fines_summary;
DROP VIEW IF EXISTS vw_fines_summary;

CREATE VIEW vw_fines_summary AS
SELECT 
    TO_CHAR(l.due_date, 'YYYY-MM') AS month_year,
    COUNT(f.id) AS total_fines,
    COALESCE(SUM(CASE WHEN f.paid_at IS NOT NULL THEN f.amount ELSE 0 END), 0) AS collected_amount,
    COALESCE(SUM(CASE WHEN f.paid_at IS NULL THEN f.amount ELSE 0 END), 0) AS pending_amount
FROM fines f
JOIN loans l ON f.loan_id = l.id
GROUP BY TO_CHAR(l.due_date, 'YYYY-MM')
HAVING COUNT(f.id) > 0;

-- 4. Actividad de socios y tasa de atraso
-- Retorna: name, email, total_loans, delayed_loans, overdue_rate_percentage
-- Grain: Un registro por socio con al menos un préstamo
-- Métricas: COUNT total, COUNT con CASE para atrasados, ratio calculado (COALESCE)
-- VERIFY: SELECT * FROM vw_member_activity WHERE overdue_rate_percentage > 30;
-- VERIFY: SELECT AVG(overdue_rate_percentage) FROM vw_member_activity;
DROP VIEW IF EXISTS vw_member_activity;

CREATE VIEW vw_member_activity AS
SELECT 
    m.name,
    m.email,
    COUNT(l.id) AS total_loans,
    COUNT(CASE 
        WHEN l.return_date > l.due_date OR (l.return_date IS NULL AND l.due_date < NOW()) 
        THEN 1 
    END) AS delayed_loans,
    COALESCE(
        ROUND(
            (COUNT(CASE 
                WHEN l.return_date > l.due_date OR (l.return_date IS NULL AND l.due_date < NOW()) 
                THEN 1 
            END)::DECIMAL / NULLIF(COUNT(l.id), 0)) * 100, 
        2), 
    0) AS overdue_rate_percentage
FROM members m
LEFT JOIN loans l ON m.id = l.member_id
GROUP BY m.id, m.name, m.email
HAVING COUNT(l.id) > 0;

-- 5. Salud del inventario
-- Retorna: category, total_copies, available_count, loaned_count, other_status_count, availability_percentage
-- Grain: Un registro por categoría de libro
-- Métricas: COUNT total, SUM con CASE para cada estado, ratio de disponibilidad (COALESCE)
-- VERIFY: SELECT * FROM vw_inventory_health ORDER BY availability_percentage;
-- VERIFY: SELECT SUM(total_copies), SUM(available_count) FROM vw_inventory_health;
DROP VIEW IF EXISTS vw_inventory_health;

CREATE VIEW vw_inventory_health AS
SELECT 
    b.category,
    COUNT(c.id) AS total_copies,
    SUM(CASE WHEN c.status = 'available' THEN 1 ELSE 0 END) AS available_count,
    SUM(CASE WHEN c.status = 'loaned' THEN 1 ELSE 0 END) AS loaned_count,
    SUM(CASE WHEN c.status NOT IN ('available', 'loaned') THEN 1 ELSE 0 END) AS other_status_count,
    COALESCE(
        ROUND(
            (SUM(CASE WHEN c.status = 'available' THEN 1 ELSE 0 END)::DECIMAL / NULLIF(COUNT(c.id), 0)) * 100,
        2),
    0) AS availability_percentage
FROM books b
JOIN copies c ON b.id = c.book_id
GROUP BY b.category;