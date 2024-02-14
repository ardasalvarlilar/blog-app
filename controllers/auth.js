const User = require('../models/user')
const bcrypt = require('bcrypt')


exports.get_register = async (req,res) => {
  try {
    return res.render('auth/register', {
      title: 'register'
    })
  } catch (error) {
    console.log(error)
  }
}

exports.post_register = async (req,res) => {
  const {name,email,password} = req.body
  const hashedPassword = await bcrypt.hash(password,10)
  try {
    await User.create({
      fullname: name,
      email: email,
      password: hashedPassword 
    })
    return res.redirect('login')
  } catch (error) {
    console.log(error)
  }
}

exports.get_login = async (req,res) => {

  try {
    return res.render('auth/login',{
      title: 'login page',
    })
  } catch (error) {
    console.log(error)
  }
}

exports.post_login = async (req,res) => {
  const {email,password} = req.body


  try {
    const user = await User.findOne({
      where: {
        email: email,
      }
    })

    if(!user){
      return res.render('auth/login',{
        title: 'login page',
        message: 'email hatalı'
      })
    }

    const match = await bcrypt.compare(password, user.password)
    if(match){
      req.session.isAuth = 1
      return res.redirect('/')
    }
    return res.render('auth/login',{
      title: 'login page',
      message: 'parola hatalı'
    })
    
  } catch (error) {
    console.log(error)
  }
}

exports.get_logout = async (req,res) => {

  try {
    await req.session.destroy()
    return res.redirect('/account/login')
  } catch (error) {
    console.log(error)
  }
}