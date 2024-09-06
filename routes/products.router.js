const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const config = require('../config'); // Configuración del entorno


const router = express.Router();

router.use(bodyParser.json());

// Conectar a la base de datos SQLite
const db = new sqlite3.Database(config.database);

// Crear tabla de productos si no existe
db.serialize(() => {
    db.run(`CREATE TABLE products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        precio REAL,
        cantidad INTEGER
    )`);
});

// GET /productos - Devuelve lista de productos
router.get('/', (req, res) => {
    db.all('SELECT * FROM products', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ products: rows });
    });
});

// POST /productos - Agrega un producto
router.post('/', (req, res) => {
    const { nombre, precio, cantidad } = req.body;
    if (!nombre || !precio || !cantidad) {
        return res.status(400).json({ error: "Faltan datos: nombre, precio, cantidad" });
    }
    const query = 'INSERT INTO products (nombre, precio, cantidad) VALUES (?, ?, ?)';
    const params = [nombre, precio, cantidad];
    
    db.run(query, params, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, nombre, precio, cantidad });
    });
});

// GET /productos/:id - Devuelve un producto por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM products WHERE id = ?';
    
    db.get(query, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(row);
    });
});

// PUT /productos/:id - Actualiza un producto por ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, precio, cantidad } = req.body;

    if (!nombre || !precio || !cantidad) {
        return res.status(400).json({ error: "Faltan datos: nombre, precio, cantidad" });
    }

    const query = 'UPDATE products SET nombre = ?, precio = ?, cantidad = ? WHERE id = ?';
    const params = [nombre, precio, cantidad, id];
    
    db.run(query, params, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto actualizado correctamente' });
    });
});

// DELETE /productos/:id - Elimina un producto por ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM products WHERE id = ?';

    db.run(query, [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto eliminado correctamente' });
    });
});

module.exports = router;