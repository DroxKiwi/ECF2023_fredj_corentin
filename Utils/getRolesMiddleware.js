const pool = require('../Utils/db');

async function getRolesMiddleware(req, res, next){
    if (!req.cookies.userToken){
        req.role = "unauthentificated"
        return next()
    }
    const userToken = req.cookies.userToken.token
    pool.query(`SELECT * FROM users WHERE token = '${userToken}'`, (error, results) => {
        if (error){
            throw error
        }
        const userCheck = results.rows[0]
        if (!userCheck){
            req.role = "unauthentificated"
            return next()
        }
        req.email = userCheck.email
        req.role = userCheck.role
        return next()
    })
}

module.exports = getRolesMiddleware