const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/database');

const router = express.Router();

// Configuración de multer para subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/predios');
    console.log('Directorio de destino:', uploadPath);
    
    // Crear directorio si no existe
    if (!fs.existsSync(uploadPath)) {
      console.log('Creando directorio:', uploadPath);
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const filename = `predio_${req.body.predio_id}_${req.body.tipo}_${uniqueSuffix}${extension}`;
    console.log('Nombre de archivo generado:', filename);
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  console.log('Validando archivo:', file.originalname, file.mimetype);
  // Permitir solo imágenes
  if (file.mimetype.startsWith('image/')) {
    console.log('Archivo válido');
    cb(null, true);
  } else {
    console.log('Archivo inválido - no es imagen');
    cb(new Error('Solo se permiten archivos de imagen'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  }
});

/**
 * @swagger
 * /api/upload/predio-foto:
 *   post:
 *     summary: Subir foto de predio (portada o perfil)
 *     tags: [Upload]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: foto
 *         type: file
 *         required: true
 *         description: Archivo de imagen
 *       - in: formData
 *         name: predio_id
 *         type: integer
 *         required: true
 *         description: ID del predio
 *       - in: formData
 *         name: tipo
 *         type: string
 *         required: true
 *         description: Tipo de foto (portada o perfil)
 *     responses:
 *       200:
 *         description: Foto subida exitosamente
 */
router.post('/predio-foto', upload.single('foto'), async (req, res) => {
  try {
    console.log('=== INICIO SUBIDA DE FOTO ===');
    console.log('Body:', req.body);
    console.log('File:', req.file ? { filename: req.file.filename, size: req.file.size, mimetype: req.file.mimetype } : 'No file');
    
    const { predio_id, tipo } = req.body;
    
    if (!req.file) {
      console.log('ERROR: No se recibió archivo');
      return res.status(400).json({ error: 'No se recibió ningún archivo' });
    }

    if (!['portada', 'perfil'].includes(tipo)) {
      console.log('ERROR: Tipo inválido:', tipo);
      return res.status(400).json({ error: 'Tipo de foto inválido' });
    }

    if (!predio_id) {
      console.log('ERROR: No se recibió predio_id');
      return res.status(400).json({ error: 'ID de predio requerido' });
    }

    console.log('Verificando predio en BD...');
    // Verificar que el predio existe
    const [predioCheck] = await db.execute(
      'SELECT id FROM predios WHERE id = ?',
      [predio_id]
    );

    if (predioCheck.length === 0) {
      console.log('ERROR: Predio no encontrado:', predio_id);
      return res.status(404).json({ error: 'Predio no encontrado' });
    }

    // Obtener la foto anterior para eliminarla
    console.log('Obteniendo foto anterior...');
    const [predios] = await db.execute(
      `SELECT ${tipo === 'portada' ? 'foto_portada' : 'foto_perfil'} FROM predios WHERE id = ?`,
      [predio_id]
    );

    const fotoAnterior = predios[0]?.[tipo === 'portada' ? 'foto_portada' : 'foto_perfil'];
    console.log('Foto anterior:', fotoAnterior);

    // Eliminar foto anterior si existe
    if (fotoAnterior) {
      const rutaAnterior = path.join(__dirname, '../uploads/predios', path.basename(fotoAnterior));
      console.log('Eliminando foto anterior:', rutaAnterior);
      if (fs.existsSync(rutaAnterior)) {
        fs.unlinkSync(rutaAnterior);
        console.log('Foto anterior eliminada');
      }
    }

    // Generar URL de la nueva foto
    const fotoUrl = `/uploads/predios/${req.file.filename}`;
    console.log('Nueva URL de foto:', fotoUrl);

    // Actualizar base de datos
    const campo = tipo === 'portada' ? 'foto_portada' : 'foto_perfil';
    console.log('Actualizando BD, campo:', campo);
    
    const [updateResult] = await db.execute(
      `UPDATE predios SET ${campo} = ? WHERE id = ?`,
      [fotoUrl, predio_id]
    );
    
    console.log('Resultado actualización BD:', updateResult);

    const response = {
      message: 'Foto subida exitosamente',
      url: fotoUrl,
      tipo: tipo,
      filename: req.file.filename
    };
    
    console.log('Respuesta exitosa:', response);
    console.log('=== FIN SUBIDA DE FOTO ===');
    
    res.json(response);

  } catch (error) {
    console.error('=== ERROR SUBIENDO FOTO ===');
    console.error('Error completo:', error);
    console.error('Stack:', error.stack);
    
    // Eliminar archivo si hubo error
    if (req.file && fs.existsSync(req.file.path)) {
      console.log('Eliminando archivo por error:', req.file.path);
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message
    });
  }
});

/**
 * @swagger
 * /api/upload/eliminar-foto:
 *   delete:
 *     summary: Eliminar foto de predio
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               predio_id:
 *                 type: integer
 *               tipo:
 *                 type: string
 *                 enum: [portada, perfil]
 *     responses:
 *       200:
 *         description: Foto eliminada exitosamente
 */
router.delete('/eliminar-foto', async (req, res) => {
  try {
    const { predio_id, tipo } = req.body;

    if (!['portada', 'perfil'].includes(tipo)) {
      return res.status(400).json({ error: 'Tipo de foto inválido' });
    }

    // Obtener la foto actual
    const [predios] = await db.execute(
      `SELECT ${tipo === 'portada' ? 'foto_portada' : 'foto_perfil'} FROM predios WHERE id = ?`,
      [predio_id]
    );

    const fotoActual = predios[0]?.[tipo === 'portada' ? 'foto_portada' : 'foto_perfil'];

    if (fotoActual) {
      // Eliminar archivo físico
      const rutaArchivo = path.join(__dirname, '../../uploads/predios', path.basename(fotoActual));
      if (fs.existsSync(rutaArchivo)) {
        fs.unlinkSync(rutaArchivo);
      }

      // Actualizar base de datos
      const campo = tipo === 'portada' ? 'foto_portada' : 'foto_perfil';
      await db.execute(
        `UPDATE predios SET ${campo} = NULL, fecha_actualizacion = NOW() WHERE id = ?`,
        [predio_id]
      );
    }

    res.json({ message: 'Foto eliminada exitosamente' });

  } catch (error) {
    console.error('Error eliminando foto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;