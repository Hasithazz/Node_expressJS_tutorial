const Sequalize = require('sequelize');

const sequalize = new Sequalize('nodetutdb', 'root', 'password', {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequalize;
