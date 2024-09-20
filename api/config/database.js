const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('orenda_test', 'root', 'aisyah09', {
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql',
  });

sequelize.sync({ force: false })
    .then(() => {
        console.log('Database synchronized');
    })
    .catch((error) => {
        console.error('Failed to synchronize database:', error);
    });

module.exports = sequelize;