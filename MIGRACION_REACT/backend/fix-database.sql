-- Arreglar tabla usuarios para React
-- Ejecutar en phpMyAdmin

-- Verificar si existe la columna tipo
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS tipo ENUM('jugador', 'propietario', 'admin') DEFAULT 'jugador';

-- Actualizar usuarios existentes con tipo por defecto
UPDATE usuarios SET tipo = 'propietario' WHERE email LIKE '%propietario%' OR email LIKE '%owner%';
UPDATE usuarios SET tipo = 'admin' WHERE email LIKE '%admin%';
UPDATE usuarios SET tipo = 'jugador' WHERE tipo IS NULL;

-- Verificar estructura
DESCRIBE usuarios;