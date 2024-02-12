const fs = require('fs')

const Blog = require('../models/blog')
const Category = require('../models/category')

exports.get_blog_delete = async (req,res) => {
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
}

exports.post_blog_delete = async (req,res) => {
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
}

exports.get_category_delete =  async (req,res) => {
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
}

exports.post_category_delete = async (req,res) => {
  const { categoryid } = req.body
  try {
    await Category.destroy({
      where: {
        id: categoryid
      }
    })
  } catch (error) {
    console.log(error)
  }
  res.redirect('/admin/categories?action=delete')
}

exports.get_blog_create = async(req,res,next) => {
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
}

exports.post_blog_create = async (req,res) => {
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
      categoryId: kategori
    })
    res.redirect('/admin/blogs?action=create')
  } catch (error) {
    console.log(error)
  }
}

exports.get_category_create = async(req,res,next) => {
  try {
    res.render("admin/category-create",{
      title: 'Category Ekle',
    })
  } catch (error) {
    console.log(error)
  }
}

exports.post_category_create = async (req,res) => {
  const {name} = req.body
  try {
    await Category.create({name: name})
    res.redirect('/admin/categories?action=create')
  } catch (error) {
    console.log(error)
  }
}

exports.get_blog_edit = async (req,res,next) => {
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
    console.log(error)
  }
}

exports.post_blog_edit = async (req,res) => {
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
    await Blog.update({
      title: baslik,
      subtitle: altbaslik,
      description: aciklama,
      image: resim,
      is_home: anasayfa,
      confirm: isActive,
      categoryId: kategori
    },{
      where: {
        id: blogid
      }
    })
    return res.redirect('/admin/blogs?action=edit&blogid='+blogid)
  } catch (error) {
    console.log(error)
  }
}

exports.get_category_edit = async (req,res,next) => {
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
    console.log(error)
  }
}

exports.post_category_edit = async (req,res) => {
  const {categoryid,name} = req.body
  try {
    await Category.update({name: name},{
      where: {
        id: categoryid
      }
    })
    return res.redirect('/admin/categories?action=edit&categoryid='+categoryid)
  } catch (error) {
    console.log(error)
  }
}

exports.get_blogs = async (req,res,next) => {
  const {action,blogid} = req.query
  try {
    const blogs = await Blog.findAll({attributes:['id','title','subtitle','image']})
    res.render('admin/blog-list',{
      title: 'Blogs list',
      blogs: blogs,
      action: action,
      blogid:blogid
    })
  } catch (error) {
    console.log(error)
  }
}

exports.get_categories = async (req,res,next) => {
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
}