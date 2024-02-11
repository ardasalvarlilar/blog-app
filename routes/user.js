const express = require('express');
const router = express.Router();

const Blog = require('../models/blog')
const Category = require('../models/category')
const {Op} = require('sequelize')

router.use("/blogs/category/:categoryid", async (req, res)=> {
  const categoryid = req.params.categoryid
  try {
    const blogs = await Blog.findAll({
      where: {
        category_id: categoryid,
        confirm: true
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
})

router.use('/blogs/:blogid',async (req,res,next) => {
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
})

router.use('/blogs',async (req,res,next) => {

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
})


router.use('/',async (req,res,next) => {
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
  
})

module.exports = router