const express = require('express');
const router = express.Router();

const db = require('../data/db')


const data = {
  title: 'Popüler Kurslar',
  categories: ["Web geliştirme", "Mobil geliştirme","Python geliştirme","React geliştirme",],
  blogs: [
    {
      blogid: 1,
      title: 'Komple uygulamalı web geliştirme',
      description: 'Web geliştir',
      image: "5.jpg",
      is_home: false
    },
    {
      blogid: 2,
      title: 'Komple uygulamalı REACT geliştirme',
      description: 'React geliştir',
      image: "14.jpg",
      is_home: true
    },
  ]
}

router.use("/blogs/category/:categoryid", async (req, res)=> {
  const categoryid = req.params.categoryid
  try {
    const [blogs,] = await db.execute("SELECT * FROM blog WHERE categoryid=?",[categoryid])
    const  [categories, ] = await db.execute('SELECT * FROM category')
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
    const [[blog,],] = await db.execute('SELECT * FROM blog WHERE blogid=?',[id])
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
    const [blogs,] = await db.execute("SELECT * FROM blog WHERE confirm=1")
    const [categories,] = await db.execute('SELECT * FROM category')
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
    const [blogs,] = await db.execute("SELECT * FROM blog WHERE confirm=1 AND is_home=1")
    const [categories,] = await db.execute('SELECT * FROM category')
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