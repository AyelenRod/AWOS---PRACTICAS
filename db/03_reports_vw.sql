-- db/reports_vw.sql





/*
-- ==================================================================
-- VISTA 1: Resumen de Ventas por Categoría
-- REQUISITOS CUMPLIDOS:
-- 1. Función Agregada (SUM, COUNT) [cite: 5]
-- 2. GROUP BY [cite: 5]
-- 3. Campo Calculado (Promedio ticket) [cite: 5]
-- 4. HAVING (Filtrar categorías con pocas ventas) [cite: 5]

-- GRAIN: Una fila por Categoría de producto
-- METRICAS: Total vendido ($), Cantidad de items, Ticket promedio
-- GROUP BY: Necesario para agrupar ventas por la columna category
-- VERIFY: SELECT * FROM view_category_sales WHERE total_revenue > 1000;
-- ==================================================================

CREATE OR REPLACE VIEW view_category_sales AS
SELECT 
    p.category,
    COUNT(oi.id) as total_items_sold,
    SUM(oi.quantity * oi.unit_price) as total_revenue,
    ROUND(AVG(oi.quantity * oi.unit_price), 2) as avg_ticket_value
FROM products p
JOIN order_items oi ON p.id = oi.product_id
JOIN orders o ON oi.order_id = o.id
WHERE o.status = 'completed'
GROUP BY p.category
HAVING SUM(oi.quantity * oi.unit_price) > 50; 

-- =================================================================
-- VISTA 2: Estado de Inventario (Alertas)
-- REQUISITOS CUMPLIDOS:
-- 1. CASE (Semáforo de Stock) [cite: 6]
-- 2. COALESCE (Manejo de nulos, aunque aquí stock tiene default 0, es buena práctica) [cite: 6]
-- 3. NO SELECT * (Columnas explícitas) [cite: 8]

-- GRAIN: Una fila por Producto
-- METRICAS: Stock actual, Valor potencial del inventario, Estado (Texto)
-- GROUP BY: N/A (Es listado directo)
-- VERIFY: SELECT * FROM view_inventory_status WHERE stock_status = 'DANGER';
-- =================================================================

CREATE OR REPLACE VIEW view_inventory_status AS
SELECT 
    p.id as product_id,
    p.name as product_name,
    COALESCE(p.stock, 0) as current_stock,
    (p.price * p.stock) as inventory_value,
    CASE 
        WHEN p.stock = 0 THEN 'OUT_OF_STOCK'
        WHEN p.stock < 10 THEN 'DANGER'
        ELSE 'OK'
    END as stock_status
FROM products p;


-- =================================================================
-- VISTA 3: Clientes VIP (Alto Valor)
-- REQUISITOS CUMPLIDOS:
-- 1. HAVING (Segundo uso obligatorio)
-- 2. Funciones Agregadas (MAX, SUM)
-- 3. CASE (Para clasificar clientes - Requisito de 2 views con CASE)

-- GRAIN: Una fila por Cliente
-- METRICAS: Gasto total, Fecha última compra, Nivel de Membresía (Gold/Silver)
-- GROUP BY: Agrupa todas las órdenes por cliente
-- VERIFY: SELECT * FROM view_vip_customers ORDER BY total_spent DESC;
-- =================================================================

CREATE OR REPLACE VIEW view_vip_customers AS
SELECT 
    c.id,
    c.name,
    c.email,
    COUNT(o.id) as total_orders,
    SUM(oi.quantity * oi.unit_price) as total_spent,
    CASE 
        WHEN SUM(oi.quantity * oi.unit_price) > 500 THEN 'Gold Member'
        WHEN SUM(oi.quantity * oi.unit_price) > 200 THEN 'Silver Member'
        ELSE 'Bronze Member'
    END as membership_level,
    MAX(o.order_date) as last_purchase_date
FROM customers c
JOIN orders o ON c.id = o.customer_id
JOIN order_items oi ON o.id = oi.order_id
WHERE o.status = 'completed'
GROUP BY c.id, c.name, c.email
HAVING SUM(oi.quantity * oi.unit_price) > 0;

-- =================================================================
-- VISTA 4: Reporte Mensual (Evolución)
-- REQUISITOS CUMPLIDOS:
-- 1. CTE (WITH...) [cite: 7]
-- 2. Manejo de Fechas

-- GRAIN: Una fila por Mes/Año
-- METRICAS: Ventas totales del mes
-- GROUP BY: Mes de la orden
-- VERIFY: SELECT * FROM view_monthly_sales;
-- =================================================================

CREATE OR REPLACE VIEW view_monthly_sales AS
WITH monthly_data AS (
    SELECT 
        TO_CHAR(o.order_date, 'YYYY-MM') as sale_month,
        SUM(oi.quantity * oi.unit_price) as monthly_total
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    WHERE o.status = 'completed'
    GROUP BY TO_CHAR(o.order_date, 'YYYY-MM')
)
SELECT 
    sale_month,
    monthly_total,
    (monthly_total * 0.16) as estimated_tax
FROM monthly_data;


-- =================================================================
-- VISTA 5: Ranking de Productos
-- REQUISITOS CUMPLIDOS:
-- 1. WINDOW FUNCTION (DENSE_RANK) [cite: 7]
-- 2. NO SELECT * [cite: 8]

-- GRAIN: Una fila por Producto con su ranking
-- METRICAS: Total vendido, Ranking dentro de su categoría
-- GROUP BY: Producto y Categoría
-- VERIFY: SELECT * FROM view_product_ranking WHERE rank_in_category = 1;
-- =================================================================

CREATE OR REPLACE VIEW view_product_ranking AS
SELECT 
    p.category,
    p.name as product_name,
    SUM(oi.quantity) as units_sold,
    DENSE_RANK() OVER (
        PARTITION BY p.category 
        ORDER BY SUM(oi.quantity) DESC
    ) as rank_in_category
FROM products p
JOIN order_items oi ON p.id = oi.product_id
JOIN orders o ON oi.order_id = o.id
WHERE o.status = 'completed'
GROUP BY p.category, p.name;