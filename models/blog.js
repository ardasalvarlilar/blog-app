const { DataTypes } = require('sequelize')
const sequelize = require('../data/db')

const Blog = sequelize.define('blog',{
  blogid: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title:{
    type: DataTypes.STRING,
    allowNull: false
  },
  subtitle: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  is_home: {
    type: DataTypes.BOOLEAN,
    allowNull:false,
  },
  confirm: {
    type: DataTypes.BOOLEAN,
    allowNull:false,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull:false,
  }
})

async function syncTable(){
  await Blog.sync({force: true})
  console.log('blog tablosu eklendi')
}
syncTable()

module.exports = Blog