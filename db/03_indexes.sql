-- db/indexes.sql

-- Índice para búsqueda de préstamos vencidos
CREATE INDEX idx_loans_overdue_filter ON loans(due_date) WHERE return_date IS NULL;

-- Índice en Foreign Key de Copias
CREATE INDEX idx_copies_book_id ON copies(book_id);

-- Índice en Foreign Key de Préstamos (Member)
CREATE INDEX idx_loans_member_id ON loans(member_id);