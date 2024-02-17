const Category = require('../models/category')
const Blog = require('../models/blog')
const slugField = require('../helpers/slug-field')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const Role = require('../models/role')
async function populate(){
  const count = await Category.count()
  if(count === 0){
    
    const categories = await Category.bulkCreate([ 
      { name: 'Category name 1',url: slugField('Category name 1'),},
      { name: 'category name 2',url: slugField('category name 2'),},
      { name: 'category name 3',url: slugField('category name 3'),},
    ]) // çoklu ekleme

    const users = await User.bulkCreate([
      {fullname: 'Arda Şalvarlılar', email: 'arda4salvar7@gmail.com',password: await bcrypt.hash('123456',10)},
      {fullname: 'Tuna Şalvarlılar', email: 'tunasalvarlilar@gmail.com',password: await bcrypt.hash('tuna123',10)},
      {fullname: 'Göksu Akımsar', email: 'goksuakimsar@gmail.com',password: await bcrypt.hash('goksu123',10)},
      {fullname: 'Gökhan Bıyıkoğlu', email: 'gokhanbyk@gmail.com',password: await bcrypt.hash('gokhan123',10)},
    ])

    const roles = await Role.bulkCreate([
      {rolename: "admin"},
      {rolename: "moderator"},
      {rolename: "guest"},
    ])

    await users[0].addRole(roles[0])
    await users[1].addRole(roles[1])
    await users[2].addRole(roles[2])
    await users[3].addRole(roles[1])

    const blogs = await Blog.bulkCreate([
      {title: 'blog test 1',url: slugField('blog test 1'),subtitle: 'blog test subtitle',description: 'test description',image: '5.jpg',is_home: true, confirm: true,userId:2 },
      {title: 'blog test 2',url: slugField('blog test 2'),subtitle: 'blog test subtitle',description: 'test description',image: '5.jpg',is_home: true, confirm: true,userId:2 },
      {title: 'blog test 3',url: slugField('blog test 3'),subtitle: 'blog test subtitle',description: 'test description',image: '5.jpg',is_home: true, confirm: true,userId:4 },
      {title: 'blog test 4',url: slugField('blog test 4'),subtitle: 'blog test subtitle',description: 'test description',image: '5.jpg',is_home: true, confirm: true,userId:4 },
    ])



    await categories[0].addBlog(blogs[0])
    await categories[0].addBlog(blogs[1])
    await categories[1].addBlog(blogs[1])
    await categories[1].addBlog(blogs[1])
    await categories[1].addBlog(blogs[2])
    await categories[2].addBlog(blogs[2])
    await categories[2].addBlog(blogs[1])
    await categories[2].addBlog(blogs[2])
    await categories[2].addBlog(blogs[3])
    await categories[2].addBlog(blogs[4])
    await categories[2].addBlog(blogs[5])
    await categories[2].addBlog(blogs[6])
    await categories[2].addBlog(blogs[7])
    await categories[2].addBlog(blogs[8])
    await categories[2].addBlog(blogs[9])
    await categories[2].addBlog(blogs[10])
    await categories[2].addBlog(blogs[11])
    await categories[2].addBlog(blogs[12])
    await categories[2].addBlog(blogs[13])
    await categories[2].addBlog(blogs[14])
    await categories[2].addBlog(blogs[15])
    await categories[2].addBlog(blogs[16])
    await blogs[0].addCategory(categories[0])
  }
}

module.exports = populate