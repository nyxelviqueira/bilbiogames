const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const selectUserByEmailQuery = require('../../db/userQueries/selectUserByEmailQuery');

const { generateError } = require('../../helpers');

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw generateError('Faltan campos', 400);
        }

        // Obtenemos al usuario con el email que viene en el body.
        const user = await selectUserByEmailQuery(email);

        // Comprobamos si las contraseñas coinciden.
        const validPassword = await bcrypt.compare(password, user.password);

        // Si las contraseñas no coinciden lanzamos un error.
        if (!validPassword) {
            throw generateError('Contraseña incorrecta', 401);
        }

        // Generamos un objeto con la información que queremos agregar al token.
        const payload = {
            id: user.id,
            role: user.role,
        };

        // Generamos el token.
        const token = jwt.sign(payload, process.env.SECRET, {
            expiresIn: '10d',
        });

        res.send({
            status: 'ok',
            data: {
                token,
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = loginUser;
