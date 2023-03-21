const { Pool } = require('pg');
const encryptPassword = require("../Utils/encryptPassword")


// Verify information about database HERE !!!!
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'database_dev_studiecf',
    password: 'psqlpsw',
})


function fixtureLoad(){
    const email = "admin@admin.com"
    const password = "admin"
    const role = "ROLE_ADMIN"
    const {token, salt, hash} = encryptPassword(password)
    console.log("Fixture load -> creat : Admin user | email : admin@admin.com, password : admin")
    pool.query(`INSERT INTO users (email, token, salt, hash, role, preferences) VALUES ('${email}','${token}','${salt}', '${hash}', '${role}', '{"darkmode"}')`, (error, results) => {
        if (error){
            throw error
        }
        else {
            pool.query(`INSERT INTO openhours (day, state, openhour, closehour) VALUES
                ('lundi', 'fermé', '0', '0'),
                ('mardi', 'fermé', '0', '0'),
                ('mercredi', 'fermé', '0', '0'),
                ('jeudi', 'fermé', '0', '0'),
                ('vendredi', 'fermé', '0', '0'),
                ('samedi', 'fermé', '0', '0'),
                ('dimanche', 'fermé', '0', '0')
                `, (error, results) => {
                if (error){
                    throw error
                }
                else {
                    console.log("Fixture loaded ! you can now connect as admin ... wait pls :D the script will automatically close")
                }
            })
        }
    })
}

fixtureLoad()