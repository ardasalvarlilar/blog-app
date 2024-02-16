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
      { name: 'Web geliştirme',url: slugField('Web geliştirme'),},
      { name: 'mobil geliştirme',url: slugField('Mobil geliştirme'),},
      { name: 'React geliştirme',url: slugField('React geliştirme'),},
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
      {title: 'Web geliştirmeyi öğren',url: slugField('Web geliştirmeyi öğren'),subtitle: 'web öğren',description: 'html css scss tailwind javascript react nodejs',image: '5.jpg',is_home: true, confirm: true,userId:2 },
      {title: 'React geliştirme kursu',url: slugField('React geliştirme kursu'),subtitle: 'react öğren',description: 'react props hooks effect state nextjs nodejs',image: '5.jpg',is_home: true, confirm: true,userId:2 },
      {title: 'Mobil oyun geliştirme bootcampi',url: slugField('Yapay zeka geliştirme bootcampi'),subtitle: 'yapay öğren',description: 'python numpy pandas R ',image: '5.jpg',is_home: true, confirm: true,userId:2 },
      {title: 'Mobil oyun geliştirme bootcampi 2',url: slugField('Yapay zeka geliştirme bootcampi'),subtitle: 'yapay öğren',description: 'python numpy pandas R ',image: '5.jpg',is_home: true, confirm: true,userId:2 },
      {title: 'Mobil oyun geliştirme bootcampi 3',url: slugField('Yapay zeka geliştirme bootcampi'),subtitle: 'yapay öğren',description: 'python numpy pandas R ',image: '5.jpg',is_home: true, confirm: true,userId:2 },
      {title: 'Mobil oyun geliştirme bootcampi 4',url: slugField('Yapay zeka geliştirme bootcampi'),subtitle: 'yapay öğren',description: 'python numpy pandas R ',image: '5.jpg',is_home: true, confirm: true,userId:2 },
      {title: 'Mobil oyun geliştirme bootcampi 5',url: slugField('Yapay zeka geliştirme bootcampi'),subtitle: 'yapay öğren',description: 'python numpy pandas R ',image: '5.jpg',is_home: true, confirm: true,userId:4 },
      {title: 'Mobil oyun geliştirme bootcampi 6',url: slugField('Yapay zeka geliştirme bootcampi'),subtitle: 'yapay öğren',description: 'python numpy pandas R ',image: '5.jpg',is_home: true, confirm: true,userId:4 },
      {title: 'Mobil oyun geliştirme bootcampi 7',url: slugField('Yapay zeka geliştirme bootcampi'),subtitle: 'yapay öğren',description: 'python numpy pandas R ',image: '5.jpg',is_home: true, confirm: true,userId:4 },
      {title: 'Mobil oyun geliştirme bootcampi 8',url: slugField('Yapay zeka geliştirme bootcampi'),subtitle: 'yapay öğren',description: 'python numpy pandas R ',image: '5.jpg',is_home: true, confirm: true,userId:4 },
      {title: 'Mobil oyun geliştirme bootcampi 9',url: slugField('Yapay zeka geliştirme bootcampi'),subtitle: 'yapay öğren',description: 'python numpy pandas R ',image: '5.jpg',is_home: true, confirm: true,userId:4 },
      {title: 'Mobil oyun geliştirme bootcampi 10',url: slugField('Yapay zeka geliştirme bootcampi'),subtitle: 'yapay öğren',description: 'python numpy pandas R ',image: '5.jpg',is_home: true, confirm: true,userId:4 },
      {title: 'Mobil oyun geliştirme bootcampi 11',url: slugField('Yapay zeka geliştirme bootcampi'),subtitle: 'yapay öğren',description: 'python numpy pandas R ',image: '5.jpg',is_home: true, confirm: true,userId:2 },
      {title: 'Mobil oyun geliştirme bootcampi 12',url: slugField('Yapay zeka geliştirme bootcampi'),subtitle: 'yapay öğren',description: 'python numpy pandas R ',image: '5.jpg',is_home: true, confirm: true,userId:2 },
      {title: 'Mobil oyun geliştirme bootcampi 13',url: slugField('Yapay zeka geliştirme bootcampi'),subtitle: 'yapay öğren',description: 'python numpy pandas R ',image: '5.jpg',is_home: true, confirm: true,userId:2 },
      {title: 'Mobil oyun geliştirme bootcampi 14',url: slugField('Yapay zeka geliştirme bootcampi'),subtitle: 'yapay öğren',description: 'python numpy pandas R ',image: '5.jpg',is_home: true, confirm: true,userId:4 },
      {title: 'Mobil oyun geliştirme bootcampi 15',url: slugField('Yapay zeka geliştirme bootcampi'),subtitle: 'yapay öğren',description: 'python numpy pandas R ',image: '5.jpg',is_home: true, confirm: true,userId:4 },
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