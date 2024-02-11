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
  await Blog.sync({alter: true})
  console.log('blog tablosu eklendi')

  const count = await Blog.count()
  if(count === 0){
    await Blog.create({
      title: 'Web geliştirme',
      subtitle: 'web öğren',
      description: 'html css scss tailwind javascript react nodejs',
      image: '5.jpg',
      is_home: true, 
      confirm: true, 
      category_id: 1
    })
  }

}
syncTable()

module.exports = Blog