-- db/indexes.sql

-- 1. Índice en Claves Foráneas de Órdenes
-- JUSTIFICACIÓN: Las vistas 'view_vip_customers' y 'view_monthly_sales' hacen JOIN constante 
-- entre 'orders' y 'customers'. Indexar la FK acelera drásticamente estos cruces.
CREATE INDEX idx_orders_customer_id ON orders(customer_id);

-- 2. Índice en Items de Orden
-- JUSTIFICACIÓN: Casi todas las vistas (1, 3, 4, 5) hacen JOIN con 'order_items' 
-- para calcular totales ($). Este índice es vital para evitar table scans masivos.
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- 3. Índice en Categoría de Productos
-- JUSTIFICACIÓN: La 'view_category_sales' agrupa por categoría y la 'view_product_ranking' 
-- particiona por categoría. Este índice optimiza el agrupamiento.
CREATE INDEX idx_products_category ON products(category);