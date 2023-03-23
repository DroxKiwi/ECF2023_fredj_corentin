const { Pool } = require('pg')


// For production version by Fly.io
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    user: process.env.POSTGRES_USER || 'postgres',
    host: process.env.HOST || 'localhost',
    database: process.env.DATABASE || 'database_dev_studiecf',
    password: process.env.PASSWORD || 'psqlpsw'
})
pool.connect()
const res = pool.query('SELECT * FROM user')
console.log(res.rows)
pool.end()


 
// For local version
//const pool = new Pool({
//    user: process.env.POSTGRES_USER || 'postgres',
//    host: process.env.HOST || 'localhost',
//    database: process.env.DATABASE || 'database_dev_studiecf',
//    password: process.env.PASSWORD || 'psqlpsw',
//})



module.exports = pool