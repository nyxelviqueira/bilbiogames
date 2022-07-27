# Bibliojuegos

Vamos a crear una biblioteca de videojuegos con diferentes opciones

## Instalar

-   Crear una base de datos vacía en una instancia de MySQL local.

-   Guardar el archivo `.env.example` como `.env` y cubrir los datos necesarios.

-   Ejecutar `npm run initDB` para crear las tablas necesarias en la base de datos anteriormente creada.

-   Ejecutar `npm run dev` o `npm start` para lanzar el servidor.

## Entidades

-   users:

    -   id
    -   email
    -   password
    -   createdAt

-   videogames:

    -   id
    -   idUser
    -   title
    -   description
    -   image
    -   platform
    -   company
    -   releaseDate

-   wishList:

    -   id
    -   idUser
    -   idVideogame
    -   haveIt
    -   format

-   likes:
    -   id
    -   idUser
    -   idVideogame
    -   createdAt

## Endpoints

### Usuarios:

-   POST [/users] - Registro de usuario. ✅
-   POST [/users/login] - Login de usuario (devuelve token). ✅
-   GET [/users] - Devuelve información del usuario del token. **TOKEN** ✅
-   PUT [/users] - Editar el nombre de usuario, el email o el avatar. ✅ **TOKEN** ✅

### Videogames:

-   POST [/videogames] - Registra un videojuego. **TOKEN** ✅
-   GET [/videogames] - Lista todos los videojuegos.
-   GET [/videogames/:idVideogame] - Devuelve información de un videojuego concreto.
-   POST [/videogames/:idVideogame] - Añade un comentario al videojuego. **TOKEN**
-   POST [/videogames/:idVideogame/like] - Añade o elimina un like a un videojuego. **TOKEN**

### Wishlist:

-   POST [/wishlist/:idVdeogame] - Añade o elimina un videojuego a tu lista de deseos **TOKEN**
-   GET [/wishlist] - Lista tu lista de deseos **TOKEN**
# bilbiogames
