-- Agregar columna para modo de horario personalizado
ALTER TABLE predios ADD COLUMN modo_horario_personalizado BOOLEAN DEFAULT FALSE AFTER horario_atencion;