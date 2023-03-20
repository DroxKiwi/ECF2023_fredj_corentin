const fs = require('fs')
const { Pool } = require('pg')


// Verify information about database HERE !!!!
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'database_dev_studiecf',
    password: 'psqlpsw',
})


// Read the SQL file
const usersModel = fs.readFileSync('users.sql').toString()
const contactsModel = fs.readFileSync('contacts.sql').toString()
const logsModel = fs.readFileSync('logs.sql').toString()
const imagesModel = fs.readFileSync('images.sql').toString()
const menusModel = fs.readFileSync('menus.sql').toString()

// Execute the SQL commands in the database
pool.query(usersModel, (err, result) => {
    if (err) throw err
    else {
        console.log("betatestersModel imported")
        pool.query(contactsModel, (err, result) => {
            if (err) throw err
            else {
                console.log("contactsModel imported")
                pool.query(logsModel, (err, result) => {
                    if (err) throw err
                    else {
                        console.log("logsModel imported")
                        pool.query(imagesModel, (err, result) => {
                            if (err) throw err
                            else {
                                console.log("imageModel imported")
                                pool.query(menusModel, (err, result) => {
                                    if (err) throw err
                                    else {
                                        console.log("menusModel imported")
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }
})