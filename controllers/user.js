const Blog = require('../models/blog')
const Category = require('../models/category')
const {Op} = require('sequelize')


exports.blogs_by_category = async (req, res)=> {
  const categoryid = req.params.categoryid
  try {
    const blogs = await Blog.findAll({
      where: {
        confirm: true
      },
      include: {
        model: Category,
        where: {id: categoryid}
      },
      raw: true
    })
    const categories = await Category.findAll({raw: true})
    res.render("users/blogs",{
      title: "Tüm Kurslar",
      blogs: blogs,
      categories:categories,
      selectedCategory: categoryid
    })
  } catch (error) {
    console.log(error)
  }
}

exports.blogs_details = async (req,res,next) => {
  const id = req.params.blogid

  try {
    const blog = await Blog.findByPk(id)
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

  try {
    const blogs = await Blog.findAll({
      where: {
        confirm: true
      },
      raw: true
    })
    const categories = await Category.findAll({raw: true})
    res.render("users/blogs",{
      title: "Tüm Kurslar",
      blogs: blogs,
      categories: categories,
      selectedCategory: null
    });
  } catch (error) {
    console.log(error)
  }
}

exports.index = async (req,res,next) => {
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
      selectedCategory: null
    });
  } catch (error) {
    console.log(error)
  }
  
}