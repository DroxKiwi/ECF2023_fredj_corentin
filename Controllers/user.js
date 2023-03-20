const encryptPassword = require("../Utils/encryptPassword")
const decryptPassword = require("../Utils/decryptPassword")
const generateRandomPassword = require ("../Utils/generatePassword")
const logger = require("../Utils/logger")
const pool = require('../Utils/db');

// Get all the users stored into the database and send it to the dashboard
async function usersGet(req, res){
    // ROLE_ADMIN needed to get users in DB
    if (req.role == "ROLE_ADMIN"){
        // Here we are managing the search bar request from admin dashboard
        const { searchrequest } = req.body
        if (!searchrequest){
            const userToken = req.cookies.userToken.token
            const id = req.email
            // We select into the database the preferences in link with the current user connected by checking the token
            pool.query(`SELECT preferences FROM users WHERE token = '${userToken}'`, (error, results) => {
                if (error){
                    throw error
                }
                else {
                    const modepreference = results.rows[0].preferences[0]
                    pool.query(`SELECT user_id, email, role FROM users`, (error, results) => {
                        if (error){
                            throw error
                        }
                        else {
                            const users = results.rows
                            // We send the preferences to the twig template 
                            const templateVars = [id, modepreference, users]
                            res.render('./Templates/AdminDashboard/dashboard.html.twig', { templateVars })
                        }
                    })
                }
            })
        }
        else {
            const userToken = req.cookies.userToken.token
            const id = req.email
            // We select into the database the preferences in link with the current user connected by checking the token
            pool.query(`SELECT preferences FROM users WHERE token = '${userToken}'`, (error, results) => {
                if (error){
                    throw error
                }
                else {
                    const modepreference = results.rows[0].preferences[0]
                    // I define a modele based SQL to use LIKE statement to send every user where an email, token or even role is matching
                    const modeleSQL = "%"+searchrequest+"%"
                    pool.query(`SELECT * FROM users WHERE email LIKE '${modeleSQL}' OR token LIKE '${modeleSQL}' OR role LIKE '${modeleSQL}'`, (error, results) => {
                        if (error){
                            throw error
                        }
                        else{
                            const length = results.rows.length
                            const users = results.rows
                            const templateVars = [id, modepreference, users, length]
                            res.render('./Templates/AdminDashboard/dashboard.html.twig', { templateVars })
                        }
                    })
                }
            })
        }
    }
    else {
        res.redirect(302, '/')
    }
}

// Creat a new user
async function userCreate(req, res){
    const { sendCreate } = req.body
    if (sendCreate == "true"){
        if (req.role == "ROLE_ADMIN"){
            const { email, password, role } = req.body
            const {token, salt, hash} = encryptPassword(password)
    
            message = "Create a user -> email : "+email+", role : "+role
            logger.newLog(req.cookies.userToken.token, message)
    
            pool.query(`SELECT email FROM users WHERE email = '${email}'`, (error, results) => {
                if (error){
                    throw error
                }
                else {
                    // We check if a user is allready existing with this email
                    if (!results.rows[0]){
                        pool.query(`INSERT INTO users (email, token, salt, hash, role, preferences) VALUES ('${email}','${token}','${salt}', '${hash}', '${role}', '{"darkmode"}')`, (error, results) => {
                            if (error) {
                                throw error
                            }
                            res.redirect(302, '/dashboard')
                        })
                    }
                    else {
                        res.send("Un compte existe déjà avec cet Email !")
                    }
                }
            } )
        }
        else {
            const { email, password } = req.body
            const {token, salt, hash} = encryptPassword(password)
            let role = "ROLE_USER"
            pool.query(`SELECT email FROM users WHERE email = '${email}'`, (error, results) => {
                if (error){
                    throw error
                }
                else {
                    // We check if a user is allready existing with this email
                    if (!results.rows[0]){
                        pool.query(`INSERT INTO users (email, token, salt, hash, role, preferences) VALUES ('${email}','${token}','${salt}', '${hash}', '${role}', '{"darkmode"}')`, (error, results) => {
                            if (error) {
                                throw error
                            }
                            res.redirect(302, '/')
                        })
                    }
                    else {
                        res.send("Un compte existe déjà avec cet Email !")
                    }
                }
            } )
        }
    }
    else {
        res.render('./Templates/createaccount.html.twig')
    }
}

