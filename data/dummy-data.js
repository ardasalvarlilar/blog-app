const Category = require('../models/category')
const Blog = require('../models/blog')

async function populate(){
  const count = await Category.count()
  if(count === 0){
    await Category.bulkCreate([ 
      { name: 'Web geliştirme'},
      { name: 'mobil geliştirme'},
      { name: 'React geliştirme'},
    ]) // çoklu ekleme

    await Blog.create({
      title: 'Web geliştirme',
      subtitle: 'web öğren',
      description: 'html css scss tailwind javascript react nodejs',
      image: '5.jpg',
      is_home: true, 
      confirm: true, 
      categoryId: 1
    })

    await Blog.create({
      title: 'Web geliştirme',
      subtitle: 'web öğren',
      description: 'html css scss tailwind javascript react nodejs',
      image: '5.jpg',
      is_home: true, 
      confirm: true, 
      categoryId: 2
    })

    await Blog.create({
      title: 'Web geliştirme',
      subtitle: 'web öğren',
      description: 'html css scss tailwind javascript react nodejs',
      image: '5.jpg',
      is_home: true, 
      confirm: true, 
      categoryId: 3
    })
  }

}

module.exports = populate