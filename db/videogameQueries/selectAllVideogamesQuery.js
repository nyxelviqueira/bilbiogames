const getConnection = require('../getConnection');

const { generateError } = require('../../helpers');

const selectAllVideogamesQuery = async (idUser, keyword = '') => {
    let connection;

    
    try {

       
        connection = await getConnection();

        let [videogames] = await connection.query(
            `
            SELECT V.id, 
            V.idUser, 
            V.title,
            V.description, 
            V.image, 
            V.platform,
            V.company,
            V.releaseDate,
            U.username, 
            SUM(IFNULL(L.value = true, 0)) AS likes, 
            V.idUser = ? AS owner, 
            BIT_OR(L.idUser = ? AND L.value = 1) AS likedByMe
        FROM videogames V
        LEFT JOIN likes L ON V.id = L.idVideogame
        LEFT JOIN users U ON V.idUser = U.id
        WHERE V.title LIKE ?
        GROUP BY V.id
        ORDER BY V.releaseDate DESC
            `,
            [idUser, idUser, `%${keyword}%`]
        );

        console.log(`Prueba ${videogames}`);

        if (videogames.length < 1) {
            throw generateError('No se ha encontrado ningún videojuego', 404);
        }

        return videogames;
    } finally {
        if (connection) connection.release();
    }
};

module.exports = selectAllVideogamesQuery;