// I had to make an other function and form for a request of password resest because the tag "<input type='checkbox' isn't working"
async function resetPassword(req, res){
    if (req.role == "ROLE_ADMIN"){
        const { user_id } = req.body
        const length = 5
        const password = generateRandomPassword(length)
        const {token, salt, hash} = encryptPassword(password)

        pool.query(`SELECT email FROM users WHERE user_id = '${user_id}'`, (error, results) => {
            if (error){
                throw error
            }
            else {
                const email = results.rows[0].email
                message = "Reset a password for : "+email
                logger.newLog(req.cookies.userToken.token, message)
        
                pool.query(`UPDATE users SET token = '${token}', salt = '${salt}', hash = '${hash}' WHERE user_id = '${user_id}'`, (error, results) => {
                    if (error){
                        throw error
                    }
                    else {
                        // Here the application is supposed to send the new password to the user
                        console.log(password)
                        res.redirect(302, 'dashboard')
                    }
                })
            }
        })
    }
}

// Update an existing user
async function userUpdate(req, res){
    if (req.role != "ROLE_USER" && req.role != "ROLE_ADMIN"){
        res.redirect(302, '/')
    }
    else {
        const { email, password, role, nonselfupdate, user_id } = req.body

        // Here we are updating an user giving by his user_id. Only Admin can do that
        // To make a difference between an update of his own account or the update of an user account, I implement a value nonselfupdate
        if (req.role == "ROLE_ADMIN" && nonselfupdate == "true"){

            message = "Update a user : "+email 
            logger.newLog(req.cookies.userToken.token, message)

            pool.query(`SELECT * FROM users WHERE user_id = '${user_id}'`, (error, results) => {
                if (error){
                    throw error
                }
                else {
                    const currentUser_id = results.rows[0].user_id
                    if (password == ""){
                        pool.query(`UPDATE users SET email = '${email}', role = '${role}' WHERE user_id = '${currentUser_id}'`, (error, results) => {
                            if (error){
                                throw error
                            }
                            else {
                                res.redirect(302, '/dashboard')
                            }
                        })
                    }
                    else {
                        const {token, salt, hash} = encryptPassword(password)
                        pool.query(`UPDATE users SET email = '${email}', token = '${token}', salt = '${salt}', hash = '${hash}', role = '${role}' WHERE user_id = '${currentUser_id}'`, (error, results) => {
                            if (error){
                                throw error
                            }
                            else {
                                res.redirect(302, '/dashboard')
                            }
                        })
                    }
                }
            })
        }
        // Here we are updating the user account itself (the one beeing connected)
        else {
            const userToken = req.cookies.userToken.token
            message = "Update is account email : "+email
            logger.newLog(req.cookies.userToken.token, message)

            //const { email, password } = req.body
            // To verify which form is send we check if email or password is true (not null)
            if (email){
                const row = "email"
                const value = email
                pool.query(`UPDATE users SET ${row} = '${value}' WHERE token = '${userToken}'`, (error, results) => {
                    if (error){
                        throw error
                    }
                    res.redirect(302, '/information')
                });
            }
            if (password){
                const value = password
                pool.query(`SELECT user_id FROM users WHERE token = '${userToken}'`, (error, results) => {
                    if (error){
                        throw error
                    }
                    const user_id = results.rows[0].user_id
                    if (!user_id){
                        return res.send("Aucun compte trouvé ! Contacter un Admin si nécessaire")
                    }
                    const {token, salt, hash} = encryptPassword(value)
                    pool.query(`UPDATE users SET token = '${token}', salt = '${salt}', hash = '${hash}' WHERE user_id = '${user_id}'`, (error, results) => {
                        if (error){
                            throw error
                        }
                        res.redirect(302, '/information')
                    })
                })
            }
        }
    }
}

