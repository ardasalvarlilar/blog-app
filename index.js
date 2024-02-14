// express modules
const express = require('express');
const app = express();

// session & cookies
const cookieParser = require('cookie-parser')
const session = require('express-session')
const SequelizeStore = require('connect-session-sequelize')(session.Store)

// node modules
const path = require('path');

// routes
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin')
const authRoutes = require('./routes/auth')

// custom modules
const sequelize = require('./data/db')
const dummyData = require('./data/dummy-data')

// template engine
app.set('view engine', 'ejs')

// Models
const Category = require('./models/category')
const Blog = require('./models/blog')
const User = require('./models/user')

// middleware
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(session({
  secret: "hello node",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  },
  store: new SequelizeStore({
    db: sequelize
  })
}))



app.use('/libs',express.static(path.join(__dirname, 'node_modules')));
app.use('/static',express.static(path.join(__dirname,'public')));

app.use('/admin',adminRoutes)
app.use('/account',authRoutes)
app.use(userRoutes)


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
  // await sequelize.sync({force: true})
  // await dummyData()
}
iife()

app.listen(3000,() => {
  console.log('listening on port 3000');
})