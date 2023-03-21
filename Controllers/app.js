const pool = require('../Utils/db');
const logger = require("../Utils/logger")


// Redirection to the landingpage
async function redirectHomepage(req, res){
    if (req.role == "ROLE_USER" || req.role == "ROLE_ADMIN"){
        const userToken = req.cookies.userToken.token
        const id = req.email
        console.log(id)
        // We select into the database the preferences in link with the current user connected by checking the token
        pool.query(`SELECT preferences FROM users WHERE token = '${userToken}'`, (error, results) => {
            if (error){
                throw error
            }
            else {
                // We send the preferences to the twig template 
                modepreference = results.rows[0].preferences[0]
                pool.query(`SELECT * FROM openhours`, (error, results) => {
                    if (error){
                        throw error
                    }
                    else {
                        // We send the preferences to the twig template 
                        const openhours = results.rows
                        const role = req.role
                        const templateVars = [id, modepreference, role, openhours]
                        res.render('./Templates/home.html.twig', { templateVars })
                    }
                })
            }
        })
    }
    else {
        // This variable "id" allowed the twig template to adapt what it need to show (connection button, create account button, ...)
        const id = "unauthentificated"
        res.render('./Templates/home.html.twig', { id })
    }
}

// Redirection to the contact page
// NEED TO BE UPDATED !!!
async function sendFormContact(req, res){
    const { message, type } = req.body
    const userToken = req.cookies.userToken.token
    pool.query(`SELECT user_id FROM users WHERE token = '${userToken}'`, (error, results) => {
        if (error){
            throw error
        }
        else {
            console.log("send contact")
            const user_id = results.rows[0].user_id
            pool.query(`INSERT INTO contacts (user_id, type, message) VALUES ('${user_id}', '${type}', '${message}')`, (error, results) => {
                if (error){
                    throw error
                }
                else {
                    res.redirect(302, '/contact')
                }
            })
        }
    })
}

async function redirectContact(req, res){
    if (req.role == "ROLE_USER" || req.role == "ROLE_ADMIN"){
        const userToken = req.cookies.userToken.token
        const id = req.email
        pool.query(`SELECT preferences FROM users WHERE token = '${userToken}'`, (error, results) => {
            if (error){
                throw error
            }
            else {
                // We send the preferences to the twig template 
                modepreference = results.rows[0].preferences[0]
                const role = req.role
                const templateVars = [id, modepreference, role]
                res.render('./Templates/contact.html.twig', { templateVars })
            }
        })
    }
    else {
        const id = "unauthentificated"
        res.render('./Templates/contact.html.twig', { id })
    }
}

// Redirection to the information page account
async function redirectInformation(req, res){
    if (req.role == "ROLE_USER" || req.role == "ROLE_ADMIN"){
        const userToken = req.cookies.userToken.token
        const id = req.email
        pool.query(`SELECT preferences FROM users WHERE token = '${userToken}'`, (error, results) => {
            if (error){
                throw error
            }
            else {
                modepreference = results.rows[0].preferences[0]
                pool.query(`SELECT email FROM users WHERE token = '${userToken}'`, (error, results) => {
                    if (error){
                        throw error
                    }
                    else {
                        const email = results.rows[0].email
                        const templateVars = [id, modepreference, email]
                        res.render('./Templates/information.html.twig', { templateVars })
                    }
                })
            }
        })
    }
    // If the user is not loged, we redirect him to the landingpage
    else {
        res.redirect(302, '/')
    }
}

// Redirection to the settings account page
async function redirectSettings(req, res){
    if (req.role == "ROLE_USER" || req.role == "ROLE_ADMIN"){
        const userToken = req.cookies.userToken.token
        const id = req.email
        pool.query(`SELECT preferences FROM users WHERE token = '${userToken}'`, (error, results) => {
            if (error){
                throw error
            }
            else {
                modepreference = results.rows[0].preferences[0]
                const templateVars = [id, modepreference]
                res.render('./Templates/settings.html.twig', { templateVars })
            }
        })
    }
    else {
        res.redirect(302, '/')
    }
}

async function redirectMenu(req, res){
    if (req.role == "ROLE_USER" || req.role == "ROLE_ADMIN"){
        const userToken = req.cookies.userToken.token
        const id = req.email
        pool.query(`SELECT preferences FROM users WHERE token = '${userToken}'`, (error, results) => {
            if (error){
                throw error
            }
            else {
                const role = req.role
                modepreference = results.rows[0].preferences[0]
                pool.query(`SELECT * FROM menus`, (error, results) => {
                    if (error){
                        throw error
                    }
                    else {
                        const menus = results.rows
                        pool.query(`SELECT * FROM formules`, (error, results) => {
                            if (error){
                                throw error
                            }
                            else {
                                const formules = results.rows
                                const templateVars = [id, modepreference, role, menus, formules]
                                res.render('./Templates/menu.html.twig', { templateVars })
                            }
                        })
                    }
                })
            }
        })
    }
    else {
        const id = "unauthentificated"
        res.render('./Templates/menu.html.twig', { id })
    }
}

async function redirectReservation(req, res){
    if (req.role == "ROLE_USER" || req.role == "ROLE_ADMIN"){
        const userToken = req.cookies.userToken.token
        const id = req.email
        pool.query(`SELECT preferences FROM users WHERE token = '${userToken}'`, (error, results) => {
            if (error){
                throw error
            }
            else {
                const role = req.role
                modepreference = results.rows[0].preferences[0]
                const templateVars = [id, modepreference, role]
                res.render('./Templates/reservation.html.twig', { templateVars })
            }
        })
    }
    else {
        const id = "unauthentificated"
        res.render('./Templates/reservation.html.twig', { id })
    }
}

        // If we send a request for uploading an image
module.exports = { redirectHomepage, redirectContact, sendFormContact, redirectInformation, redirectSettings, redirectMenu, redirectReservation }