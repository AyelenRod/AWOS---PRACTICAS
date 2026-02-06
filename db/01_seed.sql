-- db/02_seed.sql

-- Miembros
INSERT INTO members (name, email, member_type, join_date) VALUES
('Ana García', 'ana.garcia@email.com', 'Premium', '2025-01-10'),
('Roberto Gómez', 'roberto.g@email.com', 'Regular', '2025-01-15'),
('Lucía Fernández', 'lucia.f@email.com', 'Estudiante', '2025-02-01'),
('Carlos Ruiz', 'c.ruiz@email.com', 'Regular', '2025-02-05'),
('Elena Beltrán', 'elena.b@email.com', 'Premium', '2025-02-10'),
('Miguel Torres', 'miguel.t@email.com', 'Regular', '2025-01-20'),
('Sofia Mendez', 'sofia.m@email.com', 'Estudiante', '2025-01-25'),
('Diego Castro', 'diego.c@email.com', 'Premium', '2025-02-03');

-- Libros
INSERT INTO books (title, category, author, isbn) VALUES
('Cien Años de Soledad', 'Ficción', 'Gabriel García Márquez', '978-0307474728'),
('Breve Historia del Tiempo', 'Ciencia', 'Stephen Hawking', '978-0553380163'),
('El Psicoanalista', 'Thriller', 'John Katzenbach', '978-1400034147'),
('Don Quijote de la Mancha', 'Clásico', 'Miguel de Cervantes', '978-8424116286'),
('Steve Jobs', 'Biografía', 'Walter Isaacson', '978-1451648539'),
('1984', 'Ficción', 'George Orwell', '978-0451524935'),
('Sapiens', 'Ciencia', 'Yuval Noah Harari', '978-0062316097'),
('El Código Da Vinci', 'Thriller', 'Dan Brown', '978-0307474278'),
('La Odisea', 'Clásico', 'Homero', '978-0140268867'),
('Elon Musk', 'Biografía', 'Ashlee Vance', '978-0062301239');

-- Copias
INSERT INTO copies (book_id, barcode, status) VALUES
(1, 'BC-001', 'loaned'),
(1, 'BC-002', 'available'),
(2, 'BC-003', 'loaned'),
(2, 'BC-004', 'available'),
(3, 'BC-005', 'loaned'),
(3, 'BC-006', 'available'),
(4, 'BC-007', 'available'),
(5, 'BC-008', 'reserved'),
(5, 'BC-009', 'available'),
(6, 'BC-010', 'loaned'),
(6, 'BC-011', 'available'),
(7, 'BC-012', 'loaned'),
(8, 'BC-013', 'loaned'),
(9, 'BC-014', 'available'),
(10, 'BC-015', 'available');

-- Préstamos
INSERT INTO loans (member_id, copy_id, loan_date, due_date, return_date) VALUES
(1, 1, '2025-01-15', '2025-01-22', '2025-01-20'),
(2, 3, '2025-01-20', '2025-01-27', '2025-02-05'),
(3, 5, '2025-02-01', '2025-02-08', NULL),
(1, 10, '2025-01-25', '2025-02-01', NULL),
(4, 12, '2025-02-05', '2025-02-12', NULL),
(5, 13, '2025-01-28', '2025-02-04', NULL),
(6, 1, '2025-01-22', '2025-01-29', '2025-01-28'),
(7, 3, '2025-02-06', '2025-02-13', NULL),
(1, 1, '2025-01-30', '2025-02-06', NULL);

-- Multas
INSERT INTO fines (loan_id, amount, paid_at) VALUES
(2, 15.50, '2025-02-06 10:30:00'),
(4, 25.00, NULL),
(6, 10.00, NULL);