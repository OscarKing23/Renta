const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ── Pool de conexiones MySQL ──
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
});

// ── Health check ──
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() });
});

// ── Middleware de autenticación ──
function authMiddleware(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token requerido' });
    }
    try {
        const token = header.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
}

// ============================================================
// POST /api/auth/register
// ============================================================
app.post('/api/auth/register', async (req, res) => {
    try {
        const { nombre, email, telefono, password, direccion } = req.body;

        // Validación de campos obligatorios
        if (!nombre || !nombre.trim()) {
            return res.status(400).json({ error: 'El nombre es obligatorio' });
        }
        if (!email || !email.trim()) {
            return res.status(400).json({ error: 'El correo electrónico es obligatorio' });
        }
        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({ error: 'El correo electrónico no tiene un formato válido' });
        }
        if (!telefono || !telefono.trim()) {
            return res.status(400).json({ error: 'El teléfono es obligatorio' });
        }
        // Validar formato de teléfono (7-15 dígitos)
        const phoneDigits = telefono.replace(/[\s\-()+ ]/g, '');
        if (!/^\d{7,15}$/.test(phoneDigits)) {
            return res.status(400).json({ error: 'El teléfono debe tener entre 7 y 15 dígitos' });
        }
        if (!password) {
            return res.status(400).json({ error: 'La contraseña es obligatoria' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
        }

        // Verificar si el email ya existe
        const [existing] = await pool.query(
            'SELECT id_cliente FROM clientes WHERE email = ?',
            [email]
        );
        if (existing.length > 0) {
            return res.status(409).json({ error: 'Ya existe una cuenta con este correo electrónico' });
        }

        // Hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Insertar cliente
        const [result] = await pool.query(
            `INSERT INTO clientes (nombre, email, telefono, direccion, rfc)
             VALUES (?, ?, ?, ?, NULL)`,
            [nombre, email, telefono, direccion || null]
        );

        // Guardar contraseña en campo separado (usaremos la tabla existente + campo extra)
        // Primero aseguramos que exista la columna password_hash
        await pool.query(
            'UPDATE clientes SET rfc = ? WHERE id_cliente = ?',
            [passwordHash, result.insertId]
        );
        // Nota: usamos temporalmente el campo rfc para almacenar el hash.
        // En producción, se debe agregar una columna dedicada.

        const token = jwt.sign(
            { id: result.insertId, email, nombre },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            token,
            user: {
                id: result.insertId,
                nombre,
                email,
                telefono,
                direccion: direccion || null,
            },
        });
    } catch (err) {
        console.error('Error en registro:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// ============================================================
// POST /api/auth/login
// ============================================================
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !email.trim()) {
            return res.status(400).json({ error: 'El correo electrónico es obligatorio' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({ error: 'El correo electrónico no tiene un formato válido' });
        }
        if (!password) {
            return res.status(400).json({ error: 'La contraseña es obligatoria' });
        }

        const [rows] = await pool.query(
            'SELECT id_cliente, nombre, email, telefono, direccion, rfc AS password_hash FROM clientes WHERE email = ?',
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        const user = rows[0];

        if (!user.password_hash) {
            return res.status(401).json({ error: 'Esta cuenta no tiene contraseña configurada. Usa el registro.' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        const token = jwt.sign(
            { id: user.id_cliente, email: user.email, nombre: user.nombre },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user.id_cliente,
                nombre: user.nombre,
                email: user.email,
                telefono: user.telefono,
                direccion: user.direccion,
            },
        });
    } catch (err) {
        console.error('Error en login:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// ============================================================
// GET /api/auth/me  — Obtener perfil del usuario autenticado
// ============================================================
app.get('/api/auth/me', authMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id_cliente, nombre, email, telefono, direccion FROM clientes WHERE id_cliente = ?',
            [req.user.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ user: rows[0] });
    } catch (err) {
        console.error('Error en /me:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// ============================================================
// PUT /api/auth/profile — Actualizar perfil
// ============================================================
app.put('/api/auth/profile', authMiddleware, async (req, res) => {
    try {
        const { nombre, telefono, direccion } = req.body;
        await pool.query(
            'UPDATE clientes SET nombre = ?, telefono = ?, direccion = ? WHERE id_cliente = ?',
            [nombre, telefono, direccion || null, req.user.id]
        );
        const [rows] = await pool.query(
            'SELECT id_cliente, nombre, email, telefono, direccion FROM clientes WHERE id_cliente = ?',
            [req.user.id]
        );
        res.json({ user: rows[0] });
    } catch (err) {
        console.error('Error actualizando perfil:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// ============================================================
// GET /api/orders — Pedidos del usuario autenticado
// ============================================================
app.get('/api/orders', authMiddleware, async (req, res) => {
    try {
        const [pedidos] = await pool.query(
            `SELECT id_pedido, fecha_pedido, fecha_renta, fecha_devolucion,
                    estado, direccion_entrega, notas AS hora_entrega, costo_total
             FROM pedidos
             WHERE id_cliente = ?
             ORDER BY fecha_pedido DESC`,
            [req.user.id]
        );

        // Para cada pedido, traer sus items
        const orders = [];
        for (const p of pedidos) {
            const [items] = await pool.query(
                `SELECT pr.nombre, dp.cantidad, dp.precio_unitario, dp.subtotal
                 FROM detalle_pedido dp
                 JOIN productos pr ON dp.id_producto = pr.id_producto
                 WHERE dp.id_pedido = ?`,
                [p.id_pedido]
            );
            orders.push({ ...p, items });
        }

        res.json({ orders });
    } catch (err) {
        console.error('Error obteniendo pedidos:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// ============================================================
// POST /api/orders/checkout — Crear pedido + pago
// ============================================================
app.post('/api/orders/checkout', authMiddleware, async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const { items, metodo_pago, fecha_renta, fecha_devolucion, direccion_entrega, hora_entrega } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'El carrito está vacío' });
        }
        if (!metodo_pago || !fecha_renta || !fecha_devolucion) {
            return res.status(400).json({ error: 'Faltan datos obligatorios (método de pago, fecha de renta y devolución)' });
        }
        // Validar formato de fechas
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(fecha_renta) || isNaN(new Date(fecha_renta).getTime())) {
            return res.status(400).json({ error: 'La fecha de renta no tiene un formato válido' });
        }
        if (!dateRegex.test(fecha_devolucion) || isNaN(new Date(fecha_devolucion).getTime())) {
            return res.status(400).json({ error: 'La fecha de devolución no tiene un formato válido' });
        }
        if (new Date(fecha_devolucion) <= new Date(fecha_renta)) {
            return res.status(400).json({ error: 'La fecha de devolución debe ser posterior a la de renta' });
        }
        // Validar que cada item tenga datos correctos
        for (const item of items) {
            if (!item.id_producto || !item.cantidad || item.cantidad <= 0 || !item.precio_unitario || item.precio_unitario < 0) {
                return res.status(400).json({ error: 'Uno o más productos tienen datos inválidos' });
            }
        }

        await conn.beginTransaction();

        // 1. Crear pedido en estado 'confirmado'
        const costoTotal = items.reduce(
            (acc, i) => acc + i.cantidad * i.precio_unitario,
            0
        );

        const [pedidoResult] = await conn.query(
            `INSERT INTO pedidos (id_cliente, fecha_renta, fecha_devolucion, estado, direccion_entrega, notas, costo_total)
             VALUES (?, ?, ?, 'confirmado', ?, ?, ?)`,
            [req.user.id, fecha_renta, fecha_devolucion, direccion_entrega || null, hora_entrega || null, costoTotal]
        );
        const idPedido = pedidoResult.insertId;

        // 2. Insertar detalle del pedido
        for (const item of items) {
            const subtotal = item.cantidad * item.precio_unitario;
            await conn.query(
                `INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario, subtotal)
                 VALUES (?, ?, ?, ?, ?)`,
                [idPedido, parseInt(item.id_producto, 10), item.cantidad, item.precio_unitario, subtotal]
            );
        }

        // 3. Registrar pago
        // Mapear métodos extendidos al ENUM de la BD
        const metodoPagoDB = metodo_pago.startsWith('efectivo') ? 'efectivo' : metodo_pago;
        await conn.query(
            `INSERT INTO pagos (id_pedido, monto, metodo_pago)
             VALUES (?, ?, ?)`,
            [idPedido, costoTotal, metodoPagoDB]
        );

        // 4. Cambiar estado a 'en_renta' (en camino)
        await conn.query(
            `UPDATE pedidos SET estado = 'en_renta' WHERE id_pedido = ?`,
            [idPedido]
        );

        await conn.commit();
        res.status(201).json({ orderId: idPedido, message: 'Pedido confirmado' });
    } catch (err) {
        await conn.rollback();
        console.error('Error en checkout:', err);
        // Mensaje específico según tipo de error
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ error: 'Este pedido ya fue procesado. Revisa tu historial de compras.' });
        } else if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            res.status(400).json({ error: 'Uno o más productos no existen en el catálogo.' });
        } else {
            res.status(500).json({ error: 'Ocurrió un error al guardar tu pedido. Tu información no se ha perdido, intenta de nuevo.' });
        }
    } finally {
        conn.release();
    }
});

// ── Iniciar servidor ──
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
