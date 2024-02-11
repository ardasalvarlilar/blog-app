const express = require('express');

const app = express();

const path = require('path');

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))

const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin')


app.use('/libs',express.static(path.join(__dirname, 'node_modules')));
app.use('/static',express.static(path.join(__dirname,'public')));

app.use('/admin',adminRoutes)
app.use(userRoutes)


app.listen(3000,() => {
  console.log('listening on port 3000');
})