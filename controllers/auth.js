const User = require('../models/user')
const bcrypt = require('bcrypt')
const emailService = require('../helpers/send-mail')
const config = require('../config')
const crypto = require('crypto')

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
    const newUser = await User.create({
      fullname: name,
      email: email,
      password: hashedPassword 
    })

    emailService.sendMail({
      from: config.email.from,
      to: newUser.email,
      subject: 'Hesabınız oluşturuldu',
      text: 'Hesabınız başarılı şekilde oluşturuldu.'
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
      message: message,
      csrfToken: req.csrfToken()
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

exports.get_reset = async (req,res) => {
  const message = req.session.message
  delete req.session.message
  try {
    return res.render('auth/reset-password', {
      title: 'reset password',
      message: message
    })
  } catch (error) {
    console.log(error)
  }
}

exports.post_reset = async (req,res) => {
  const email = req.body.email
  try {
    let token = crypto.randomBytes(32).toString('hex')
    const user = await User.findOne({where: {email: email}})

    if(!user){
      req.session.message = {text: 'Girdiğiniz mail adresi bulunamadı', class: 'danger'}
      return res.redirect('reset-password')
    }

    user.resetToken = token
    user.resetTokenExpiration = Date.now() + (1000 * 60 * 60)
    await user.save()

    emailService.sendMail({
      from: config.email.from,
      to: email,
      subject: 'reset password',
      html: `
        <p>Parolanızı günvellemek için aşağıdaki linki kullanın</p>
        <p>
          <a href="http://127.0.0.1:3000/account/reset-password/${token}">Parola sıfırla</a>
        </p>
      `
    })
    req.session.message = {text: 'Parolanızı sıfırlamak için eposta adresinizi kontrol ediniz', class:'success'}
    res.redirect('login')
  } catch (error) {
    console.log(error)
  }
}