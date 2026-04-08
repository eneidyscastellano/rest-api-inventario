# Guion de Video — REST API Inventario

---

## INTRODUCCIÓN
*[Pantalla: Vista general del proyecto en el editor de código]*

Hola, en este video voy a explicar el funcionamiento de la REST API que desarrollé
para el sistema de inventario. Esta API está construida con Node.js y Express,
e implementa un sistema de autenticación de usuarios usando JSON Web Tokens,
más conocidos como JWT, y encriptación de contraseñas con bcrypt.

La API cuenta con dos endpoints principales: registro de usuario e inicio de sesión.
También tiene tres rutas que sirven páginas web. Vamos a ver cada una de ellas.

---

## PARTE 1 — ESTRUCTURA DEL PROYECTO
*[Pantalla: Explorador de archivos del proyecto]*

Antes de entrar a los endpoints, quiero mostrar rápidamente cómo está organizado
el proyecto.

Tenemos la carpeta `app`, que contiene toda la lógica del servidor.
Dentro de ella está el archivo `index.js`, que es el punto de entrada y donde
se configuran todas las rutas.

La carpeta `controllers` tiene el archivo `authentication.controller.js`,
donde está la lógica de registro y login.

En `pages` están los archivos HTML que se sirven al navegador, y en `public`
están los archivos JavaScript y CSS del lado del cliente.

Finalmente, la carpeta `data` almacena el archivo `usuarios.json`, que actúa
como base de datos simple para guardar los usuarios registrados.

---

## PARTE 2 — ENDPOINT: POST /api/registro
*[Pantalla: Postman abierto, request de registro seleccionado]*

El primer endpoint es el de registro. Se accede con una petición POST
a la ruta `/api/registro`.

*[Mostrar el body en Postman]*

En el cuerpo de la petición enviamos un JSON con dos campos: `username` y `password`.
Ambos son obligatorios.

*[Enviar la petición]*

Cuando el servidor recibe esta solicitud, primero valida que los dos campos estén
presentes. Luego revisa si ya existe un usuario con ese nombre. Si no existe,
encripta la contraseña usando bcrypt con diez rondas de encriptación, lo que la
hace prácticamente imposible de revertir.

Después guarda el nuevo usuario en el archivo JSON y responde con un código
201, que significa "creado", junto con el mensaje "Registro exitoso".

*[Mostrar respuesta 201]*

Ahora vamos a ver qué pasa si intentamos registrar el mismo usuario dos veces.

*[Enviar la petición nuevamente]*

El servidor responde con un código 409, que indica conflicto, y el mensaje
"El usuario ya se encuentra registrado". Así se evitan duplicados.

*[Mostrar respuesta 409]*

Y si enviamos el body sin alguno de los campos requeridos, recibimos un error
400 con el mensaje "El usuario y la contraseña son obligatorios".

---

## PARTE 3 — ENDPOINT: POST /api/login
*[Pantalla: Postman, request de login seleccionado]*

El segundo endpoint es el de inicio de sesión. Se accede con una petición POST
a la ruta `/api/login`.

*[Mostrar el body en Postman]*

Igual que en el registro, enviamos `username` y `password` en el cuerpo.

*[Enviar la petición con credenciales correctas]*

El servidor busca al usuario en el archivo JSON. Si lo encuentra, compara
la contraseña ingresada con el hash guardado usando bcrypt.

Si todo es correcto, genera un token JWT firmado con una clave secreta que está
guardada en las variables de entorno. Este token contiene el ID y el nombre
del usuario, y tiene una expiración de una hora.

La respuesta es un código 200 con el mensaje "Autenticación satisfactoria"
y el token.

*[Mostrar respuesta 200 con el token]*

Este token es el que el cliente guarda en el localStorage del navegador
y lo usaría para acceder a rutas protegidas.

Ahora probemos con una contraseña incorrecta.

*[Cambiar la contraseña y enviar]*

El servidor responde con un código 401, "Unauthorized", y el mensaje
"Error en la autenticación". Nótese que el mensaje es genérico a propósito,
para no revelar si el error fue en el usuario o en la contraseña.

*[Mostrar respuesta 401]*

---

## PARTE 4 — RUTAS DE PÁGINAS WEB
*[Pantalla: Postman, sección Páginas Web]*

Además de los endpoints de la API, el servidor también sirve tres páginas HTML.

**GET /login**

Esta ruta devuelve la página de inicio de sesión. Tiene un formulario donde
el usuario ingresa sus credenciales, y al enviarlas, el JavaScript del cliente
llama al endpoint `POST /api/login` que acabamos de ver.

*[Mostrar en el navegador http://localhost:3000/login]*

**GET /register**

Esta ruta devuelve la página de registro. Funciona igual: el formulario
llama al endpoint `POST /api/registro`.

*[Mostrar en el navegador http://localhost:3000/register]*

**GET /admin**

Esta es la página del panel de administración. Solo es accesible si el usuario
tiene un token guardado en el localStorage. Si no hay token, el script del cliente
redirige automáticamente al login.

*[Mostrar en el navegador http://localhost:3000/admin]*

Al ingresar, se muestra un mensaje de bienvenida con el nombre del usuario
y un botón para cerrar sesión, que elimina el token del localStorage
y redirige de vuelta al login.

**GET /**

Por último, la ruta raíz simplemente redirige al login automáticamente.

---

## CIERRE
*[Pantalla: Código del proyecto o repositorio en GitHub]*

Eso es todo. En resumen, esta API implementa un flujo completo de autenticación:
registro con contraseñas encriptadas e inicio de sesión con tokens JWT.

El código fuente está disponible en el repositorio de GitHub junto con la
colección de Postman que usé durante esta demostración, para que puedan
importarla y probar los endpoints directamente.

Gracias por ver el video.

---
