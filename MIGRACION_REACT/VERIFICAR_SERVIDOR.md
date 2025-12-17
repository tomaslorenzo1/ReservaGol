# Verificación del Servidor

## Pasos para verificar que todo funcione:

### 1. Reiniciar el servidor backend
```bash
cd backend
npm start
```

### 2. Verificar que el servidor esté corriendo
Abrir en el navegador: `http://localhost:5000/api/test`

Debería mostrar:
```json
{
  "message": "API ReservaGol funcionando correctamente",
  "port": 5000,
  "uploadsPath": "C:\\xampp\\htdocs\\ReservaGol\\MIGRACION_REACT\\backend\\uploads",
  "timestamp": "2024-01-XX..."
}
```

### 3. Verificar archivos subidos
Abrir: `http://localhost:5000/api/list-uploads`

Debería mostrar la lista de archivos en uploads/predios/

### 4. Probar acceso directo a imagen
Usar el nombre completo del archivo de la base de datos:
`http://localhost:5000/uploads/predios/foto_portada_1765915581300-513350977.jpg`

### 5. Si no funciona, verificar:

**A. Que el directorio uploads/predios exista:**
- Ir a `backend/uploads/predios/`
- Verificar que los archivos estén ahí físicamente

**B. Permisos de carpeta (si es necesario):**
```bash
chmod 755 uploads/
chmod 755 uploads/predios/
```

**C. Puerto correcto:**
- Verificar que el backend esté en puerto 5000
- Verificar que no haya conflictos de puerto

### 6. Logs a revisar:
En el terminal del servidor backend deberías ver:
```
🚀 Servidor corriendo en puerto 5000
📁 Sirviendo archivos desde: C:\xampp\htdocs\ReservaGol\MIGRACION_REACT\backend\uploads
```

Cuando accedas a una imagen:
```
📷 Solicitando archivo: /predios/foto_portada_1765915581300-513350977.jpg
```