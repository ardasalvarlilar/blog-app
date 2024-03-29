const User = require('../models/user')
const bcrypt = require('bcrypt')
const emailService = require('../helpers/send-mail')
const config = require('../config')
const crypto = require('crypto')
const { Op } = require('sequelize')

exports.get_register = async (req,res,next) => {
  try {
    return res.render('auth/register', {
      title: 'register'
    })
  } catch (error) {
    next(error)
  }
}

exports.post_register = async (req,res,next) => {
  const {name,email,password} = req.body
  try {
    // throw new Error('error')
    const newUser = await User.create({
      fullname: name,
      email: email,
      password: password 
    })

    emailService.sendMail({
      from: config.email.from,
      to: newUser.email,
      subject: 'account creation',
      text: 'your account has been created successfully'
    })
    req.session.message = {text: 'you can sign in your account', class: 'success'}

    return res.redirect('login')
  } 
  catch (error) {
    let mesg = ''
    if(error.name == 'SequelizeValidationError' || error.name == 'SequelizeUniqueConstraintError'){
      for(let e of error.errors){
        mesg += e.message + ""
      }
      return res.render('auth/register', {
        title: 'register',
        message: {text: mesg, class: 'danger'}
      })
    }else{
      next(error)
    }
  }
}

exports.get_login = async (req,res,next) => {
  const message = req.session.message
  delete req.session.message
  try {
    return res.render('auth/login',{
      title: 'login page',
      message: message,
      csrfToken: req.csrfToken()
    })
  } catch (error) {
    next(error)
  }
}

exports.post_login = async (req,res,next) => {
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
        message: {text: 'Email did not match', class: 'danger'}
      })
    }

    const match = await bcrypt.compare(password, user.password)
    if(match){
      const userRoles = await user.getRoles({
        attributes: ['rolename'],
        raw: true
      })
      req.session.roles = userRoles.map((role) => role['rolename'])
      req.session.isAuth = true
      req.session.fullname = user.fullname
      req.session.userid = user.id
      const url = req.query.returnUrl || '/'
      return res.redirect(url)
    }
    return res.render('auth/login',{
      title: 'login page',
      message: {text: 'password did not match', class: 'danger'}
    })
    
  } catch (error) {
    next(error)
  }
}

exports.get_logout = async (req,res,next) => {

  try {
    await req.session.destroy()
    return res.redirect('/account/login')
  } catch (error) {
    next(error)
  }
}

exports.get_reset = async (req,res,next) => {
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

exports.post_reset = async (req,res,next) => {
  const email = req.body.email
  try {
    let token = crypto.randomBytes(32).toString('hex')
    const user = await User.findOne({where: {email: email}})

    if(!user){
      req.session.message = {text: 'Counld not found mail entered', class: 'danger'}
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
        <p>Use the link below to reset your password</p>
        <p>
          <a href="http://127.0.0.1:3000/account/new-password/${token}">Reset password</a>
        </p>
      `
    })
    req.session.message = {text: 'Check your email to reset your password', class:'success'}
    res.redirect('login')
  } catch (error) {
    console.log(error)
  }
}

exports.get_newpassword = async (req,res,next) => {
  const token = req.params.token
  try {
    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiration: {
          [Op.gt] : Date.now()
        }
      }
    })
    return res.render('auth/new-password', {
      title: 'reset password',
      token: token,
      userId: user.id
    })
  } catch (error) {
    console.log(error)
    
  }
}

exports.post_newpassword = async (req,res,next) => {
  const {token,userId} = req.body
  const newPassword = req.body.password
  try {
    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiration: {
          [Op.gt] : Date.now()
        },
        id: userId
      }
    })

    user.password = await bcrypt.hash(newPassword,10)
    user.resetToken = null
    user.resetTokenExpiration = null
    await user.save()
    req.session.message = {text: 'Your password has been updated successfully', class: 'success'}
    return res.redirect('login')
  } catch (error) {
    console.log(error)
  }
}