require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');

const { PORT } = process.env;

const app = express();

// Middleware que hace uso del logger "morgan".
app.use(morgan('dev'));

// Middleware que deserializa un body con formato "raw" y lo pone disponible en "req.body".
app.use(express.json());

// Middleware que deserializa un body con formato "form-data".
app.use(fileUpload());

/**
 * #################
 * ## Middlewares ##
 * #################
 */

const authUser = require('./middlewares/authUser');
const authUserOptional = require('./middlewares/authUserOptional');

/**
 * ########################
 * ## Endpoints Usuarios ##
 * ########################
 */

const {
    newUser,
    loginUser,
    getOwnUser,
    editUser,
} = require('./controllers/users');

// Registro de un nuevo usuario.
app.post('/users', newUser);

// Login de usuario.
app.post('/users/login', loginUser);

// Info de un usuario logueado.
app.get('/users', authUser, getOwnUser);

// Editar un usuario.
app.put('/users', authUser, editUser);

/**
 * ##########################
 * ## Endpoints Videogames ##
 * ##########################
 */

const { newVideogame } = require('./controllers/videogames');

// Registro de un nuevo videojuego.
app.post('/videogames', authUser, newVideogame);

/**
 * ######################
 * ## Middleware Error ##
 * ######################
 */

app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.statusCode || 500).send({
        status: 'error',
        message: err.message,
    });
});

/**
 * ##########################
 * ## Middleware Not Found ##
 * ##########################
 */

app.use((req, res) => {
    res.status(404).send({
        status: 'error',
        message: 'No encontrado',
    });
});

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:4000`);
});
