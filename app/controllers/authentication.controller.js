// ============================================================
// authentication.controller.js - Lógica de registro e inicio de sesión
// Gestiona la creación de usuarios y la verificación de credenciales
// ============================================================

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Archivo JSON que actúa como base de datos simple de usuarios
const DB_PATH = path.join(__dirname, '../../data/usuarios.json');

// Número de rondas de encriptación para bcrypt (más alto = más seguro pero más lento)
const SALT_ROUNDS = 10;

/**
 * Lee los usuarios almacenados en el archivo JSON.
 * Si el archivo no existe, retorna un arreglo vacío.
 * @returns {Array} Lista de usuarios registrados
 */
const leerUsuarios = () => {
    // Verificar si el archivo de datos existe
    if (!fs.existsSync(DB_PATH)) {
        return [];
    }
    // Leer y parsear el contenido del archivo
    const contenido = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(contenido);
};

/**
 * Guarda la lista de usuarios en el archivo JSON.
 * Crea el directorio si no existe.
 * @param {Array} usuarios - Lista de usuarios a guardar
 */
const guardarUsuarios = (usuarios) => {
    // Crear el directorio /data si no existe
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    // Escribir los datos en formato JSON indentado
    fs.writeFileSync(DB_PATH, JSON.stringify(usuarios, null, 2), 'utf-8');
};

/**
 * Controlador de registro de usuarios.
 * Recibe username y password, valida que el usuario no exista,
 * encripta la contraseña y guarda el nuevo usuario.
 *
 * @param {Object} req - Solicitud HTTP con body: { username, password }
 * @param {Object} res - Respuesta HTTP
 */
const registro = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validar que se enviaron los campos requeridos
        if (!username || !password) {
            return res.status(400).json({
                exito: false,
                mensaje: 'El usuario y la contraseña son obligatorios'
            });
        }

        // Leer usuarios existentes
        const usuarios = leerUsuarios();

        // Verificar si el usuario ya está registrado
        const usuarioExistente = usuarios.find(u => u.username === username);
        if (usuarioExistente) {
            return res.status(409).json({
                exito: false,
                mensaje: 'El usuario ya se encuentra registrado'
            });
        }

        // Encriptar la contraseña antes de guardarla
        const passwordEncriptada = await bcrypt.hash(password, SALT_ROUNDS);

        // Crear el nuevo usuario con contraseña encriptada
        const nuevoUsuario = {
            id: Date.now(),         // ID único basado en timestamp
            username,
            password: passwordEncriptada
        };

        // Agregar el usuario a la lista y guardar
        usuarios.push(nuevoUsuario);
        guardarUsuarios(usuarios);

        // Respuesta exitosa de registro
        return res.status(201).json({
            exito: true,
            mensaje: 'Registro exitoso'
        });

    } catch (error) {
        // Error inesperado del servidor
        console.error('Error en registro:', error);
        return res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor'
        });
    }
};

/**
 * Controlador de inicio de sesión.
 * Recibe username y password, verifica las credenciales y,
 * si son correctas, retorna un mensaje de autenticación satisfactoria.
 * En caso contrario, retorna un error en la autenticación.
 *
 * @param {Object} req - Solicitud HTTP con body: { username, password }
 * @param {Object} res - Respuesta HTTP
 */
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validar que se enviaron los campos requeridos
        if (!username || !password) {
            return res.status(400).json({
                exito: false,
                mensaje: 'El usuario y la contraseña son obligatorios'
            });
        }

        // Buscar el usuario en la base de datos
        const usuarios = leerUsuarios();
        const usuario = usuarios.find(u => u.username === username);

        // Si el usuario no existe, retornar error de autenticación
        if (!usuario) {
            return res.status(401).json({
                exito: false,
                mensaje: 'Error en la autenticación'
            });
        }

        // Comparar la contraseña ingresada con la contraseña encriptada
        const passwordCorrecta = await bcrypt.compare(password, usuario.password);

        // Si la contraseña no coincide, retornar error de autenticación
        if (!passwordCorrecta) {
            return res.status(401).json({
                exito: false,
                mensaje: 'Error en la autenticación'
            });
        }

        // Generar token JWT con la información del usuario
        const token = jwt.sign(
            { id: usuario.id, username: usuario.username }, // Payload del token
            process.env.JWT_SECRET || 'clave_secreta',      // Clave de firma
            { expiresIn: '1h' }                             // Expiración de 1 hora
        );

        // Autenticación satisfactoria: retornar mensaje y token
        return res.status(200).json({
            exito: true,
            mensaje: 'Autenticación satisfactoria',
            token
        });

    } catch (error) {
        // Error inesperado del servidor
        console.error('Error en login:', error);
        return res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor'
        });
    }
};

// Exportar los controladores para usarlos en las rutas
module.exports = { registro, login };
