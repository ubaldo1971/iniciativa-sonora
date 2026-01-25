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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
