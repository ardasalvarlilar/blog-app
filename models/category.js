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
},{
  timestamps: false
})

async function syncTable(){
  await Category.sync({alter: true})

  // await Category.create({ name: 'Web geliştirme'}) // tekli create
  const count = await Category.count()
  if(count == 0){
    await Category.bulkCreate([ 
      { name: 'Web geliştirme'},
      { name: 'mobil geliştirme'},
      { name: 'React geliştirme'},
    ]) // çoklu ekleme
  }
}
syncTable()

module.exports = Category