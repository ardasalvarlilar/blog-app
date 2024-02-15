const express = require('express');
const router = express.Router();
const imageUpload = require('../helpers/image-upload')
const isAuth = require('../middlewares/auth')

const adminController = require('../controllers/admin');
const csrf = require('../middlewares/csrf');

router.get('/blog/delete/:blogid',isAuth,csrf, adminController.get_blog_delete)

router.post('/blog/delete/:blogid', adminController.post_blog_delete)

router.get('/category/delete/:categoryid',isAuth,csrf, adminController.get_category_delete)

router.post('/category/delete/:categoryid', adminController.post_category_delete)

router.get('/blog/create',isAuth,csrf, adminController.get_blog_create)

router.post('/categories/remove', adminController.get_category_remove)

router.post("/blog/create", imageUpload.upload.single('resim'),adminController.post_blog_create)

router.get('/category/create',isAuth,csrf, adminController.get_category_create)

router.post("/category/create",adminController.post_category_create)

router.get('/blogs/:blogid',isAuth,csrf, adminController.get_blog_edit)

router.post('/blogs/:blogid', imageUpload.upload.single('resim'), adminController.post_blog_edit)

router.get('/categories/:categoryid',isAuth,csrf, adminController.get_category_edit)

router.post('/categories/:categoryid', adminController.post_category_edit)

router.get('/blogs',isAuth,adminController.get_blogs)

router.get('/categories',isAuth, adminController.get_categories)

router.get('/roles',isAuth, adminController.get_roles)

router.get('/roles/:roleid',isAuth,csrf, adminController.get_role_edit)

router.post('/roles/remove',isAuth, adminController.roles_remove)

router.post('/roles/:roleid',isAuth, adminController.post_role_edit)

router.post('/users/:userid', isAuth, adminController.post_user_edit)
router.get('/users/:userid',isAuth, csrf, adminController.get_user_edit);
router.get('/users', isAuth, adminController.get_user)

module.exports = router;