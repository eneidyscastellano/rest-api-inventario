// ============================================================
// admin.js - Lógica del panel de administración
// Verifica que el usuario esté autenticado y gestiona el cierre de sesión
// ============================================================

// Recuperar token y username almacenados al momento del login
const token = localStorage.getItem('token');
const username = localStorage.getItem('username');

// Si no hay token, redirigir al login (usuario no autenticado)
if (!token) {
    window.location.href = '/login';
}

// Mostrar mensaje de bienvenida con el nombre del usuario
const bienvenidaEl = document.getElementById('bienvenida');
bienvenidaEl.textContent = `Bienvenido, ${username}`;

// Manejar el evento de cierre de sesión
document.getElementById('btnLogout').addEventListener('click', () => {
    // Eliminar el token y el username del almacenamiento local
    localStorage.removeItem('token');
    localStorage.removeItem('username');

    // Redirigir al login
    window.location.href = '/login';
});
