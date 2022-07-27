const getConnection = require('../getConnection');

const insertVideogameQuery = async (
    idUser,
    title,
    description,
    image,
    platform,
    company,
    releaseDate
) => {
    let connection;

    try {
        connection = await getConnection();

        /**Obtenemos el id con el que ha sido guardado el juego accediendo
         * a la posición 0 del array que devuelve connection.query
         */
        const [newVideogame] = await connection.query(
            `
    INSERT INTO videogames (idUser, title, description, image, 
        platform, company, releaseDate)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,[idUser, title, description, image, platform, company, releaseDate]
        );

        console.log(`Prueba ${newVideogame}`);

        //Retornamos info del videojuego
        return {
            id: newVideogame.insertId,
            idUser,
            title,
            description,
            image,
            platform,
            company,
            releaseDate,
        };
    } finally {
        if (connection) connection.release();
    }
};

module.exports = insertVideogameQuery;
