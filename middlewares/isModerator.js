module.exports = (req,res,next) => {
  if(!req.session.isAuth){
    return res.redirect('/account/login?returnUrl='+req.originalUrl)
  }
  if(!req.session.roles.includes('admin') && !req.session.roles.includes('moderator')){
    req.session.message = {text: 'yetkili bir kullanıcıyla oturum açınız'}
    return res.redirect('/account/login?returnUrl='+req.originalUrl)
  }
  next()
}