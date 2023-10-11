const express = require('express')
const {getAllMsg, addMsg} = require('../controllers/message')
const router = express.Router();


router.route('/addMsg').post(addMsg);
router.route('/getMsg').post(getAllMsg)


module.exports = router