

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
            V.idUser = 1 AS owner, 
            BIT_OR(L.idUser = 1 AND L.value = 1) AS likedByMe
        FROM videogames V
        LEFT JOIN likes L ON V.id = L.idVideogame
        LEFT JOIN users U ON V.idUser = U.id
        WHERE V.title LIKE "%Hogwarts%"
        GROUP BY V.id
        ORDER BY V.releaseDate DESC;