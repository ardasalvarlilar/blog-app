const fs = require('fs')

const Blog = require('../models/blog')
const Category = require('../models/category')
const {Op} = require('sequelize')
const sequelize = require('../data/db')
const slugField = require('../helpers/slug-field')
const Role = require('../models/role')
const User = require('../models/user')

exports.get_blog_delete = async (req,res) => {
  const {blogid} = req.params
  const userid = req.session.userid
  const isAdmin = req.session.roles.includes('admin')
  try {
    const blog = await Blog.findOne({where: isAdmin ? {id: blogid} : {id: blogid, userId: userid}})

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
      title: 'add Blog',
      categories: categories 
    })
  } catch (error) {
    console.log(error)
  }
}

exports.post_blog_create = async function(req, res) {
  const baslik = req.body.baslik;
  const altbaslik = req.body.altbaslik;
  const aciklama = req.body.aciklama;
  const anasayfa = req.body.anasayfa == "on" ? 1:0;
  const onay = req.body.onay == "on"? 1:0;
  const userid = req.session.userid;
  let resim = "";

  try {

      if(baslik == "") {
          throw new Error("title can not leave blank");
      }

      if(baslik.length < 5 || baslik.length > 20) {
          throw new Error("title should be between 5 - 20 characters");
      }

      if(aciklama == "") {
          throw new Error("description can not leave blank");
      }

      if(req.file) {
          resim = req.file.filename;

          fs.unlink("./public/images/" + req.body.resim, err => {
              console.log(err);
          });
      }

      await Blog.create({
          baslik: baslik,
          url: slugField(baslik),
          altbaslik: altbaslik,
          aciklama: aciklama,
          resim: resim,
          anasayfa: anasayfa,
          onay: onay,
          userId: userid
      });
      res.redirect("/admin/blogs?action=create");
  }
  catch(err) {
      let hataMesaji = "";

      if(err instanceof Error) {
          hataMesaji += err.message;

          res.render("admin/blog-create", {
              title: "add blog",
              categories: await Category.findAll(),
              message: {text: hataMesaji, class: "danger"},
              values: {
                  baslik: baslik,
                  altbaslik: altbaslik,
                  aciklama: aciklama
              }
          });
      }
  }
}

