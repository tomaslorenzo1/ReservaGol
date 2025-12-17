const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configurar almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/predios');
    
    // Crear directorio si no existe
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generar nombre único para el archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const fieldName = file.fieldname; // foto_perfil o foto_portada
    
    cb(null, `${fieldName}_${uniqueSuffix}${extension}`);
  }
});

// Filtro para validar tipos de archivo
const fileFilter = (req, file, cb) => {
  // Permitir PDFs para contratos
  if (file.fieldname === 'contrato_archivo') {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos PDF para contratos'), false);
    }
  }
  // Permitir solo imágenes para fotos
  else if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen'), false);
  }
};

// Configurar multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB máximo para PDFs
  }
});

// Middleware para manejar múltiples archivos de predio
const uploadPredioFiles = upload.fields([
  { name: 'foto_perfil', maxCount: 1 },
  { name: 'foto_portada', maxCount: 1 },
  { name: 'contrato_archivo', maxCount: 1 }
]);

module.exports = {
  uploadPredioFiles,
  upload
};