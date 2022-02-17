const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Telegram = sequelize.define('telegram', {
  chat_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Telegram;
