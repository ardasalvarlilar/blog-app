const { DataTypes } = require('sequelize')
const sequelize = require('../data/db')
const bcrypt = require('bcrypt')

const User = sequelize.define('user',{
  fullname: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'ad soyad girmelisiniz '
      },
      isFullname(value){
        if(value.split(' ').length < 2){
          throw new Error('please enter name and surname')
        }
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
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'can not leave password blank'
      },
      len: {
        args: [8,20],
        msg: "password should be between 8 and 20 characters."
      }
    }
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

User.afterValidate(async (user) => {
  user.password = await bcrypt.hash(user.password,10)
})

module.exports = User