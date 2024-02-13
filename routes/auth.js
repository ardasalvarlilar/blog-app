const express = require('express')
router = express.Router()
const authController = require('../controllers/auth')

router.get('/register', authController.get_register)
router.post('/register', authController.post_register)

module.exports =router