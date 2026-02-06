-- db/03_reports_vw.sql

-- 1. Rankings de libros más prestados
-- Uso de Window Function (RANK) y COUNT
DROP VIEW IF EXISTS vw_most_borrowed_books;

CREATE VIEW vw_most_borrowed_books AS
SELECT 
    RANK() OVER (ORDER BY COUNT(l.id) DESC) as ranking,
    b.title,
    b.author,
    COUNT(l.id) as total_loans
FROM books b
JOIN copies c ON b.id = c.book_id
JOIN loans l ON c.id = l.copy_id
GROUP BY b.id, b.title, b.author;

-- 2. Préstamos vencidos con cálculo de mora
-- Uso de CTE y CASE
DROP VIEW IF EXISTS vw_overdue_loans;

CREATE VIEW vw_overdue_loans AS
WITH ActiveOverdueLoans AS (
    SELECT 
        l.id as loan_id,
        m.name as member_name,
        b.title as book_title,
        l.due_date,
        EXTRACT(DAY FROM (NOW() - l.due_date))::INTEGER as days_overdue
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
    END as suggested_fine_amount
FROM ActiveOverdueLoans;

-- 3. Resumen de multas por mes
-- Uso de HAVING para filtrar meses con actividad
DROP VIEW IF EXISTS vw_fines_summary;

CREATE VIEW vw_fines_summary AS
SELECT 
    TO_CHAR(l.due_date, 'YYYY-MM') as month_year,
    COUNT(f.id) as total_fines,
    SUM(CASE WHEN f.paid_at = TRUE THEN f.amount ELSE 0 END) as collected_amount,
    SUM(CASE WHEN f.paid_at = FALSE THEN f.amount ELSE 0 END) as pending_amount
FROM fines f
JOIN loans l ON f.loan_id = l.id
GROUP BY TO_CHAR(l.due_date, 'YYYY-MM')
HAVING COUNT(f.id) > 0;

-- 4. Actividad de socios y tasa de atraso
-- Uso de HAVING, CASE y COALESCE
DROP VIEW IF EXISTS vw_member_activity;

CREATE VIEW vw_member_activity AS
SELECT 
    m.name,
    m.email,
    COUNT(l.id) as total_loans,
    COUNT(CASE 
        WHEN l.return_date > l.due_date OR (l.return_date IS NULL AND l.due_date < NOW()) 
        THEN 1 
    END) as delayed_loans,
    COALESCE(
        ROUND(
            (COUNT(CASE 
                WHEN l.return_date > l.due_date OR (l.return_date IS NULL AND l.due_date < NOW()) 
                THEN 1 
            END)::DECIMAL / NULLIF(COUNT(l.id), 0)) * 100, 
        2), 
    0) as overdue_rate_percentage
FROM members m
LEFT JOIN loans l ON m.id = l.member_id
GROUP BY m.id, m.name, m.email
HAVING COUNT(l.id) > 0;

-- 5. Salud del inventario
-- Uso de CASE y COALESCE para pivoteo de estados
DROP VIEW IF EXISTS vw_inventory_health;

CREATE VIEW vw_inventory_health AS
SELECT 
    b.category,
    COUNT(c.id) as total_copies,
    SUM(CASE WHEN c.status = 'available' THEN 1 ELSE 0 END) as available_count,
    SUM(CASE WHEN c.status = 'loaned' THEN 1 ELSE 0 END) as loaned_count,
    SUM(CASE WHEN c.status NOT IN ('available', 'loaned') THEN 1 ELSE 0 END) as other_status_count,
    COALESCE(
        ROUND(
            (SUM(CASE WHEN c.status = 'available' THEN 1 ELSE 0 END)::DECIMAL / NULLIF(COUNT(c.id), 0)) * 100,
        2),
    0) as availability_percentage
FROM books b
JOIN copies c ON b.id = c.book_id
GROUP BY b.category;