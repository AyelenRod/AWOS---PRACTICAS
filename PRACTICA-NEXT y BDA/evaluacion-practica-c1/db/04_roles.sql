-- db/04_roles.sql

-- Crear rol 'app' si no existe, con contraseña
DO
$do$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'app') THEN
      CREATE ROLE app WITH LOGIN PASSWORD 'contra123';
   ELSE
      -- Si ya existe, cambiar la contraseña por si acaso
      ALTER ROLE app WITH PASSWORD 'contra123';
   END IF;
END
$do$;

-- Permisos base de conexión
GRANT CONNECT ON DATABASE library_db TO app;

-- Conceder uso del esquema public
GRANT USAGE ON SCHEMA public TO app;

-- Conceder permisos SELECT en todas las tablas (necesario para las vistas)
GRANT SELECT ON ALL TABLES IN SCHEMA public TO app;

-- Conceder permisos SELECT en todas las secuencias (para los autoincrementales)
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO app;

-- Conceder permisos SELECT en las vistas (aunque ya se dieron en las tablas, pero por claridad)
GRANT SELECT ON vw_most_borrowed_books TO app;
GRANT SELECT ON vw_overdue_loans TO app;
GRANT SELECT ON vw_fines_summary TO app;
GRANT SELECT ON vw_member_activity TO app;
GRANT SELECT ON vw_inventory_health TO app;