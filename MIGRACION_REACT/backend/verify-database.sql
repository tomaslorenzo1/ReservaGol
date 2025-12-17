-- Verificar estructura de la tabla predios
DESCRIBE predios;

-- Verificar si existen las columnas de imágenes
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'predios' 
AND COLUMN_NAME IN ('foto_perfil', 'foto_portada', 'contrato_archivo');

-- Verificar datos actuales de predios
SELECT id, nombre, foto_perfil, foto_portada, contrato_archivo 
FROM predios 
ORDER BY id DESC 
LIMIT 5;