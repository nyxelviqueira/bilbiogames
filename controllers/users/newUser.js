const insertUserQuery = require('../../db/userQueries/insertUserQuery');

const { generateError } = require('../../helpers');

const newUser = async (req, res, next) => {
    try {
        // Obtenemos los campos del body.
        const { username, email, password } = req.body;

        // Si falta algún campo lanzamos un error.
        if (!username || !email || !password) {
            throw generateError('Faltan campos', 400);
        }

        // Insertamos un nuevo usuario en la base de datos.
        await insertUserQuery(username, email, password);

        res.send({
            status: 'ok',
            message: 'Usuario creado',
        });
    } catch (err) {
        next(err);
    }
};

module.exports = newUser;