// Delete a user by token selection
async function userDelete(req, res){
    if (req.role != "ROLE_USER" && req.role != "ROLE_ADMIN"){
        return res.json("Seulement les Admins peuvent effectuer cette action")
    }
    else {
        const { user_id, nonselfupdate } = req.body
        if (req.role == "ROLE_ADMIN" && nonselfupdate == "true"){
            pool.query(`SELECT email FROM users WHERE user_id = '${user_id}'`, (error ,results) => {
                if (error){
                    throw error
                }
                else {
                    const email = results.rows[0].email
                    message = "Delete an user : "+email
                    logger.newLog(req.cookies.userToken.token, message)
                    pool.query(`DELETE FROM users WHERE user_id = '${user_id}'`, (error, results) => {
                        if (error){
                            throw error
                        }
                        else {
                            res.redirect(302, "/dashboard")
                        }
                    })
                }
            })
        }
        else {
            const userToken = req.cookies.userToken.token
            // first we check if the current token is matching an user_id 
            pool.query(`SELECT user_id FROM users WHERE token = '${userToken}'`, (error, results) => {
                if (error){
                    throw error
                }
                else {
                    const selectedUserId = results.rows[0].user_id
                    const email = req.email
                    if (!selectedUserId){
                        return res.json('Aucun utilisateur trouvé via vos identifiants de compte ! Contactez un Admin')
                    }
                    else {
                        message = "Delete his account : "+email
                        logger.newLog(req.cookies.userToken.token, message)
                        // If yes, we delete it
                        pool.query(`DELETE FROM users WHERE user_id = '${selectedUserId}'`, (error, results) => {
                            if (error){
                                throw error
                            }
                            res.redirect(302, '/')
                        })
                    }
                }
            })
        }
    }
}

// Here we set the preferences choosen by the user into the databse
async function settingsPreferences(req, res){
    if (req.role == "ROLE_USER" || req.role == "ROLE_ADMIN"){
        const userToken = req.cookies.userToken.token
        const { colorapp } = req.body
        pool.query(`UPDATE users SET preferences[0] = '${colorapp}' WHERE token = '${userToken}'`, (error, results) => {
            if (error){
                throw error
            }
            else {
                res.redirect(302, '/settings')
            }
        })
    }
    else {
        res.redirect(302, '/')
    }
}

async function userLogin(req, res){
    const { sendLogin, email, password, remember } = req.body
    if (sendLogin == "true"){
        pool.query(`SELECT * FROM users WHERE email = '${email}'`, (error, results) => {
            if (error){
                throw error
            }
            if (!results.rows[0]){
                return res.send("Aucun utilisateur trouvé ! Contactez un Admin ou vérifiez vos identifiants")
            }
            else {
                const currentUser = results.rows[0]
                // Once an email is found, we decrypt the password to check if it match
                const userToken = decryptPassword(currentUser, password)
                if (!userToken){
                    return res.send('Connexion impossible, vérifiez votre mot de passe')
                }
                else {
    
                    message = "Log in : "+currentUser.email
                    logger.newLog(currentUser.token, message)
    
                    // If the user want to be log in for long time, we create a 1 year token
                    if (remember){
                        // token is saved for 1 year
                        res.cookie('userToken', userToken, { maxAge: 15552000000, httpOnly: true });
                        //res.send('Authentication successful');
                        res.redirect(302, '/')     
                    }
                    else {
                        // token is saved for 25 minutes
                        res.cookie('userToken', userToken, { maxAge: 900000, httpOnly: true });
                        //res.send('Authentication successful');
                        res.redirect(302, '/')
                    }
                }
            }
        })
    }
    else {
        res.render('./Templates/login.html.twig')
    }
}

// Used to delete cookies 
async function userLogout(req, res){

    userToken = req.cookies.userToken.token

    pool.query(`SELECT email FROM users WHERE token = '${userToken}'`, (error, results) => {
        if (error){
            throw error
        }
        else {
            email = results.rows[0].email
            message = "Log out : "+email
            logger.newLog(req.cookies.userToken.token, message)
        
            res.clearCookie('userToken')
            res.redirect(302, '/')
            //res.redirect('/')
        }
    })
}

module.exports = { usersGet, userCreate, resetPassword, userUpdate, userDelete, settingsPreferences, userLogin, userLogout }