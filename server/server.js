import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Initialize Database
let db;
const dbPath = join(__dirname, 'database.sqlite');

(async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        console.log('Connected to SQLite database at', dbPath);

        await db.exec(`
            CREATE TABLE IF NOT EXISTS registros (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT,
                email TEXT,
                pais_codigo TEXT,
                celular TEXT,
                edad INTEGER,
                sexo TEXT,
                comentarios TEXT,
                fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Table "registros" ready.');

        await db.exec(`
            CREATE TABLE IF NOT EXISTS aliados (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                empresa TEXT,
                contacto TEXT,
                email TEXT,
                telefono TEXT,
                mensaje TEXT,
                fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Table "aliados" ready.');

        await db.exec(`
            CREATE TABLE IF NOT EXISTS metas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                titulo TEXT NOT NULL,
                categoria TEXT DEFAULT 'economica',
                meta_objetivo REAL DEFAULT 0,
                meta_actual REAL DEFAULT 0,
                unidad TEXT DEFAULT '$',
                descripcion TEXT,
                fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Table "metas" ready.');

    } catch (error) {
        console.error('Error connecting to database:', error);
    }
})();

// Route for partners registration
app.post('/api/aliados', async (req, res) => {
    const { empresa, contacto, email, telefono, mensaje } = req.body;
    if (!empresa || !email) {
        return res.status(400).json({ error: 'Faltan campos requeridos (empresa, email)' });
    }
    try {
        const result = await db.run(
            `INSERT INTO aliados (empresa, contacto, email, telefono, mensaje) VALUES (?, ?, ?, ?, ?)`,
            [empresa, contacto, email, telefono, mensaje]
        );
        console.log(`New partner registered: ${empresa}`);
        res.json({ message: 'Aliado registrado exitosamente', id: result.lastID });
    } catch (error) {
        console.error('Error saving partner:', error);
        res.status(500).json({ error: 'Error al guardar el aliado' });
    }
});

// Route to view aliados list
app.get('/api/aliados', async (req, res) => {
    try {
        const aliados = await db.all('SELECT * FROM aliados ORDER BY fecha_registro DESC');
        res.json(aliados);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener aliados' });
    }
});

// Route to handle new registrations
app.post('/api/registro', async (req, res) => {
    const { nombre, email, pais_codigo, celular, edad, sexo, comentarios } = req.body;

    // Basic validation
    if (!nombre || !email || !celular) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    try {
        const result = await db.run(
            `INSERT INTO registros (nombre, email, pais_codigo, celular, edad, sexo, comentarios) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [nombre, email, pais_codigo, celular, edad, sexo, comentarios]
        );
        console.log(`New registration added: ${nombre}`);
        res.json({ message: 'Registro exitoso', id: result.lastID });
    } catch (error) {
        console.error('Error saving registration:', error);
        res.status(500).json({ error: 'Error al guardar el registro' });
    }
});

// Route to view registrations (useful for checking if it works)
app.get('/api/registros', async (req, res) => {
    try {
        const registros = await db.all('SELECT * FROM registros ORDER BY fecha_registro DESC');
        res.json(registros);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener registros' });
    }
});
// ── UPDATE a registro ─────────────────────────────────────────────
app.put('/api/registros/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, email, pais_codigo, celular, edad, sexo, comentarios } = req.body;
    try {
        await db.run(
            `UPDATE registros SET nombre=?, email=?, pais_codigo=?, celular=?, edad=?, sexo=?, comentarios=? WHERE id=?`,
            [nombre, email, pais_codigo, celular, edad, sexo, comentarios, id]
        );
        res.json({ message: 'Registro actualizado' });
    } catch (error) {
        console.error('Error updating registro:', error);
        res.status(500).json({ error: 'Error al actualizar' });
    }
});

// ── DELETE a registro ─────────────────────────────────────────────
app.delete('/api/registros/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.run('DELETE FROM registros WHERE id=?', [id]);
        res.json({ message: 'Registro eliminado' });
    } catch (error) {
        console.error('Error deleting registro:', error);
        res.status(500).json({ error: 'Error al eliminar' });
    }
});

// ── UPDATE an aliado ──────────────────────────────────────────────
app.put('/api/aliados/:id', async (req, res) => {
    const { id } = req.params;
    const { empresa, contacto, email, telefono, mensaje } = req.body;
    try {
        await db.run(
            `UPDATE aliados SET empresa=?, contacto=?, email=?, telefono=?, mensaje=? WHERE id=?`,
            [empresa, contacto, email, telefono, mensaje, id]
        );
        res.json({ message: 'Aliado actualizado' });
    } catch (error) {
        console.error('Error updating aliado:', error);
        res.status(500).json({ error: 'Error al actualizar' });
    }
});

// ── DELETE an aliado ──────────────────────────────────────────────
app.delete('/api/aliados/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.run('DELETE FROM aliados WHERE id=?', [id]);
        res.json({ message: 'Aliado eliminado' });
    } catch (error) {
        console.error('Error deleting aliado:', error);
        res.status(500).json({ error: 'Error al eliminar' });
    }
});

// ═══════════════════════════════════════════════════════════════════
// METAS ENDPOINTS
// ═══════════════════════════════════════════════════════════════════

// GET all metas
app.get('/api/metas', async (req, res) => {
    try {
        const metas = await db.all('SELECT * FROM metas ORDER BY fecha_creacion DESC');
        res.json(metas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener metas' });
    }
});

// POST create meta
app.post('/api/metas', async (req, res) => {
    const { titulo, categoria, meta_objetivo, meta_actual, unidad, descripcion } = req.body;
    if (!titulo) return res.status(400).json({ error: 'Título requerido' });
    try {
        const result = await db.run(
            `INSERT INTO metas (titulo, categoria, meta_objetivo, meta_actual, unidad, descripcion) VALUES (?, ?, ?, ?, ?, ?)`,
            [titulo, categoria || 'economica', meta_objetivo || 0, meta_actual || 0, unidad || '$', descripcion || '']
        );
        res.json({ message: 'Meta creada', id: result.lastID });
    } catch (error) {
        console.error('Error creating meta:', error);
        res.status(500).json({ error: 'Error al crear meta' });
    }
});

// PUT update meta
app.put('/api/metas/:id', async (req, res) => {
    const { id } = req.params;
    const { titulo, categoria, meta_objetivo, meta_actual, unidad, descripcion } = req.body;
    try {
        await db.run(
            `UPDATE metas SET titulo=?, categoria=?, meta_objetivo=?, meta_actual=?, unidad=?, descripcion=? WHERE id=?`,
            [titulo, categoria, meta_objetivo, meta_actual, unidad, descripcion, id]
        );
        res.json({ message: 'Meta actualizada' });
    } catch (error) {
        console.error('Error updating meta:', error);
        res.status(500).json({ error: 'Error al actualizar' });
    }
});

// PATCH update progress only
app.patch('/api/metas/:id/progreso', async (req, res) => {
    const { id } = req.params;
    const { meta_actual } = req.body;
    try {
        await db.run('UPDATE metas SET meta_actual=? WHERE id=?', [meta_actual, id]);
        res.json({ message: 'Progreso actualizado' });
    } catch (error) {
        console.error('Error updating progress:', error);
        res.status(500).json({ error: 'Error al actualizar progreso' });
    }
});

// DELETE meta
app.delete('/api/metas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.run('DELETE FROM metas WHERE id=?', [id]);
        res.json({ message: 'Meta eliminada' });
    } catch (error) {
        console.error('Error deleting meta:', error);
        res.status(500).json({ error: 'Error al eliminar' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
