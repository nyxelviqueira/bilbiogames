const selectAllVideogamesQuery = require('../../db/videogameQueries/insertVideogameQuery');

const selectAllVideogames = async (req, res, next) => {
    try {
        const { keyword } = req.query;

        const videogames = await selectAllVideogamesQuery(req.user?.id, keyword);

console.log(videogames);

        res.send({
            status: 'ok',
            data: {
                videogames,
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = selectAllVideogames;