// ============================================================
// index.js - Configuración principal del servidor Express
// Carga variables de entorno, define rutas y levanta el servidor
// ============================================================

const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

// Importar el controlador de autenticación
const authController = require('./controllers/authentication.controller');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares globales ──────────────────────────────────────
app.use(express.json());           // Parsear cuerpo JSON
app.use(express.urlencoded({ extended: true })); // Parsear form-data
app.use(cookieParser());           // Parsear cookies

// Servir archivos estáticos (CSS, JS del cliente)
app.use('/public', express.static(path.join(__dirname, 'public')));

// ── Rutas de páginas HTML ─────────────────────────────────────
// Página de inicio de sesión
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'login.html'));
});

// Página de registro
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'register.html'));
});

// Página de administración (protegida)
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'admin', 'index.html'));
});

// ── Rutas de la API de autenticación ─────────────────────────
// Registrar un nuevo usuario
app.post('/api/registro', authController.registro);

// Iniciar sesión con usuario y contraseña
app.post('/api/login', authController.login);

// ── Redirigir raíz al login ───────────────────────────────────
app.get('/', (req, res) => {
    res.redirect('/login');
});

// ── Levantar el servidor ──────────────────────────────────────
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
