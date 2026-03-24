INSERT INTO members (name, email, member_type, joined_at) VALUES
('Alice Johnson', 'alice@example.com', 'STUDENT', '2023-01-15'),
('Bob Smith', 'bob@example.com', 'TEACHER', '2023-02-20'),
('Charlie Brown', 'charlie@example.com', 'STUDENT', '2023-03-10'),
('Diana Prince', 'diana@example.com', 'ALUMNI', '2023-01-05'),
('Evan Wright', 'evan@example.com', 'STUDENT', '2023-04-12'),
('Fiona Gallagher', 'fiona@example.com', 'STUDENT', '2023-05-25'),
('George Martin', 'george@example.com', 'TEACHER', '2023-02-14'),
('Hannah Abbott', 'hannah@example.com', 'STUDENT', '2023-06-30'),
('Ian Malcolm', 'ian@example.com', 'VISITOR', '2023-07-01'),
('Julia Stiles', 'julia@example.com', 'STUDENT', '2023-08-15'),
('Kevin Bacon', 'kevin@example.com', 'ALUMNI', '2023-01-20'),
('Laura Croft', 'laura@example.com', 'STUDENT', '2023-09-05'),
('Mike Wazowski', 'mike@example.com', 'STUDENT', '2023-10-10'),
('Nancy Wheeler', 'nancy@example.com', 'TEACHER', '2023-03-22'),
('Oscar Martinez', 'oscar@example.com', 'STUDENT', '2023-11-01');

INSERT INTO books (title, author, category, isbn) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', 'Fiction', '9780743273565'),
('To Kill a Mockingbird', 'Harper Lee', 'Fiction', '9780061120084'),
('1984', 'George Orwell', 'Dystopian', '9780451524935'),
('Pride and Prejudice', 'Jane Austen', 'Romance', '9780141439518'),
('The Catcher in the Rye', 'J.D. Salinger', 'Fiction', '9780316769488'),
('Moby Dick', 'Herman Melville', 'Adventure', '9780142437247'),
('War and Peace', 'Leo Tolstoy', 'Historical', '9780199232765'),
('Hamlet', 'William Shakespeare', 'Drama', '9780743477123'),
('The Odyssey', 'Homer', 'Epic', '9780140268867'),
('Ulysses', 'James Joyce', 'Modernist', '9780679722762');

INSERT INTO copies (book_id, barcode, status) VALUES
(1, 'GATSBY-001', 'LOANED'),
(1, 'GATSBY-002', 'AVAILABLE'),
(1, 'GATSBY-003', 'LOST'),
(2, 'MOCKING-001', 'LOANED'),
(2, 'MOCKING-002', 'LOANED'),
(3, '1984-001', 'AVAILABLE'),
(3, '1984-002', 'LOANED'),
(4, 'PRIDE-001', 'MAINTENANCE'),
(5, 'CATCHER-001', 'AVAILABLE'),
(6, 'MOBY-001', 'LOANED'),
(7, 'WAR-001', 'AVAILABLE'),
(8, 'HAMLET-001', 'LOANED'),
(9, 'ODYSSEY-001', 'AVAILABLE'),
(10, 'ULYSSES-001', 'LOANED');


INSERT INTO loans (copy_id, member_id, loaned_at, due_at, returned_at) VALUES
(1, 1, '2023-10-01', '2023-10-15', NULL),
(4, 2, '2023-10-05', '2023-10-19', NULL), 
(5, 3, '2023-11-01', '2023-11-15', '2023-11-10'), 
(7, 4, '2023-09-01', '2023-09-15', NULL), 
(10, 5, '2023-11-10', '2023-11-24', NULL), 
(12, 6, '2023-11-12', '2023-11-26', NULL),
(14, 7, '2023-08-15', '2023-08-29', '2023-09-05'), 
(2, 8, '2023-10-20', '2023-11-03', '2023-11-01'), 
(1, 9, '2023-06-01', '2023-06-15', '2023-06-14'), 
(1, 10, '2023-07-01', '2023-07-15', '2023-07-20');

INSERT INTO fines (loan_id, amount, paid_at) VALUES
(4, 15.00, NULL), 
(7, 5.00, '2023-09-06'), 
(10, 2.50, NULL); 
