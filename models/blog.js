const { DataTypes } = require('sequelize')
const sequelize = require('../data/db')

const Blog = sequelize.define('blog',{
  title:{
    type: DataTypes.STRING,
    allowNull: false
  },
  url:{
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
  }
},{
  timestamps: true,
  validate: {
    checkValidOnay(){
      if(this.anasayfa && !this.onay){
        throw new Error('did not confirmed the blog which added to home page')
      }  
    }
  }
}
)



module.exports = Blog