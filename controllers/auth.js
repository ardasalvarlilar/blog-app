const User = require('../models/user')

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

  try {
    await User.create({
      fullname: name,
      email: email,
      password: password 
    })
    return res.redirect('login')
  } catch (error) {
    console.log(error)
  }
}