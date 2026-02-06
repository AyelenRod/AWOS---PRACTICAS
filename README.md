This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Database Optimization

### Indices Implementados
1. **`idx_loans_overdue_filter`**: Optimiza la identificación de préstamos no devueltos y vencidos.
2. **`idx_copies_book_id`**: Acelera los JOINs entre libros y sus copias físicas.
3. **`idx_loans_member_id`**: Mejora el rendimiento de reportes por usuario.

### Evidencia con EXPLAIN

#### Consulta 1: Buscar préstamos vencidos
**Antes (Sin Índice):**
```sql
EXPLAIN SELECT * FROM loans WHERE return_date IS NULL AND due_date < NOW();
-- Result: Seq Scan on loans  (cost=0.00..18.50 rows=5 width=36)
```

**Después (Con `idx_loans_overdue_filter`):**
```sql
EXPLAIN SELECT * FROM loans WHERE return_date IS NULL AND due_date < NOW();
-- Result: Bitmap Heap Scan on loans  (cost=4.20..14.30 rows=5 width=36)
--         -> Bitmap Index Scan on idx_loans_overdue_filter
```

#### Consulta 2: Contar copias por libro
**Antes (Sin Índice):**
```sql
EXPLAIN SELECT count(*) FROM copies WHERE book_id = 12;
-- Result: Seq Scan on copies  (cost=0.00..35.50 rows=10 width=4)
```

**Después (Con `idx_copies_book_id`):**
```sql
EXPLAIN SELECT count(*) FROM copies WHERE book_id = 12;
-- Result: Index Only Scan using idx_copies_book_id on copies  (cost=0.15..8.20 rows=10 width=4)
```

## Security Verification

Se ha configurado un rol `app` con permisos minimizados (**Principio de Menor Privilegio**).

**Cómo verificar:**
1. Conectarse como usuario `app`:
   ```bash
   psql -U app -d postgres -h localhost
   ```

2. **Prueba de Éxito** (Consultar vista autorizada):
   ```sql
   SELECT * FROM vw_most_borrowed_books LIMIT 5;
   -- Debería retornar resultados exitosamente.
   ```

3. **Prueba de Fallo** (Intentar leer tabla protegida):
   ```sql
   SELECT * FROM members;
   -- ERROR:  permission denied for table members
   ```

## Docker Deployment

La aplicación está contenerizada para facilitar su despliegue y pruebas.

### Requisitos
- Docker y Docker Compose instalados.
- Archivo `.env` configurado (ver `.env.example` o usar los valores por defecto).

### Ejecución
Para levantar la base de datos y la aplicación:

```bash
docker compose up --build
```

Esto iniciará:
- **Base de Datos**: PostgreSQL 16 en puerto configurado en `.env` (default 5432).
- **Frontend**: Next.js en `http://localhost:3000`.

**Nota**: El contenedor de BD ejecutar automáticamente los scripts de `db/` al iniciarse por primera vez.



