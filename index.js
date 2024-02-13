const express = require('express');

const app = express();

const path = require('path');

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))

const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin')
const authRoutes = require('./routes/auth')


app.use('/libs',express.static(path.join(__dirname, 'node_modules')));
app.use('/static',express.static(path.join(__dirname,'public')));

app.use('/admin',adminRoutes)
app.use('/account',authRoutes)
app.use(userRoutes)
const sequelize = require('./data/db')
const dummyData = require('./data/dummy-data')
const Category = require('./models/category')
const Blog = require('./models/blog')
const User = require('./models/user')
// relations
Blog.belongsTo(User,{
  foreignKey: {
    allowNull: true
  }
})
User.hasMany(Blog)
Blog.belongsToMany(Category, {through: "blogCategories"})
Category.belongsToMany(Blog, {through: "blogCategories"})

Blog.belongsTo(Category)
// sync

// iife
const iife = async () => {
  await sequelize.sync({force: true})
  await dummyData()
}
iife()

app.listen(3000,() => {
  console.log('listening on port 3000');
})