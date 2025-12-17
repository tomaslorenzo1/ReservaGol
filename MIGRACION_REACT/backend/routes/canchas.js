const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');

const router = express.Router();

/**
 * @swagger
 * /api/canchas:
 *   get:
 *     summary: Listar todas las canchas
 *     tags: [Canchas]
 *     responses:
 *       200:
 *         description: Lista de canchas
 */
router.get('/', async (req, res) => {
  try {
    const [canchas] = await db.execute(`
      SELECT c.*, p.nombre as predio_nombre, p.direccion as predio_direccion
      FROM canchas c
      LEFT JOIN predios p ON c.predio_id = p.id
      WHERE c.activa = 1
      ORDER BY p.nombre, c.nombre
    `);

    res.json(canchas);
  } catch (error) {
    console.error('Error obteniendo canchas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/canchas:
 *   post:
 *     summary: Crear nueva cancha
 *     tags: [Canchas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               tipo:
 *                 type: string
 *               superficie:
 *                 type: string
 *               capacidad:
 *                 type: integer
 *               precio:
 *                 type: number
 *               predio_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Cancha creada exitosamente
 */
router.post('/', [
  body('nombre').notEmpty().withMessage('Nombre requerido'),
  body('tipo').notEmpty().withMessage('Tipo requerido'),
  body('superficie').notEmpty().withMessage('Superficie requerida'),
  body('capacidad').isInt({ min: 2 }).withMessage('Capacidad mínima 2 jugadores'),
  body('precio').isFloat({ min: 0 }).withMessage('Precio debe ser mayor a 0'),
  body('predio_id').isInt().withMessage('ID de predio requerido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      nombre, tipo, superficie, capacidad, precio, predio_id,
      dimensiones, descripcion, techada, iluminacion, vestuarios,
      estacionamiento, parrilla, wifi
    } = req.body;

    const [result] = await db.execute(`
      INSERT INTO canchas (
        predio_id, nombre, tipo, superficie, capacidad, precio,
        dimensiones, descripcion, techada, iluminacion, vestuarios,
        estacionamiento, parrilla, wifi, activa, fecha_creacion
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW())
    `, [
      predio_id, nombre, tipo, superficie, capacidad, precio,
      dimensiones || null, descripcion || null, 
      techada || 0, iluminacion || 0, vestuarios || 0,
      estacionamiento || 0, parrilla || 0, wifi || 0
    ]);

    res.status(201).json({
      message: 'Cancha creada exitosamente',
      canchaId: result.insertId
    });

  } catch (error) {
    console.error('Error creando cancha:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/canchas/{id}:
 *   get:
 *     summary: Obtener cancha por ID
 *     tags: [Canchas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cancha encontrada
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [canchas] = await db.execute(`
      SELECT c.*, p.nombre as predio_nombre, p.direccion as predio_direccion
      FROM canchas c
      LEFT JOIN predios p ON c.predio_id = p.id
      WHERE c.id = ?
    `, [id]);

    if (canchas.length === 0) {
      return res.status(404).json({ error: 'Cancha no encontrada' });
    }

    res.json(canchas[0]);

  } catch (error) {
    console.error('Error obteniendo cancha:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/canchas/{id}:
 *   put:
 *     summary: Actualizar cancha
 *     tags: [Canchas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cancha actualizada exitosamente
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      nombre, tipo, superficie, capacidad, precio,
      dimensiones, descripcion, techada, iluminacion, vestuarios,
      estacionamiento, parrilla, wifi, activa
    } = req.body;

    const [result] = await db.execute(`
      UPDATE canchas SET
        nombre = ?, tipo = ?, superficie = ?, capacidad = ?, precio = ?,
        dimensiones = ?, descripcion = ?, techada = ?, iluminacion = ?, 
        vestuarios = ?, estacionamiento = ?, parrilla = ?, wifi = ?, activa = ?
      WHERE id = ?
    `, [
      nombre, tipo, superficie, capacidad, precio,
      dimensiones, descripcion, techada, iluminacion, vestuarios,
      estacionamiento, parrilla, wifi, activa, id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cancha no encontrada' });
    }

    res.json({ message: 'Cancha actualizada exitosamente' });

  } catch (error) {
    console.error('Error actualizando cancha:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;