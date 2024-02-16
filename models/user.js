const { DataTypes } = require('sequelize')
const sequelize = require('../data/db')

const User = sequelize.define('user',{
  fullname: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'ad soyad girmelisiniz '
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      args: true,
      msg: 'This email is using by another user'
    },
    validate: {
      notEmpty: {
        msg: 'email boş bırakılamaz'
      },
      isEmail: {
        msg: 'email formatına uygun bir adres giriniz'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  resetToken:{
    type: DataTypes.STRING,
    allowNull: true
  },
  resetTokenExpiration:{
    type: DataTypes.DATE,
    allowNull: true
  }
},{timestamps: true})

module.exports = User