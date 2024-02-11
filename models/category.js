const { DataTypes } = require('sequelize')
const sequelize = require('../data/db')

const Category = sequelize.define('category',{
  category_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

module.exports = Category