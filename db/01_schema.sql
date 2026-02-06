-- db/schema.sql

DROP TABLE IF EXISTS members;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS copies;
DROP TABLE IF EXISTS loans;
DROP TABLE IF EXISTS fines;

-- Tabla de Miembros
CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    member_type VARCHAR(50) NOT NULL,
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Libros
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    author VARCHAR(100) NOT NULL
    isbn VARCHAR(20) UNIQUE NOT NULL
);

-- Tabla de Copias
CREATE TABLE copies (
    id SERIAL PRIMARY KEY,
    book_id INT REFERENCES books(id),
    barcode VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(20) CHECK (status IN ('available', 'loaned', 'reserved')) DEFAULT 'available'
);

-- Tabla de Préstamos
CREATE TABLE loans (
    id SERIAL PRIMARY KEY,
    member_id INT REFERENCES members(id),
    copy_id INT REFERENCES copies(id),
    loan_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP NOT NULL,
    return_date TIMESTAMP
);

-- Tabla de Multas
CREATE TABLE fines (
    id SERIAL PRIMARY KEY,
    loan_id INT REFERENCES loans(id),
    amount DECIMAL(10, 2) NOT NULL,
    paid_at BOOLEAN DEFAULT FALSE
);