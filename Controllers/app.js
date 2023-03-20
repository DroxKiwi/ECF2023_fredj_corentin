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
                const role = req.role
                const templateVars = [id, modepreference, role]
                res.render('./Templates/home.html.twig', { templateVars })
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
async function redirectContact(req, res){
    const { sendContact, message, type } = req.body
    if ( sendContact == "true" ){
        const userToken = req.cookies.userToken.token
        pool.query(`SELECT user_id FROM users WHERE token = '${userToken}'`, (error, results) => {
            if (error){
                throw error
            }
            else {
                const user_id = results.rows[0].user_id
                pool.query(`INSERT INTO contacts (user_id, type, message) VALUES ('${user_id}', '${type}', '${message}')`, (error, results) => {
                    if (error){
                        throw error
                    }
                    else {
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
                                const formSend = "Votre formulaire a bien été pris en compte !"
                                const templateVars = [id, modepreference, role, formSend]
                                res.render('./Templates/contact.html.twig', { templateVars })
                            }
                        })
                    }
                })
            }
        })
    }
    else {
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
                const templateVars = [id, modepreference, role]
                res.render('./Templates/menu.html.twig', { templateVars })
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

module.exports = { redirectHomepage, redirectContact, redirectInformation, redirectSettings, redirectMenu, redirectReservation }