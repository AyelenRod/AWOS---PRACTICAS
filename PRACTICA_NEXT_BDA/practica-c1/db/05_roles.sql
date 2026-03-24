DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'user') THEN

      CREATE ROLE "user" WITH LOGIN PASSWORD 'con123456';
   END IF;
END
$do$;

GRANT CONNECT ON DATABASE library TO "user";
GRANT USAGE ON SCHEMA public TO "user";

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM "user";

GRANT SELECT ON vw_most_borrowed_books TO "user";
GRANT SELECT ON vw_overdue_loans TO "user";
GRANT SELECT ON vw_fines_summary TO "user";
GRANT SELECT ON vw_member_activity TO "user";
GRANT SELECT ON vw_inventory_health TO "user";


ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM "user";
