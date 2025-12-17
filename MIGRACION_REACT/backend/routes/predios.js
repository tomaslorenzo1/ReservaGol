const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configurar multer directamente
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/predios');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}_${uniqueSuffix}${extension}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'contrato_archivo') {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Solo se permiten archivos PDF para contratos'), false);
      }
    } else if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

const uploadFields = upload.fields([
  { name: 'foto_perfil', maxCount: 1 },
  { name: 'foto_portada', maxCount: 1 },
  { name: 'contrato_archivo', maxCount: 1 }
]);

/**
 * @swagger
 * /api/predios:
 *   get:
 *     summary: Listar todos los predios
 *     tags: [Predios]
 *     responses:
 *       200:
 *         description: Lista de predios
 */
router.get('/', async (req, res) => {
  try {
    const [predios] = await db.execute(`
      SELECT p.*, u.nombre as propietario_nombre
      FROM predios p
      LEFT JOIN usuarios u ON p.propietario_id = u.id
      WHERE p.activo = 1
      ORDER BY p.nombre
    `);

    res.json(predios);
  } catch (error) {
    console.error('Error obteniendo predios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/predios/propietario/{propietario_id}:
 *   get:
 *     summary: Obtener predio por propietario
 *     tags: [Predios]
 *     parameters:
 *       - in: path
 *         name: propietario_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Predio del propietario
 */
router.get('/propietario/:propietario_id', async (req, res) => {
  try {
    const { propietario_id } = req.params;
    console.log('🔍 Buscando predio para propietario_id:', propietario_id);

    const [predios] = await db.execute(`
      SELECT * FROM predios 
      WHERE propietario_id = ? AND activo = 1
      LIMIT 1
    `, [propietario_id]);
    
    console.log('📊 Resultados encontrados:', predios.length);
    if (predios.length > 0) {
      console.log('✅ Predio encontrado:', {
        id: predios[0].id,
        nombre: predios[0].nombre,
        propietario_id: predios[0].propietario_id
      });
    }

    if (predios.length === 0) {
      console.log('❌ No se encontró predio para propietario_id:', propietario_id);
      return res.status(404).json({ error: 'Predio no encontrado' });
    }

    res.json(predios[0]);
  } catch (error) {
    console.error('Error obteniendo predio:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/predios:
 *   post:
 *     summary: Crear nuevo predio
 *     tags: [Predios]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               propietario_id:
 *                 type: integer
 *               nombre:
 *                 type: string
 *               direccion:
 *                 type: string
 *               ciudad:
 *                 type: string
 *               provincia:
 *                 type: string
 *               foto_perfil:
 *                 type: string
 *                 format: binary
 *               foto_portada:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Predio creado exitosamente
 */
router.post('/', uploadFields, async (req, res) => {
  try {
    console.log('=== CREAR PREDIO ===');
    console.log('Datos recibidos:', req.body);
    console.log('Archivos recibidos:', req.files);
    console.log('==================');
    
    // Validar campos requeridos
    const { propietario_id, nombre, direccion, ciudad, provincia } = req.body;
    
    if (!propietario_id || !nombre || !direccion || !ciudad || !provincia) {
      return res.status(400).json({ 
        error: 'Campos requeridos faltantes',
        required: ['propietario_id', 'nombre', 'direccion', 'ciudad', 'provincia']
      });
    }

    const {
      telefono, descripcion, descripcion_larga, horario_apertura, horario_cierre,
      servicios_adicionales, horario_atencion, politicas_cancelacion,
      servicios_disponibles, coordenadas_lat, coordenadas_lng, link_maps,
      link_instagram, link_facebook, link_tiktok, link_x, link_whatsapp,
      modo_horario_personalizado
    } = req.body;

    console.log('🕰️ modo_horario_personalizado recibido:', modo_horario_personalizado);

    // Procesar archivos subidos
    const fotoPerfil = req.files?.foto_perfil?.[0]?.filename || null;
    const fotoPortada = req.files?.foto_portada?.[0]?.filename || null;
    const contratoArchivo = req.files?.contrato_archivo?.[0]?.filename || null;

    const [result] = await db.execute(`
      INSERT INTO predios (
        propietario_id, nombre, direccion, ciudad, provincia,
        telefono, descripcion, descripcion_larga, horario_apertura, horario_cierre,
        servicios_adicionales, horario_atencion, politicas_cancelacion,
        servicios_disponibles, coordenadas_lat, coordenadas_lng, link_maps,
        link_instagram, link_facebook, link_tiktok, link_x, link_whatsapp,
        foto_perfil, foto_portada, contrato_archivo, modo_horario_personalizado,
        activo, fecha_registro
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW())
    `, [
      propietario_id, nombre, direccion, ciudad, provincia,
      telefono || null, descripcion || null, descripcion_larga || null,
      horario_apertura || '08:00:00', horario_cierre || '23:00:00',
      servicios_adicionales || null, horario_atencion || null,
      politicas_cancelacion || null, servicios_disponibles || null,
      coordenadas_lat || null, coordenadas_lng || null, link_maps || null,
      link_instagram || null, link_facebook || null, link_tiktok || null,
      link_x || null, link_whatsapp || null,
      fotoPerfil, fotoPortada, contratoArchivo, modo_horario_personalizado || null
    ]);

    res.status(201).json({
      message: 'Predio creado exitosamente',
      predioId: result.insertId
    });

  } catch (error) {
    console.error('Error creando predio:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/predios/{id}:
 *   put:
 *     summary: Actualizar predio
 *     tags: [Predios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Predio actualizado exitosamente
 */
router.put('/:id', uploadFields, async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('=== ACTUALIZAR PREDIO ===');
    console.log('ID del predio:', id);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Horario_atencion recibido:', req.body.horario_atencion);
    console.log('Datos recibidos:', req.body);
    console.log('Archivos recibidos:', req.files ? Object.keys(req.files) : 'NO HAY ARCHIVOS');
    console.log('Eliminar foto_perfil:', req.body.eliminar_foto_perfil);
    console.log('Eliminar foto_portada:', req.body.eliminar_foto_portada);
    if (req.files) {
      Object.entries(req.files).forEach(([key, files]) => {
        console.log(`📸 ${key}:`, files.map(f => `${f.originalname} (${f.size} bytes)`));
      });
    }
    console.log('========================');
    
    const {
      nombre, direccion, ciudad, provincia, telefono,
      descripcion, descripcion_larga, horario_apertura, horario_cierre,
      servicios_adicionales, redes_sociales, horario_atencion,
      politicas_cancelacion, servicios_disponibles, coordenadas_lat,
      coordenadas_lng, link_maps, link_instagram, link_facebook,
      link_tiktok, link_x, link_whatsapp
    } = req.body;

    // Procesar archivos subidos (solo si se enviaron nuevos)
    const fotoPerfil = req.files?.foto_perfil?.[0]?.filename || null;
    const fotoPortada = req.files?.foto_portada?.[0]?.filename || null;
    const contratoArchivo = req.files?.contrato_archivo?.[0]?.filename || null;
    
    console.log('📸 Archivos procesados:');
    console.log('- Foto perfil:', fotoPerfil);
    console.log('- Foto portada:', fotoPortada);
    console.log('- Contrato:', contratoArchivo);

    // Construir query dinámicamente para solo actualizar campos que cambiaron
    let updateFields = [];
    let updateValues = [];
    
    // Campos básicos
    const basicFields = {
      nombre, direccion, ciudad, provincia, telefono,
      descripcion: descripcion || null,
      descripcion_larga: descripcion_larga || null,
      horario_apertura: horario_apertura || '08:00:00',
      horario_cierre: horario_cierre || '23:00:00',
      servicios_adicionales: servicios_adicionales || null,
      redes_sociales: redes_sociales || null,
      horario_atencion: horario_atencion || null,
      politicas_cancelacion: politicas_cancelacion || null,
      servicios_disponibles: servicios_disponibles || null,
      coordenadas_lat: coordenadas_lat || null,
      coordenadas_lng: coordenadas_lng || null,
      link_maps: link_maps || null,
      link_instagram: link_instagram || null,
      link_facebook: link_facebook || null,
      link_tiktok: link_tiktok || null,
      link_x: link_x || null,
      link_whatsapp: link_whatsapp || null,
      modo_horario_personalizado: modo_horario_personalizado || null
    };
    
    // Agregar campos básicos
    Object.entries(basicFields).forEach(([key, value]) => {
      if (value !== undefined) {
        updateFields.push(`${key} = ?`);
        updateValues.push(value);
      }
    });
    
    // Agregar archivos solo si se subieron nuevos
    if (fotoPerfil) {
      updateFields.push('foto_perfil = ?');
      updateValues.push(fotoPerfil);
    }
    if (fotoPortada) {
      updateFields.push('foto_portada = ?');
      updateValues.push(fotoPortada);
    }
    if (contratoArchivo) {
      updateFields.push('contrato_archivo = ?');
      updateValues.push(contratoArchivo);
    }
    
    // Eliminar imágenes si se solicita
    console.log('🔍 Verificando eliminación de imágenes...');
    console.log('eliminar_foto_perfil value:', req.body.eliminar_foto_perfil, 'type:', typeof req.body.eliminar_foto_perfil);
    console.log('eliminar_foto_portada value:', req.body.eliminar_foto_portada, 'type:', typeof req.body.eliminar_foto_portada);
    
    if (req.body.eliminar_foto_perfil === 'true' || req.body.eliminar_foto_perfil === true) {
      updateFields.push('foto_perfil = ?');
      updateValues.push(null);
      console.log('🗑️ ELIMINANDO foto_perfil de la base de datos');
    }
    if (req.body.eliminar_foto_portada === 'true' || req.body.eliminar_foto_portada === true) {
      updateFields.push('foto_portada = ?');
      updateValues.push(null);
      console.log('🗑️ ELIMINANDO foto_portada de la base de datos');
    }
    
    console.log('📝 Campos a actualizar:', updateFields);
    console.log('📝 Valores:', updateValues.slice(0, -1)); // Sin el ID
    console.log('🕰️ Horario_atencion que se va a guardar:', horario_atencion);
    
    // Agregar fecha de actualización y el ID al final
    updateFields.push('fecha_actualizacion = NOW()');
    updateValues.push(id);
    
    const [result] = await db.execute(`
      UPDATE predios SET ${updateFields.join(', ')}
      WHERE id = ?
    `, updateValues);

    console.log('Resultado de la actualización:', result);
    console.log('📸 Archivos que se actualizaron:');
    if (fotoPerfil) console.log('- Foto perfil actualizada:', fotoPerfil);
    if (fotoPortada) console.log('- Foto portada actualizada:', fotoPortada);
    if (contratoArchivo) console.log('- Contrato actualizado:', contratoArchivo);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Predio no encontrado' });
    }

    res.json({ 
      message: 'Predio actualizado exitosamente',
      affectedRows: result.affectedRows
    });

  } catch (error) {
    console.error('Error actualizando predio:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message
    });
  }
});

module.exports = router;