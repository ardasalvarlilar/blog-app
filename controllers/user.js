const Blog = require('../models/blog')
const Category = require('../models/category')
const {Op} = require('sequelize')




exports.blogs_details = async (req,res,next) => {
  const slug = req.params.slug

  try {
    const blog = await Blog.findOne({
      where: {
        url: slug
      }
    })
    if(blog){
      return res.render("users/blog-details",{
        title: blog.title,
        blog: blog
      })
    }
    else{
      res.redirect('/')
    }
  } catch (error) {
    console.log(error)
  }
}

exports.blog_list = async (req,res,next) => {
  const size = 5
  const {page = 0} = req.query
  const slug = req.params.slug

  try {
    const {rows, count} = await Blog.findAndCountAll({
      where: {confirm: true},
      raw: true,
      include: slug ? {model: Category, where: {url: slug}} : null, 
      limit: size,
      offset: page * size 
    })
    const categories = await Category.findAll({raw: true})
    res.render("users/blogs",{
      title: "Tüm Kurslar",
      blogs: rows,
      totalItems: count,
      totalPages: Math.ceil(count / size),
      currentPage: page,
      categories: categories,
      selectedCategory: slug
    });
  } catch (error) {
    console.log(error)
  }
}

exports.index = async (req,res,next) => {
  const {isAuth} = req.cookies
  try {
    const blogs = await Blog.findAll({
      where:{
        [Op.and]: [
          {is_home: true},
          {confirm: true},
        ]
      },
      raw: true
    })
    const categories = await Category.findAll()
    res.render("users/index",{
      title: "Popüler Kurslar",
      blogs: blogs,
      categories: categories,
      selectedCategory: null,
      isAuth: isAuth
    });
  } catch (error) {
    console.log(error)
  }
  
}