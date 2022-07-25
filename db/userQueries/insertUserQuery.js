const getConnection = require('../getConnection');
const bcrypt = require('bcrypt');

const { generateError } = require('../../helpers');

const insertUserQuery = async (username, email, password) => {
    let connection;

    try {
        connection = await getConnection();

        // Obtenemos un array de usuarios en base al username establecido.
        const [usernameUsers] = await connection.query(
            `SELECT id FROM users WHERE username = ?`,
            [username]
        );

        // Si existe algún usuario con ese nombre de usuario lanzamos un error.
        if (usernameUsers.length > 0) {
            throw generateError(
                'Ya existe un usuario con ese nombre en la base de datos',
                403
            );
        }

        // Obtenemos un array de usuarios en base al email o al nombre de usuario establecido.
        const [emailUsers] = await connection.query(
            `SELECT id FROM users WHERE email = ?`,
            [email]
        );

        // Si existe algún usuario con ese email lanzamos un error.
        if (emailUsers.length > 0) {
            throw generateError(
                'Ya existe un usuario con ese email en la base de datos',
                403
            );
        }

        // Encriptamos la contraseña.
        const hashedPassword = await bcrypt.hash(password, 10);

        // Creamos el usuario.
        await connection.query(
            `INSERT INTO users (username, email, password, createdAt, modifiedAt) VALUES (?, ?, ?, ?, ?)`,
            [username, email, hashedPassword, new Date(), new Date()]
        );
    } finally {
        if (connection) connection.release();
    }
};

module.exports = insertUserQuery;
