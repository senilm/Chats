const { BadRequestError, Unauthenticated } = require('../errors')
const jwt = require('jsonwebtoken')

const authMiddleware = (req,res,next) =>{
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new BadRequestError("Please Provide Token")
    }
    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.ACCESS_KEY)
        req.user = {
            id:payload.id,
            name:payload.name
        }
        next()
    } catch (error) {
        throw new Unauthenticated(error)
    }

}

module.exports = authMiddleware