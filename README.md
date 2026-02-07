# Library SQL Reporting Dashboard

A Next.js application visualizing PostgreSQL Views with strict security and Docker Compose support.

## Prerequisites
- Docker & Docker Compose

## Quick Start
1. Create a `.env` file in the root directory:
   ```env
   # Database Superuser (for initialization)
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=password
   POSTGRES_DB=library

   # Application User (Restricted Access)
   APP_USER=user
   APP_PASSWORD=con123456
   ```
2. Run the application:
   ```bash
   docker compose up --build
   ```
3. Open [http://localhost:3000](http://localhost:3000)

## Architecture

### Database
- **Tables**: `members`, `books`, `copies`, `loans`, `fines`
- **Views**:
  - `vw_most_borrowed_books`: Top books by loan count (Window Function).
  - `vw_overdue_loans`: Active overdue loans with penalties (CTE + CASE).
  - `vw_fines_summary`: Monthly breakdown of paid vs pending fines.
  - `vw_member_activity`: Member stats and return reliability.
  - `vw_inventory_health`: Categorized inventory status.

### Security
The application connects as `user` (password: `con123456`), NOT `postgres`.
This user has **SELECT-only access to VIEWS**. It cannot query tables directly.

**Verify Security:**
1. Connect to the database container:
   ```bash
   docker exec -it library_db psql -U user -d library
   ```
2. Try to query a table (Should FAIL):
   ```sql
   SELECT * FROM members;
   -- ERROR: permission denied for table members
   ```
3. Try to query a view (Should SUCCEED):
   ```sql
   SELECT * FROM vw_most_borrowed_books;
   ```

### Performance (Indexes)
Indices have been created on Foreign Keys and filtered columns.

**Verify Indexes:**
Run these inside the postgres container (as `postgres` user for full output, or `user` if allowed).
```bash
docker exec -it library_db psql -U postgres -d library
```

Query 1 (Overdue Loans):
```sql
EXPLAIN ANALYZE SELECT * FROM loans WHERE due_at < CURRENT_DATE;
```
*Expected*: Usage of `idx_loans_due_at`.

Query 2 (Book Search):
```sql
EXPLAIN ANALYZE SELECT * FROM books WHERE title = 'The Great Gatsby';
```
*Expected*: Usage of `idx_books_title`.

## Project Structure
- `db/`: SQL init scripts (Schema, Seed, Views, Roles).
- `src/app/`: Next.js App Router pages.
- `src/lib/db.ts`: Database connection (using `pg`).
- `docker-compose.yml`: Stack definition.
