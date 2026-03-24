# Evaluación Práctica - Dashboard de Biblioteca

Sistema de reportes SQL con Next.js y PostgreSQL utilizando Docker Compose.

## Características

- 5 reportes dinámicos con vistas SQL optimizadas
- Arquitectura segura con usuario de aplicación con permisos limitados
- Índices para optimización de consultas
- Interfaz responsiva con Tailwind CSS
- Despliegue automatizado con Docker

## Requisitos

- Docker y Docker Compose instalados
- Node.js 20+ (solo para desarrollo local)

## Configuración

1. Clonar el repositorio
2. Crear archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

3. Levantar los servicios:

```bash
docker compose up --build
```

4. Acceder a la aplicación en `http://localhost:3000`

## Estructura del Proyecto

```
.
├── db/
│   ├── 01_schema.sql      # Esquema de base de datos
│   ├── 02_seed.sql        # Datos de prueba
│   ├── 03_reports_vw.sql  # Vistas de reportes
│   ├── 04_indexes.sql     # Índices de optimización
│   └── 05_roles.sql       # Configuración de seguridad
├── src/
│   ├── app/               # Páginas Next.js
│   └── lib/
│       └── db.ts          # Conexión a PostgreSQL
└── docker-compose.yml
```

## Reportes Disponibles

1. **Top Libros Prestados**: Ranking con Window Functions
2. **Préstamos Vencidos**: CTE con cálculo de multas
3. **Resumen Financiero**: Agregación mensual con HAVING
4. **Actividad de Socios**: Análisis de comportamiento
5. **Salud de Inventario**: Estado por categoría

## Optimización de Base de Datos

### Índices Implementados

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

## Seguridad

### Verificación de Permisos

Se ha configurado un rol `app` con permisos minimizados (Principio de Menor Privilegio).

**Cómo verificar:**

1. Conectarse como usuario `app`:
```bash
docker exec -it library_db psql -U app -d postgres
```

2. **Prueba de Éxito** (Consultar vista autorizada):
```sql
SELECT * FROM vw_most_borrowed_books LIMIT 5;
-- Debería retornar resultados exitosamente
```

3. **Prueba de Fallo** (Intentar leer tabla protegida):
```sql
SELECT * FROM members;
-- ERROR: permission denied for table members
```

## Tecnologías

- Next.js 16 (App Router)
- PostgreSQL 16
- TypeScript
- Tailwind CSS
- Docker

## Licencia

MIT
