const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const multer = require('multer');
const path = require('path');

// Importar rutas
const usuariosRoutes = require('./routes/usuarios');
const turnosRoutes = require('./routes/turnos');
const canchasRoutes = require('./routes/canchas');
const prediosRoutes = require('./routes/predios');
const uploadRoutes = require('./routes/upload');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Manejo de errores de multer
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Archivo demasiado grande' });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: 'Campo de archivo inesperado' });
    }
  }
  next(error);
});

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ReservaGol API',
      version: '1.0.0',
      description: 'API REST para Sistema de Gestión de Turnos - ReservaGol',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Servidor de desarrollo',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/turnos', turnosRoutes);
app.use('/api/canchas', canchasRoutes);
app.use('/api/predios', prediosRoutes);
app.use('/api/upload', uploadRoutes);

// Middleware para logging de archivos estáticos (ANTES de servir)
app.use('/uploads', (req, res, next) => {
  console.log('📷 Solicitando archivo:', req.path);
  next();
});

// Servir archivos estáticos con path absoluto
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log('📁 Sirviendo archivos desde:', path.join(__dirname, 'uploads'));

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API ReservaGol funcionando correctamente',
    port: PORT,
    uploadsPath: path.join(__dirname, 'uploads'),
    timestamp: new Date().toISOString()
  });
});

// Ruta para listar archivos en uploads/predios
app.get('/api/list-uploads', (req, res) => {
  const fs = require('fs');
  const uploadsPath = path.join(__dirname, 'uploads', 'predios');
  
  try {
    if (fs.existsSync(uploadsPath)) {
      const files = fs.readdirSync(uploadsPath);
      res.json({ 
        path: uploadsPath,
        files: files.map(file => ({
          name: file,
          url: `http://localhost:${PORT}/uploads/predios/${file}`
        }))
      });
    } else {
      res.json({ error: 'Directorio uploads/predios no existe', path: uploadsPath });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para verificar archivos
app.get('/api/test-file/:filename', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join(__dirname, 'uploads', 'predios', req.params.filename);
  
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    res.json({ 
      exists: true, 
      size: stats.size,
      path: filePath,
      url: `http://localhost:5000/uploads/predios/${req.params.filename}`
    });
  } else {
    res.json({ exists: false, path: filePath });
  }
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Ruta no encontrada
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📚 Documentación Swagger: http://localhost:${PORT}/api-docs`);
});