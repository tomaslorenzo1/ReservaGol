const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');

const router = express.Router();

/**
 * @swagger
 * /api/turnos:
 *   get:
 *     summary: Listar turnos disponibles
 *     tags: [Turnos]
 *     responses:
 *       200:
 *         description: Lista de turnos
 */
router.get('/', async (req, res) => {
  try {
    const [turnos] = await db.execute(`
      SELECT t.*, c.nombre as cancha_nombre, c.tipo as cancha_tipo, 
             u.nombre as usuario_nombre, p.nombre as predio_nombre
      FROM turnos t
      LEFT JOIN canchas c ON t.cancha_id = c.id
      LEFT JOIN usuarios u ON t.usuario_id = u.id
      LEFT JOIN predios p ON c.predio_id = p.id
      ORDER BY t.fecha, t.hora_inicio
    `);

    res.json(turnos);
  } catch (error) {
    console.error('Error obteniendo turnos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/turnos:
 *   post:
 *     summary: Crear nuevo turno
 *     tags: [Turnos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cancha_id:
 *                 type: integer
 *               usuario_id:
 *                 type: integer
 *               fecha:
 *                 type: string
 *                 format: date
 *               hora_inicio:
 *                 type: string
 *               hora_fin:
 *                 type: string
 *     responses:
 *       201:
 *         description: Turno creado exitosamente
 */
router.post('/', [
  body('cancha_id').isInt().withMessage('ID de cancha requerido'),
  body('usuario_id').isInt().withMessage('ID de usuario requerido'),
  body('fecha').isDate().withMessage('Fecha válida requerida'),
  body('hora_inicio').notEmpty().withMessage('Hora de inicio requerida'),
  body('hora_fin').notEmpty().withMessage('Hora de fin requerida')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { cancha_id, usuario_id, fecha, hora_inicio, hora_fin } = req.body;

    // Verificar disponibilidad
    const [conflictos] = await db.execute(`
      SELECT id FROM turnos 
      WHERE cancha_id = ? AND fecha = ? 
      AND ((hora_inicio <= ? AND hora_fin > ?) OR (hora_inicio < ? AND hora_fin >= ?))
      AND estado != 'cancelado'
    `, [cancha_id, fecha, hora_inicio, hora_inicio, hora_fin, hora_fin]);

    if (conflictos.length > 0) {
      return res.status(400).json({ error: 'Horario no disponible' });
    }

    // Crear turno
    const [result] = await db.execute(`
      INSERT INTO turnos (cancha_id, usuario_id, fecha, hora_inicio, hora_fin, estado, fecha_reserva)
      VALUES (?, ?, ?, ?, ?, 'pendiente', NOW())
    `, [cancha_id, usuario_id, fecha, hora_inicio, hora_fin]);

    res.status(201).json({
      message: 'Turno creado exitosamente',
      turnoId: result.insertId
    });

  } catch (error) {
    console.error('Error creando turno:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/turnos/{id}:
 *   put:
 *     summary: Modificar turno
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Turno modificado exitosamente
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, fecha, hora_inicio, hora_fin } = req.body;

    const [result] = await db.execute(`
      UPDATE turnos 
      SET estado = ?, fecha = ?, hora_inicio = ?, hora_fin = ?
      WHERE id = ?
    `, [estado, fecha, hora_inicio, hora_fin, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Turno no encontrado' });
    }

    res.json({ message: 'Turno modificado exitosamente' });

  } catch (error) {
    console.error('Error modificando turno:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/turnos/{id}:
 *   delete:
 *     summary: Cancelar turno
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Turno cancelado exitosamente
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(
      'UPDATE turnos SET estado = "cancelado" WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Turno no encontrado' });
    }

    res.json({ message: 'Turno cancelado exitosamente' });

  } catch (error) {
    console.error('Error cancelando turno:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/turnos/usuario/{usuario_id}:
 *   get:
 *     summary: Obtener turnos de un usuario específico
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Turnos del usuario
 */
router.get('/usuario/:usuario_id', async (req, res) => {
  try {
    const { usuario_id } = req.params;

    const [turnos] = await db.execute(`
      SELECT t.*, c.nombre as cancha_nombre, c.tipo as cancha_tipo, 
             p.nombre as predio_nombre, p.direccion as predio_direccion
      FROM turnos t
      JOIN canchas c ON t.cancha_id = c.id
      JOIN predios p ON c.predio_id = p.id
      WHERE t.usuario_id = ?
      ORDER BY t.fecha DESC, t.hora_inicio DESC
    `, [usuario_id]);

    res.json(turnos);

  } catch (error) {
    console.error('Error obteniendo turnos del usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;