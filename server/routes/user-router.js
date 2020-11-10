const express = require('express')

const UserCtrl = require('../controllers/user-ctrl')

const router = express.Router()

router.post('/register', UserCtrl.createUser)
router.put('/user/:id', UserCtrl.updateUser)
router.delete('/user/:id', UserCtrl.deleteUser)
router.get('/user/:id', UserCtrl.getUserById)
router.get('/users', UserCtrl.getUsers)
router.post('/login', UserCtrl.loginUsers)
router.post('/validateUser',UserCtrl.checkUserEmailOrPhone)
router.get('/countries', UserCtrl.countryData)
module.exports = router
