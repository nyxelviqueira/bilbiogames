const selectUserByIdQuery = require('../../db/userQueries/selectUserByIdQuery');
const updateUserQuery = require('../../db/userQueries/updateUserQuery');

const { generateError, savePhoto, deletePhoto } = require('../../helpers');

const editUser = async (req, res, next) => {
    try {
        // Obtenemos los campos del body.
        let { username, email } = req.body;

        // Si faltan todos los campos lanzamos un error.
        if (!username && !email && !req.files?.avatar) {
            throw generateError('Faltan campos', 400);
        }

        // Obtenemos la info del usuario.
        const user = await selectUserByIdQuery(req.user.id);

        // Variable donde almacenaremos el nombre de la imagen.
        let avatar;

        // Si existe avatar lo guardamos en una carpeta del servidor y posteriormente
        // guardamos el nombre del archivo en la base de datos.
        if (req.files?.avatar) {
            // Si el usuario tiene un avatar asignado lo borramos del disco duro.
            if (user.avatar) {
                await deletePhoto(user.avatar);
            }

            // Guardamos el avatar en el disco duro y obtenemos el nombre.
            avatar = await savePhoto(req.files.avatar);
        }

        // Establecemos el valor final para las variables. En caso de que
        // el usuario no envíe el nombre de usuario, el email o el avatar
        // nos quedamos con el valor que haya en la base de datos.
        username = username || user.username;
        email = email || user.email;
        avatar = avatar || user.avatar;

        // Actualizamos los datos del usuario.
        await updateUserQuery(username, email, avatar, req.user.id);

        res.send({
            status: 'ok',
            message: 'Usuario actualizado',
        });
    } catch (err) {
        next(err);
    }
};

module.exports = editUser;
