-- db/roles.sql

-- Creacion de un rol de grupo
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles  
      WHERE  rolname = 'app_client') THEN

      CREATE ROLE app_client WITH LOGIN PASSWORD 'contra123';
   END IF;
END
$do$;

-- Permisos mínimos
GRANT CONNECT ON DATABASE postgres TO app_client;

GRANT USAGE ON SCHEMA public TO app_client;

--SELECT solo a las vistas específicas
GRANT SELECT ON view_category_sales TO app_client;
GRANT SELECT ON view_inventory_status TO app_client;
GRANT SELECT ON view_vip_customers TO app_client;
GRANT SELECT ON view_monthly_sales TO app_client;
GRANT SELECT ON view_product_ranking TO app_client;

-- Futuras tablas no accesibles automáticamente
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM app_client;