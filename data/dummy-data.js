const Category = require('../models/category')
const Blog = require('../models/blog')

async function populate(){
  const count = await Category.count()
  if(count === 0){
    
    const categories = await Category.bulkCreate([ 
      { name: 'Web geliştirme'},
      { name: 'mobil geliştirme'},
      { name: 'React geliştirme'},
    ]) // çoklu ekleme

    const blogs = await Blog.bulkCreate([
      {title: 'Web geliştirme',subtitle: 'web öğren',description: 'html css scss tailwind javascript react nodejs',image: '5.jpg',is_home: true, confirm: true, },
      {title: 'React geliştirme',subtitle: 'react öğren',description: 'react props hooks effect state nextjs nodejs',image: '5.jpg',is_home: true, confirm: true, },
      {title: 'Yapay zeka geliştirme',subtitle: 'yapay öğren',description: 'python numpy pandas R ',image: '5.jpg',is_home: true, confirm: true, },
    ])

    await categories[0].addBlog(blogs[0])
    await categories[0].addBlog(blogs[1])
    await categories[1].addBlog(blogs[1])
    await categories[1].addBlog(blogs[1])
    await categories[1].addBlog(blogs[2])
    await categories[2].addBlog(blogs[2])
    await categories[2].addBlog(blogs[1])
    await categories[2].addBlog(blogs[2])
    await blogs[0].addCategory(categories[0])
    await categories[0].createBlog(
      {title: 'Yeni Blog',subtitle: 'yeni blog alt başlık',description: 'yeni blog açıklama',image: '5.jpg',is_home: true, confirm: true, }
    )
  }
}

module.exports = populate