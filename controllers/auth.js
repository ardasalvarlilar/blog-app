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