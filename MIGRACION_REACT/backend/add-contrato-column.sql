-- Agregar columna para archivo de contrato en la tabla predios
ALTER TABLE predios ADD COLUMN contrato_archivo VARCHAR(255) NULL AFTER foto_portada;

-- Comentario para documentar el cambio
ALTER TABLE predios MODIFY COLUMN contrato_archivo VARCHAR(255) NULL COMMENT 'Nombre del archivo PDF del contrato subido';