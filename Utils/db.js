const { Pool } = require('pg')

const pool = new Pool({
    user: process.env.POSTGRES_USER || 'postgres',
    host: process.env.HOST || 'localhost',
    database: process.env.DATABASE || 'database_dev_studiecf',
    password: process.env.PASSWORD || 'psqlpsw'
})


// Used for the fly.io version database 
//const pool = new Pool({
//  user: 'postgres',
//  host: 'ecffredjcorentin-db.internal',
//  database: 'ecffredjcorentin',
//  password: 'RtWJB6aLsWDkrYP',
//  port: 5433,
//  proxy: 5432
//})
//
//module.exports = pool