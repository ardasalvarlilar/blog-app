const express = require('express');
const router = express.Router();
const imageUpload = require('../helpers/image-upload')
const fs = require('fs')
const db = require('../data/db')

const Blog = require('../models/blog')
const Category = require('../models/category')

router.get('/blog/delete/:blogid', async (req,res) => {
  const {blogid} = req.params

  try {
    const blog = await Blog.findByPk(blogid)

    if(blog){
      return res.render('admin/blog-delete',{
        title: "delete blog",
        blog:blog
      })
    }
    res.redirect('/admin/blogs')
  } catch (error) {
    console.log(error)
  }
})

router.post('/blog/delete/:blogid', async (req,res) => {
  const { blogid } = req.body
  try {
    const blog = await Blog.findByPk(blogid)
    if(blog){
      await blog.destroy()
      return res.redirect('/admin/blogs?action=delete')
    }
    res.redirect('/admin/blogs')
  } catch (error) {
    console.log(error)
  }
  res.redirect('/admin/blogs?action=delete')
})

router.get('/category/delete/:categoryid', async (req,res) => {
  const {categoryid} = req.params

  try {
    const category = await Category.findByPk(categoryid)

    if(category){
      res.render('admin/category-delete',{
        title: "delete category",
        category:category
      })
    }
  } catch (error) {
    console.log(error)
  }
})

router.post('/category/delete/:categoryid', async (req,res) => {
  const { categoryid } = req.body
  try {
    await Category.destroy({
      where: {
        category_id: categoryid
      }
    })
  } catch (error) {
    console.log(error)
  }
  res.redirect('/admin/categories?action=delete')
})

router.get('/blog/create',async(req,res,next) => {
  try {
    // const [categories,] = await db.execute("SELECT * FROM category")
    const categories = await Category.findAll()
    res.render("admin/blog-create",{
      title: 'Blog Ekle',
      categories: categories 
    })
  } catch (error) {
    console.log(error)
  }
})

router.post("/blog/create", imageUpload.upload.single('resim'),async (req,res) => {
  const {baslik,aciklama,kategori,altbaslik} = req.body
  const resim = req.file.filename
  const anasayfa = req.body.anasayfa == 'on' ? 1 : 0
  const isActive = req.body.isActive == 'on' ? 1 : 0

  try {
    await Blog.create({
      title: baslik,
      subtitle: altbaslik,
      description: aciklama,
      image: resim,
      is_home: anasayfa,
      confirm: isActive,
      category_id: kategori
    })
    res.redirect('/admin/blogs?action=create')
  } catch (error) {
    console.log(error)
  }
})

router.get('/category/create',async(req,res,next) => {
  try {
    res.render("admin/category-create",{
      title: 'Category Ekle',
    })
  } catch (error) {
    console.log(error)
  }
})

router.post("/category/create",async (req,res) => {
  const {name} = req.body
  try {
    await Category.create({name: name})
    res.redirect('/admin/categories?action=create')
  } catch (error) {
    console.log(error)
  }
})

router.get('/blogs/:blogid', async (req,res,next) => {
  const {blogid} = req.params
  try {
    const blog = await Blog.findByPk(blogid)
    const categories = await Category.findAll({raw:true})
    if(blog){
      return res.render("admin/blog-edit",{
        title: blog.title,
        blog: blog,
        categories: categories
      })
    }
    res.redirect('admin/blogs')
  } catch (error) {
    
  }
  
})

router.post('/blogs/:blogid', imageUpload.upload.single('resim'), async (req,res) => {
  const {blogid,baslik,aciklama,kategori,altbaslik} = req.body
  let resim = req.body.resim
  if(req.file){
    resim = req.file.filename
    await fs.unlink("./public/images/"+ req.body.resim,err => {
      console.log(err)
    })
  }
  const anasayfa = req.body.anasayfa == 'on' ? 1 : 0
  const isActive = req.body.isActive == 'on' ? 1 : 0
  try {
    const blog = await Blog.findByPk(blogid)
    if(blog){
      blog.title = baslik
      blog.subtitle = altbaslik
      blog.description = aciklama
      blog.image = resim
      blog.is_home = anasayfa
      blog.confirm = isActive
      blog.category_id = kategori

      await blog.save();
      return res.redirect('/admin/blogs?action=edit&blogid='+blogid)
    }
    res.redirect('/admin/blogs')
  } catch (error) {
    console.log(error)
  }
})

router.get('/categories/:categoryid', async (req,res,next) => {
  const {categoryid} = req.params
  try {
    const category = await Category.findByPk(categoryid)
    if(category ){
      return res.render("admin/category-edit",{
        title: category.name,
        category: category
      }) 
    }
    res.redirect('admin/categories')
  } catch (error) {
    
  }
  
})

router.post('/categories/:categoryid', async (req,res) => {
  const {categoryid,name} = req.body
  try {
    // const category = await db.execute('UPDATE category SET name=? WHERE categoryid=?',[name,categoryid])
    await Category.update({name: name},{
      where: {
        category_id: categoryid
      }
    })
    return res.redirect('/admin/categories?action=edit&categoryid='+categoryid)
  } catch (error) {
    console.log(error)
  }
})

router.get('/blogs', async (req,res,next) => {
  const {action,blogid} = req.query
  try {
    // const [blogs,] = await db.execute('SELECT blogid,title,subtitle,image FROM blog')
    const blogs = await Blog.findAll({attributes:['blogid','title','subtitle','image']})
    res.render('admin/blog-list',{
      title: blogs[0].title,
      blogs: blogs,
      action: action,
      blogid:blogid
    })
  } catch (error) {
    console.log(error)
  }
})

router.get('/categories', async (req,res,next) => {
  const {action,categoryid} = req.query
  try {
    const categories = await Category.findAll()
    res.render('admin/category-list',{
      title: 'categories',
      categories: categories,
      action: action,
      categoryid:categoryid
    })
  } catch (error) {
    console.log(error)
  }
})




module.exports = router;