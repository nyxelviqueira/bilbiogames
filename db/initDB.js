require('dotenv').config();

const getConnection = require('./getConnection');
const bcrypt = require('bcrypt');

async function main() {
    // Variable que almacenará una conexión libre con la base de datos.
    let connection;

    try {
        connection = await getConnection();

        await connection.query('DROP TABLE IF EXISTS likes');
        await connection.query('DROP TABLE IF EXISTS wishList');
        await connection.query('DROP TABLE IF EXISTS videogames');
        await connection.query('DROP TABLE IF EXISTS users');

        console.log('Creando tablas...');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                username VARCHAR(30) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(100) NOT NULL, 
                avatar VARCHAR(100),
                role ENUM('admin', 'normal') DEFAULT 'normal',
                createdAt TIMESTAMP NOT NULL,
                modifiedAt TIMESTAMP NOT NULL
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS videogames (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                idUser INT UNSIGNED NOT NULL,
                FOREIGN KEY (idUser) REFERENCES users (id),
                title VARCHAR(50) NOT NULL,
                description VARCHAR(500) NOT NULL,
                image VARCHAR(100) NOT NULL,
                platform VARCHAR(150) NOT NULL,
                company VARCHAR(20) NOT NULL,
                releaseDate TIMESTAMP NOT NULL
            )
        `);

        await connection.query(`
        CREATE TABLE IF NOT EXISTS wishList (
            id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
            value BOOLEAN DEFAULT true,
            idUser INT UNSIGNED NOT NULL,
            FOREIGN KEY (idUser) REFERENCES users (id),
            idVideogame INT UNSIGNED NOT NULL,
            FOREIGN KEY (idVideogame) REFERENCES videogames (id)
        )
    `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS likes (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                value BOOLEAN DEFAULT true,
                idUser INT UNSIGNED NOT NULL,
                FOREIGN KEY (idUser) REFERENCES users (id),
                idVideogame INT UNSIGNED NOT NULL,
                FOREIGN KEY (idVideogame) REFERENCES videogames (id),
                createdAt TIMESTAMP NOT NULL,
                modifiedAt TIMESTAMP NOT NULL
            )
        `);

        console.log('¡Tablas creadas!');

        // Encriptamos la contraseña del usuario administrador.
        const hashedPassword = await bcrypt.hash('123456', 10);

        await connection.query(
            `
            INSERT INTO users (username, email, password, role, createdAt)
            VALUES ('admin', 'admin@admin.com', ?, 'admin', ?)
            `,
            [hashedPassword, new Date()]
        );

        console.log('¡Usuario administrador creado!');
    } catch (err) {
        console.error(err);
    } finally {
        if (connection) connection.release();
        process.exit();
    }
}

// Llamamos a la función anterior.
main();
