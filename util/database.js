const Sequelize = require('sequelize');

const sequelize = new Sequelize('nodetutdb', 'root', 'password', {
    dialect: 'mysql',
    host: 'localhost',
});

module.exports = sequelize;
