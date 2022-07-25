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

        if (!title || !description || !platform || !company || !releaseDate) {
            throw generateError('Faltan campos', 400);
        }

        console.log(`Prueba ${req.user.id}`);
        console.log(`Prueba ${title}`);
        console.log(`Prueba ${description}`);
        console.log(`Prueba ${image}`);
        console.log(`Prueba ${platform}`);
        console.log(`Prueba ${company}`);
        console.log(`Prueba ${releaseDate}`);

        const videogame = await insertVideogameQuery([
            req.user.id,
            title,
            description,
            image,
            platform,
            company,
            releaseDate,
        ]);

        

        console.log(`Prueba final ${videogame}`);

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
