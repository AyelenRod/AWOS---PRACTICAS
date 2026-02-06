-- db/05_roles.sql

-- Crear rol 'app' si no existe
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles  
      WHERE  rolname = 'app') THEN

      CREATE ROLE app WITH LOGIN PASSWORD 'secure_password_123';
   END IF;
END
$do$;

-- Permisos base de conexión
GRANT CONNECT ON DATABASE library_db TO app;
GRANT USAGE ON SCHEMA public TO app;

-- REVOCAR permisos automáticos
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM app;

-- OTORGAR SELECT EXLUSIVAMENTE SOBRE LAS VISTAS
GRANT SELECT ON vw_most_borrowed_books TO app;
GRANT SELECT ON vw_overdue_loans TO app;
GRANT SELECT ON vw_fines_summary TO app;
GRANT SELECT ON vw_member_activity TO app;
GRANT SELECT ON vw_inventory_health TO app;