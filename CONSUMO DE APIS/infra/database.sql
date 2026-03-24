-- Este script de base de datos se incluye como requisito de infraestructura.
-- Dado que la API externa (Disney) funciona como nuestro "backend de datos", 
-- estas tablas de caché/logs se crearían en caso de implementar persistencia local.

CREATE DATABASE IF NOT EXISTS `soa_disney_db`;
USE `soa_disney_db`;

-- Tabla para guardar registros de búsquedas realizadas desde el frontend
CREATE TABLE IF NOT EXISTS `search_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `endpoint_called` VARCHAR(255) NOT NULL,
  `status` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para cachear personajes y evitar saturar la API externa (estrategia opcional)
CREATE TABLE IF NOT EXISTS `character_cache` (
  `disney_id` INT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `image_url` VARCHAR(500),
  `cached_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserción de ejemplo de prueba
INSERT INTO `search_logs` (`endpoint_called`, `status`) VALUES ('/api/items', 'SUCCESS');
