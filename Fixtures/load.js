const { Pool } = require('pg');
const encryptPassword = require("../Utils/encryptPassword")

// INSERT INTO users (email, token, salt,  hash, role, preferences) VALUES ('corentinfredj.dev@gmail.com', 'iqC0_ikQaMW6tPYu', 'aKN1WN-Jxu6Sd3Zw', 'xZotNnkVaLPRwS2B9kFykKgrDBMJEzSwl/nUx2hj9rY=', 'ROLE_ADMIN', '{"darkmode"}');

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
    console.log(token, salt, hash)
    console.log("Fixture load -> creat : Admin user | email : admin@admin.com, password : admin")
    pool.query(`INSERT INTO users (email, token, salt, hash, role, preferences) VALUES ('${email}','${token}','${salt}', '${hash}', '${role}', '{"darkmode"}')`, (error, results) => {
        if (error){
            throw error
        }
        else {
            pool.query(`INSERT INTO openhours (day, state, maxguests, openhour, closehour) VALUES
                ('lundi', 'fermé', '30', '0', '0'),
                ('mardi', 'ouvert', '30', '11', '14'),
                ('mercredi', 'ouvert', '30', '11', '14'),
                ('jeudi', 'ouvert', '30', '11', '14'),
                ('vendredi', 'ouvert', '30', '11', '14'),
                ('samedi', 'ouvert', '30', '19', '22'),
                ('dimanche', 'fermé', '30', '0', '0')
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