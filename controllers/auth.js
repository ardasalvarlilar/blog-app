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
    const user = await User.findOne({where: {email: email}})
    if(user){
      req.session.message = {text: 'Girdiğiniz mail adresi zaten kayıtlı', class: 'warning'}
      return res.redirect('login')
    }
    await User.create({
      fullname: name,
      email: email,
      password: hashedPassword 
    })
    req.session.message = {text: 'Hesabınıza giriş yapabilirsiniz', class: 'success'}

    return res.redirect('login')
  } catch (error) {
    console.log(error)
  }
}

exports.get_login = async (req,res) => {
  const message = req.session.message
  delete req.session.message
  try {
    return res.render('auth/login',{
      title: 'login page',
      message: message
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
        message: {text: 'Email hatalı', class: 'danger'}
      })
    }

    const match = await bcrypt.compare(password, user.password)
    if(match){
      req.session.isAuth = true
      req.session.fullname = user.fullname
      const url = req.query.returnUrl || '/'
      return res.redirect(url)
    }
    return res.render('auth/login',{
      title: 'login page',
      message: {text: 'Parola hatalı', class: 'danger'}
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