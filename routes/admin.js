const express = require('express');
const router = express.Router();
const imageUpload = require('../helpers/image-upload')
const fs = require('fs')
const db = require('../data/db')

router.get('/blog/delete/:blogid', async (req,res) => {
  const {blogid} = req.params

  try {
    const [blogs,]  = await db.execute('SELECT * FROM blog WHERE blogid=?',[blogid])
    const blog = blogs[0]

    res.render('admin/blog-delete',{
      title: "delete blog",
      blog:blog
    })
  } catch (error) {
    console.log(error)
  }
})

router.post('/blog/delete/:blogid', async (req,res) => {
  const { blogid } = req.body
  await db.execute('DELETE FROM blog where blogid=?',[blogid])
  res.redirect('/admin/blogs?action=delete')
})

router.get('/category/delete/:categoryid', async (req,res) => {
  const {categoryid} = req.params

  try {
    const [categories,]  = await db.execute('SELECT * FROM category WHERE categoryid=?',[categoryid])
    const category = categories[0]

    res.render('admin/category-delete',{
      title: "delete category",
      category:category
    })
  } catch (error) {
    console.log(error)
  }
})

router.post('/category/delete/:categoryid', async (req,res) => {
  const { categoryid } = req.body
  await db.execute('DELETE FROM category where categoryid=?',[categoryid])
  res.redirect('/admin/categories?action=delete')
})


router.get('/blog/create',async(req,res,next) => {
  try {
    const [categories,] = await db.execute("SELECT * FROM category")
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
    await db.execute("INSERT INTO blog (title,description,image,is_home,confirm,categoryid,subtitle) VALUES(?,?,?,?,?,?,?)",[baslik,aciklama,resim,anasayfa,isActive,kategori,altbaslik])
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
    await db.execute("INSERT INTO category (name) VALUES(?)",[name])
    res.redirect('/admin/categories?action=create')
  } catch (error) {
    console.log(error)
  }
})

router.get('/blogs/:blogid', async (req,res,next) => {
  const {blogid} = req.params
  try {
    const [blogs, ] = await db.execute('SELECT * FROM blog WHERE blogid=?',[blogid])
    const [categories, ] = await db.execute('SELECT * FROM  category')
    const blog = blogs[0]
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
    fs.unlink("./public/images/"+ req.body.resim,err => {
      console.log(err)
    })
  }
  const anasayfa = req.body.anasayfa == 'on' ? 1 : 0
  const isActive = req.body.isActive == 'on' ? 1 : 0
  try {
    const blog = await db.execute('UPDATE blog SET title=?,description=?,image=?,is_home=?,confirm=?,categoryid=?,subtitle=? WHERE blogid=?',[baslik,aciklama,resim,anasayfa,isActive,kategori,altbaslik,blogid])
    if(blog){
      res.redirect('/admin/blogs?action=edit&blogid='+blogid)
    }
  } catch (error) {
    
  }
})

router.get('/categories/:categoryid', async (req,res,next) => {
  const {categoryid} = req.params
  try {
    const [categories, ] = await db.execute('SELECT * FROM category WHERE categoryid=?',[categoryid])
    const category = categories[0]
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
    const category = await db.execute('UPDATE category SET name=? WHERE categoryid=?',[name,categoryid])
    if(category){
      res.redirect('/admin/categories?action=edit&categoryid='+categoryid)
    }
  } catch (error) {
    console.log(error)
  }
})

router.get('/blogs', async (req,res,next) => {
  const {action,blogid} = req.query
  try {
    const [blogs,] = await db.execute('SELECT blogid,title,subtitle,image FROM blog')
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
    const [categories,] = await db.execute('SELECT * FROM category')
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