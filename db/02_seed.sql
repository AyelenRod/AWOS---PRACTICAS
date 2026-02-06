-- db/seed.sql

-- Miembros
INSERT INTO members (name, email, member_type, join_date) VALUES
('Ana García', 'ana.garcia@email.com', 'Premium', '2025-01-10'),
('Roberto Gómez', 'roberto.g@email.com', 'Regular', '2025-01-15'),
('Lucía Fernández', 'lucia.f@email.com', 'Estudiante', '2025-02-01'),
('Carlos Ruiz', 'c.ruiz@email.com', 'Regular', '2025-02-05'),
('Elena Beltrán', 'elena.b@email.com', 'Premium', '2025-02-10');

-- Libros
INSERT INTO books (title, category, author, isbn) VALUES
('Cien Años de Soledad', 'Ficción', 'Gabriel García Márquez', '978-0307474728'),
('Breve Historia del Tiempo', 'Ciencia', 'Stephen Hawking', '978-0553380163'),
('El Psicoanalista', 'Thriller', 'John Katzenbach', '978-1400034147'),
('Don Quijote de la Mancha', 'Clásico', 'Miguel de Cervantes', '978-8424116286'),
('Steve Jobs', 'Biografía', 'Walter Isaacson', '978-1451648539');

-- Copias
INSERT INTO copies (book_id, barcode, status) VALUES
(1, 'BC-001', 'loaned'),
(1, 'BC-002', 'available'),
(2, 'BC-003', 'loaned'),
(3, 'BC-004', 'loaned'),
(4, 'BC-005', 'available'),
(5, 'BC-006', 'reserved'),
(5, 'BC-007', 'available');

-- Préstamos
INSERT INTO loans (member_id, copy_id, loan_date, due_date, return_date) VALUES
(1, 1, '2025-01-15', '2025-01-22', '2025-01-20'), 
(2, 3, '2025-01-20', '2025-01-27', '2025-02-01'), 
(3, 4, '2025-02-01', '2025-02-08', NULL), 
(1, 1, '2025-01-25', '2025-02-01', NULL); 

-- Multas
INSERT INTO fines (loan_id, amount, paid_at) VALUES
(2, 15.50, TRUE),
(4, 25.00, FALSE);