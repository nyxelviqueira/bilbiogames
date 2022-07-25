const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');
const { v4: uuid } = require('uuid');

/**
 * ####################
 * ## Generate Error ##
 * ####################
 */

const generateError = (message, code) => {
    const err = new Error(message);
    err.statusCode = code;
    return err;
};

/**
 * ################
 * ## Save Photo ##
 * ################
 */

const savePhoto = async (img) => {
    // Creamos una ruta absoluta al directorio donde vamos a subir las imágenes.
    const uploadsPath = path.join(__dirname, process.env.UPLOADS_DIR);

    try {
        // Intentamos acceder al directorio de subida de archivos mediante el método "access" de fs.
        // Este método genera un error si no es posible acceder al archivo.
        await fs.access(uploadsPath);
    } catch {
        // Si salta el error quiere decir que el directorio no existe así que lo creamos.
        await fs.mkdir(uploadsPath);
    }

    // Procesamos la imagen y la convertimos en un objeto de tipo "Sharp".
    const sharpImg = sharp(img.data);

    // Redimensionamos la imagen para evitar que sean demasiado pesadas. Le asignamos un ancho
    // máximo de 500px.
    sharpImg.resize(500);

    // Generamos un nombre único para la imagen.
    const imgName = `${uuid()}.jpg`;

    // Generamos la ruta absoluta donde queremos guardar la imagen.
    const imgPath = path.join(uploadsPath, imgName);

    // Guardamos la imagen en el directorio correspondiente.
    await sharpImg.toFile(imgPath);

    // Retornamos el nombre que le hemos dado a la imagen.
    return imgName;
};

/**
 * ##################
 * ## Delete Photo ##
 * ##################
 */

const deletePhoto = async (imgName) => {
    try {
        // Creamos la ruta absoluta a la imagen que queremos borrar.
        const imgPath = path.join(__dirname, process.env.UPLOADS_DIR, imgName);

        try {
            // Intentamos acceder al archivo con la imagen mediante el método "access" de fs.
            // Este método genera un error si no es posible acceder al archivo.
            await fs.access(imgPath);
        } catch {
            // Si salta el error quiere decir que la imagen no existe así que hacemos un return
            // y finalizamos la función.
            return false;
        }

        // Eliminamos la imagen del disco.
        await fs.unlink(imgPath);

        return true;
    } catch {
        throw generateError('Error al eliminar la imagen del servidor');
    }
};

module.exports = {
    generateError,
    savePhoto,
    deletePhoto,
};
