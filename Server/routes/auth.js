const express = require('express')
const {login, register,setAvatar,getAllUser,getUser} = require('../controllers/auth')
const authMiddleware = require('../middlewares/authorization')

const router = express.Router()


router.route('/login').post(login)
router.route('/register').post(register)
router.route('/setAvatar/:id').post(setAvatar)
router.route('/allUsers/:id').get(getAllUser)
router.route('/searchUser/:name').get(getUser)


module.exports = router

