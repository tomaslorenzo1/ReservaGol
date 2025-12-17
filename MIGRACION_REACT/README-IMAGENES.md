# Funcionalidad de Carga de Imágenes

## Configuración

### 1. Base de Datos
Ejecutar el script SQL para agregar las columnas necesarias:
```sql
-- En phpMyAdmin o MySQL Workbench
source backend/add-image-columns.sql;
```

### 2. Estructura de Archivos
Las imágenes se guardan en:
```
backend/uploads/predios/
├── foto_perfil_1234567890-123456789.jpg
├── foto_portada_1234567890-987654321.jpg
└── archivo_politicas_1234567890-555666777.pdf
```

## Funcionalidades Implementadas

### 1. Componente ImageUpload
- **Drag & Drop**: Arrastra archivos directamente
- **Click to Upload**: Haz clic para abrir explorador
- **Preview**: Vista previa de la imagen
- **Validaciones**:
  - Solo imágenes (JPG, PNG, GIF)
  - Tamaño máximo configurable (3MB perfil, 5MB portada)
  - Mensajes de error claros

### 2. FormularioPredio Actualizado
- **Foto de Perfil**: 400x400px recomendado
- **Foto de Portada**: 1200x400px recomendado
- **Archivo de Políticas**: PDF opcional

### 3. Backend con Multer
- **Middleware de carga**: `uploadPredioFiles`
- **Validación de archivos**: Tipo y tamaño
- **Nombres únicos**: Timestamp + random
- **Servir archivos**: `/uploads/predios/`

## Uso

### Crear Predio
```javascript
const formData = new FormData();
formData.append('nombre', 'Mi Predio');
formData.append('foto_perfil', file1);
formData.append('foto_portada', file2);

await prediosService.createPredio(formData);
```

### Actualizar Predio
```javascript
const formData = new FormData();
formData.append('nombre', 'Nuevo Nombre');
// Solo agregar archivos si se cambiaron
if (nuevaFotoPerfil) {
  formData.append('foto_perfil', nuevaFotoPerfil);
}

await prediosService.updatePredio(id, formData);
```

## URLs de Imágenes

Las imágenes se acceden via:
```
http://localhost:5000/uploads/predios/foto_perfil_1234567890-123456789.jpg
```

## Comandos para Iniciar

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm start
```

## Notas Técnicas

- **Multer**: Maneja la carga de archivos
- **FormData**: Necesario para enviar archivos
- **Content-Type**: Se establece automáticamente como `multipart/form-data`
- **Archivos opcionales**: Solo se actualizan si se envían nuevos