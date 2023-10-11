const mongoose = require('mongoose');

const conDB =  (url) =>(
     mongoose.connect(url)
    
)

module.exports = conDB;