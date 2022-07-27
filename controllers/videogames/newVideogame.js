const insertVideogameQuery = require('../../db/videogameQueries/insertVideogameQuery');

const { generateError, savePhoto } = require('../../helpers');

const newVideogame = async (req, res, next) => {
    try {
        //Almacenamos la imagen
        let image;

        //La guardamos en la carpeta del servidor y base de datos

        if (req.files?.image) {
            // Guardamos la imagen en el disco duro y obtenemos el nombre.
            image = await savePhoto(req.files.image);
        }
        const { title, description, platform, company, releaseDate } = req.body;

        if (!title || !description || !platform || !company || !releaseDate || image) {
            throw generateError('Faltan campos', 400);
        }

        const videogame = await insertVideogameQuery(
            req.user.id,
            title,
            description,
            image,
            platform,
            company,
            releaseDate
        );

        res.send({
            status: 'ok',
            data: {
                videogame,
            },
        });
    } catch (err) {
        next(err);
    }
};
module.exports = newVideogame;