exports.get_category_create = async(req,res,next) => {
  try {
    res.render("admin/category-create",{
      title: 'Add Category',
    })
  } catch (error) {
    res.redirect('/500')
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
  const userid = req.session.userid
  const isAdmin = req.session.roles.includes('admin')

  try {
    const blog = await Blog.findOne({
      where: isAdmin ? {id: blogid} : {id: blogid,userId: userid },
      include: {
        model: Category,
        attributes: ["id"]
      }
    })
    const categories = await Category.findAll({raw:true})
    if(blog){
      return res.render("admin/blog-edit",{
        title: blog.title,
        blog: blog,
        categories: categories
      })
    }
    res.redirect('/admin/blogs')
  } catch (error) {
    console.log(error)
  }
}

exports.post_blog_edit = async (req,res) => {
  const {blogid,url,baslik,aciklama,altbaslik} = req.body
  const categoryIds = req.body.categories
  const userid = req.session.userid

  console.log(categoryIds)
  let resim = req.body.resim
  if(req.file){
    resim = req.file.filename
    fs.unlink("./public/images/"+ req.body.resim,err => {
      console.log(err)
    })
  }
  const anasayfa = req.body.anasayfa == 'on' ? 1 : 0
  const isActive = req.body.isActive == 'on' ? 1 : 0
  const isAdmin = req.session.roles.includes('admin')
  try {
    const blog = await Blog.findOne({
      where: isAdmin ? {id: blogid}: {id: blogid, userId: userid},
      include: {
        model: Category,
        attributes: ["id"]
      }
    })
    if(blog) {
      blog.title = baslik
      blog.url = url
      blog.subtitle = altbaslik
      blog.description = aciklama
      blog.image = resim
      blog.is_home = anasayfa
      blog.confirm = isActive
      if(categoryIds === undefined){
        await blog.removeCategories(blog.categories)
      }else{
        await blog.removeCategories(blog.categories)
        const selectedCategories = await Category.findAll({
          where: {
            id: {
              [Op.in]: categoryIds
            }
          }
        })
        await blog.addCategories(selectedCategories)
      }

      await blog.save()
      return res.redirect('/admin/blogs?action=edit&blogid='+blogid)
    }
    res.redirect('/admin/blogs')
  } catch (error) {
    console.log(error)
  }
}

exports.get_category_remove = async (req,res) => {
  const blogid = req.body.blogid
  const categoryid = req.body.categoryid

  await sequelize.query(`DELETE FROM blogCategories WHERE blogId=${blogid} AND categoryId=${categoryid}`)
  res.redirect('/admin/categories/'+categoryid)

}

exports.get_category_edit = async (req,res,next) => {
  const {categoryid} = req.params
  try {
    const category = await Category.findByPk(categoryid)
    const blogs = await category.getBlogs()
    const countBlogs = await category.countBlogs()
    if(category ){
      return res.render("admin/category-edit",{
        title: category.name,
        category: category,
        blogs: blogs,
        countBlogs :countBlogs
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
  const userid = req.session.userid
  const {action,blogid} = req.query
  const isModerator = req.session.roles.includes('moderator')
  const isAdmin = req.session.roles.includes('admin')
  try {
    const blogs = await Blog.findAll({
      attributes:['id','title','subtitle','image'],
      include: {
        model: Category,
        attributes: ['name']
      },
      where: isModerator && !isAdmin ? {userId: userid} : null
    })
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

exports.get_roles = async (req,res,next) => {
  try {
    const roles = await Role.findAll({
      attributes: {
        include: ['role.id','role.rolename',[sequelize.fn('COUNT',sequelize.col('users.id')),'user_count']]
      },
      include: [
        {model: User, attributes: ['id']}
      ],
      group: ['role.id'],
      raw: true,
      includeIgnoreAttributes: false
    })
    res.render('admin/role-list',{
      title: 'role list',
      roles: roles
    })
  } catch (error) {
    console.log(error)
  }
}

exports.get_role_edit = async (req,res,next) => {
  const {roleid} = req.params
  try {
    const role = await Role.findByPk(roleid)
    const users = await role.getUsers()
    if(role){
      return res.render('admin/role-edit',{
        title: role.rolename,
        role:role,
        users:users
      })
    }
    res.redirect('admin/roles')
  } catch (error) {
    console.log(error)
  }
}

exports.post_role_edit = async (req,res,next) => {
  const {roleid, rolename} = req.body
  try {
    await Role.update({rolename: rolename},{
      where: {
        id: roleid
      }
    })
    return res.redirect('/admin/roles')
  } catch (error) {
    console.log(error)
  }
}

exports.roles_remove = async (req,res) => {
  const {roleid, userid} = req.body
  try {
    await sequelize.query(`DELETE FROM userRoles WHERE userId=${userid} AND roleId=${roleid}`)
    return res.redirect('/admin/roles/'+roleid)
  } catch (error) {
    console.log(error)
  }
}

exports.get_user = async (req,res) => {
  try {
    const users = await User.findAll({
      attributes: ['id','fullname','email'],
      include: {
        model: Role,
        attributes: ['rolename']
      }
    })
    res.render('admin/user-list',{
      title: 'user list',
      users: users
    })
  } catch (error) {
    console.log(error)
  }
}

exports.get_user_edit = async (req,res) => {
  const userid = req.params.userid
  try {
    const user = await User.findOne({
      where: {id: userid},
      include:{
        model: Role,
        attributes: ['id']
      }
    })
    const roles = await Role.findAll()
    console.log('butun roller:',roles)
    res.render('admin/user-edit',{
      title: 'user detail',
      user: user,
      roles: roles
    })
  } catch (error) {
    
  }
}

exports.post_user_edit = async (req,res) => {
  const userid = req.body.userid
  const fullname = req.body.fullname
  const email = req.body.email
  const roleIds = req.body.roles
  console.log(roleIds)
  try {
    const user = await User.findOne({
      where: {id: userid},
      include:{model: Role,attributes: ['id']}
    })
    
    if(user){
      user.fullname = fullname
      user.email = email
      if(roleIds == undefined){
        await user.removeRoles(user.roles)
      }else{
        await user.removeRoles(user.roles)
        const selectedRoles = await Role.findAll({
          where:{
            id: {
              [Op.in]: roleIds
            }
          }
        })
        await user.addRoles(selectedRoles)
      }
      await user.save()
      return res.redirect('/admin/users')
    }
    return res.redirect('/admin/users')
  } catch (error) {
    console.log(error)
  }
}