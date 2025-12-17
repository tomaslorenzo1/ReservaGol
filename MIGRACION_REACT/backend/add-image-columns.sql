-- Agregar columnas para imágenes en la tabla predios
ALTER TABLE predios 
ADD COLUMN IF NOT EXISTS foto_perfil VARCHAR(255) NULL COMMENT 'Nombre del archivo de foto de perfil',
ADD COLUMN IF NOT EXISTS foto_portada VARCHAR(255) NULL COMMENT 'Nombre del archivo de foto de portada',
ADD COLUMN IF NOT EXISTS archivo_politicas VARCHAR(255) NULL COMMENT 'Nombre del archivo PDF de políticas';

-- Verificar las columnas agregadas
DESCRIBE predios;