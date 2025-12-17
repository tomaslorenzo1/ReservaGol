# Solución para el Problema de Imágenes

## Pasos para Debuggear y Solucionar

### 1. Verificar Base de Datos
Ejecutar en phpMyAdmin:
```sql
-- Verificar que existan las columnas
DESCRIBE predios;

-- Si no existe la columna contrato_archivo, ejecutar:
ALTER TABLE predios ADD COLUMN contrato_archivo VARCHAR(255) NULL AFTER foto_portada;
```

### 2. Verificar Permisos de Carpeta
En el servidor, verificar que la carpeta tenga permisos de escritura:
```bash
# En la carpeta backend
chmod 755 uploads/
chmod 755 uploads/predios/
```

### 3. Probar la Funcionalidad
1. Abrir la consola del navegador (F12)
2. Ir a "Gestión de Página" → "Editar Información"
3. Seleccionar imágenes
4. Verificar que aparezca el panel DEBUG con los archivos
5. Hacer clic en "Guardar Cambios"
6. Revisar los logs en la consola

### 4. Logs a Revisar

**Frontend (Consola del navegador):**
- 📸 Archivos detectados
- 📦 FormData entries
- 🚀 Enviando FormData al servidor
- ✅ FormData enviado exitosamente

**Backend (Terminal del servidor):**
- === ACTUALIZAR PREDIO ===
- Archivos recibidos
- 📸 Archivos procesados
- Resultado de la actualización

### 5. Posibles Problemas y Soluciones

**Problema 1: Archivos no llegan al servidor**
- Verificar que el FormData se construya correctamente
- Verificar que no se establezcan headers incorrectos

**Problema 2: Archivos llegan pero no se guardan**
- Verificar permisos de la carpeta uploads/predios/
- Verificar que la columna exista en la base de datos

**Problema 3: Se guardan pero no se muestran**
- Verificar que el servidor sirva archivos estáticos desde /uploads
- Verificar la URL de las imágenes en la vista previa

### 6. URLs de Verificación
- Servidor backend: http://localhost:5000
- Archivos estáticos: http://localhost:5000/uploads/predios/
- API de predios: http://localhost:5000/api/predios

### 7. Estructura de Archivos Esperada
```
backend/
├── uploads/
│   └── predios/
│       ├── foto_perfil_1234567890-123456789.jpg
│       ├── foto_portada_1234567890-987654321.jpg
│       └── contrato_archivo_1234567890-555666777.pdf
```

## Cambios Realizados para Debug

1. **Eliminado texto duplicado de horarios** ✅
2. **Agregado panel de debug** para ver archivos seleccionados
3. **Mejorado logging** en frontend y backend
4. **Verificado configuración** de FormData y headers

## Próximos Pasos

1. Probar la funcionalidad con las mejoras de debug
2. Revisar logs para identificar dónde falla el proceso
3. Aplicar la solución específica según los logs
4. Remover el panel de debug una vez solucionado