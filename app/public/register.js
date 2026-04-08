// ============================================================
// register.js - Lógica del cliente para el formulario de registro
// Envía los datos del nuevo usuario a la API y muestra el resultado
// ============================================================

// Seleccionar el formulario y el elemento de mensaje
const registerForm = document.getElementById('registerForm');
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
registerForm.addEventListener('submit', async (e) => {
    // Prevenir el comportamiento por defecto del formulario (recarga de página)
    e.preventDefault();

    // Obtener los valores ingresados por el usuario
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
        // Enviar solicitud POST a la API de registro
        const response = await fetch('/api/registro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        // Parsear la respuesta JSON del servidor
        const data = await response.json();

        if (data.exito) {
            // Registro exitoso: mostrar mensaje y redirigir al login
            mostrarMensaje(data.mensaje, true);

            // Redirigir al inicio de sesión después de 1.5 segundos
            setTimeout(() => { window.location.href = '/login'; }, 1500);
        } else {
            // Error en el registro: mostrar mensaje de error
            mostrarMensaje(data.mensaje, false);
        }

    } catch (error) {
        // Error de conexión con el servidor
        mostrarMensaje('Error al conectar con el servidor', false);
    }
});
