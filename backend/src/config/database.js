require('dotenv').config()

module.exports = {
    dialect: 'mysql',
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
    dialectOptions: {
        timezone: '-03:00', // Define o timezone no formato aceito pelo MySQL2
    },
    timezone: '-03:00', // Normaliza o timezone para o Sequelize
}