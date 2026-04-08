// ============================================================
// login.js - Lógica del cliente para el formulario de inicio de sesión
// Envía las credenciales a la API y muestra el resultado al usuario
// ============================================================

// Seleccionar el formulario y el elemento de mensaje
const loginForm = document.getElementById('loginForm');
const mensajeDiv = document.getElementById('mensaje');

/**
 * Muestra un mensaje en la pantalla con el estilo correspondiente.
 * @param {string} texto - Texto a mostrar
 * @param {boolean} exito - true para estilo de éxito, false para error
 */
const mostrarMensaje = (texto, exito) => {
    mensajeDiv.textContent = texto;
    mensajeDiv.className = `mensaje ${exito ? 'exito' : 'error'}`;
};

// Escuchar el evento de envío del formulario
loginForm.addEventListener('submit', async (e) => {
    // Prevenir el comportamiento por defecto del formulario (recarga de página)
    e.preventDefault();

    // Obtener los valores ingresados por el usuario
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
        // Enviar solicitud POST a la API de login
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        // Parsear la respuesta JSON del servidor
        const data = await response.json();

        if (data.exito) {
            // Autenticación satisfactoria: guardar token y redirigir al admin
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', username);
            mostrarMensaje(data.mensaje, true);

            // Redirigir al panel de administración después de 1 segundo
            setTimeout(() => { window.location.href = '/admin'; }, 1000);
        } else {
            // Error en la autenticación: mostrar mensaje de error
            mostrarMensaje(data.mensaje, false);
        }

    } catch (error) {
        // Error de conexión con el servidor
        mostrarMensaje('Error al conectar con el servidor', false);
    }
});
