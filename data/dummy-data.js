const Category = require('../models/category')
const Blog = require('../models/blog')
const slugField = require('../helpers/slug-field')

async function populate(){
  const count = await Category.count()
  if(count === 0){
    
    const categories = await Category.bulkCreate([ 
      { name: 'Web geliştirme',url: slugField('Web geliştirme'),},
      { name: 'mobil geliştirme',url: slugField('Mobil geliştirme'),},
      { name: 'React geliştirme',url: slugField('React geliştirme'),},
    ]) // çoklu ekleme

    const blogs = await Blog.bulkCreate([
      {title: 'Web geliştirmeyi öğren',url: slugField('Web geliştirmeyi öğren'),subtitle: 'web öğren',description: 'html css scss tailwind javascript react nodejs',image: '5.jpg',is_home: true, confirm: true, },
      {title: 'React geliştirme kursu',url: slugField('React geliştirme kursu'),subtitle: 'react öğren',description: 'react props hooks effect state nextjs nodejs',image: '5.jpg',is_home: true, confirm: true, },
      {title: 'Mobil oyun geliştirme bootcampi',url: slugField('Yapay zeka geliştirme bootcampi'),subtitle: 'yapay öğren',description: 'python numpy pandas R ',image: '5.jpg',is_home: true, confirm: true, },
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
  }
}

module.exports = populate