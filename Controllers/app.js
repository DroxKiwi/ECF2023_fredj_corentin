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

async function valideReservation(req, res){
    if (req.role == "ROLE_USER" || req.role == "ROLE_ADMIN"){
        const userToken = req.cookies.userToken.token
        const id = req.email
        const { guests, dateres, hourres, allergy } = req.body
        pool.query(`INSERT INTO reservations (email, guests, dateres, hourres, allergy) VALUES ('${id}', '${guests}', '${dateres}', '${hourres}', '${allergy}')`, (error, results) => {
            if (error){
                throw error
            }
            else{
                pool.query(`SELECT preferences FROM users WHERE token = '${userToken}'`, (error, results) => {
                    if (error){
                        throw error
                    }
                    else {
                        const role = req.role
                        const modepreference = results.rows[0].preferences[0]
                        const stage = "recapresvalidated"
                        const templateVars = [id, modepreference, role, hourres, stage, guests, dateres, allergy]
                        res.render('./Templates/reservation.html.twig', { templateVars })
                    }
                })
            }
        })
    }
    else {
        const id = "unauthentificated"
        res.render('./Templates/reservation.html.twig', { id })
    }
}

async function selectHourReservation(req, res){
    if (req.role == "ROLE_USER" || req.role == "ROLE_ADMIN"){
        const userToken = req.cookies.userToken.token
        const id = req.email
        const { guests, dateres, hourres } = req.body
        console.log(guests)
        var dateStr = dateres;
        var day = getDayName(dateStr, "fr-FR"); 
        pool.query(`SELECT maxguests FROM openhours WHERE day = '${day}'`, (error, results) => {
            if (error){
                throw error
            }
            else {
                const maxguests = results.rows[0].maxguests
                pool.query(`SELECT guests FROM reservations WHERE dateres = '${dateres}'`, (error, results) => {
                    if (error){
                        throw error
                    }
                    else {
                        var actualNumberGuests = 0
                        for (let i = 0; i < results.rows.length; i++){
                            actualNumberGuests += results.rows[i].guests
                        }
                        if (actualNumberGuests > maxguests){
                            res.send("Cette heure n'est plus diponible veuillez en choisir une autre")
                        }
                        if ((actualNumberGuests+guests) > maxguests){
                            res.send("Il reste des places mais vous être trop nombreux, veuillez choisir un autre horaire")
                        }
                        else {
                            pool.query(`SELECT preferences FROM users WHERE token = '${userToken}'`, (error, results) => {
                                if (error){
                                    throw error
                                }
                                else {
                                    const role = req.role
                                    const modepreference = results.rows[0].preferences[0]
                                    const stage = "validationres"
                                    const templateVars = [id, modepreference, role, hourres, stage, guests, dateres]
                                    res.render('./Templates/reservation.html.twig', { templateVars })
                                }
                            })
                        }
                    }
                })
            }
        })
    }
    else {
        const id = "unauthentificated"
        res.render('./Templates/reservation.html.twig', { id })
    }
}


// By this function i can extract the day in string type and compare it in database
function getDayName(dateStr, locale)
{
    var date = new Date(dateStr);
    return date.toLocaleDateString(locale, { weekday: 'long' });        
}

async function selectDayReservation(req, res){
    if (req.role == "ROLE_USER" || req.role == "ROLE_ADMIN"){
        const userToken = req.cookies.userToken.token
        const id = req.email
        const { guests, dateres } = req.body
        var dateStr = dateres;
        var day = getDayName(dateStr, "fr-FR"); 
        pool.query(`SELECT state, openhour, closehour FROM openhours WHERE day = '${day}'`, (error, results) => {
            if (error){
                throw error
            }
            else {
                const openhour = results.rows[0].openhour
                const closehour = results.rows[0].closehour
                const state = results.rows[0].state
                const tabhour = []
                tabhour[0] = openhour
                // Here we get < closehour ! make it 1 hour before closing
                for (let i = 1; i < closehour-openhour; i++){
                    tabhour[i] = openhour+i
                }
                if (state == "ouvert"){
                    pool.query(`SELECT preferences FROM users WHERE token = '${userToken}'`, (error, results) => {
                        if (error){
                            throw error
                        }
                        else {
                            const stage = "selecthour"
                            const role = req.role
                            const modepreference = results.rows[0].preferences[0]
                            const templateVars = [id, modepreference, role, tabhour, stage, guests, dateres]
                            res.render('./Templates/reservation.html.twig', { templateVars })
                        }
                    })
                }
                else{
                    res.send("Nous somme fermé ce jour là, veuillez en choisir un autre")
                }
            }
        })
    }
    else {
        const id = "unauthentificated"
        res.render('./Templates/reservation.html.twig', { id })
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
                const modepreference = results.rows[0].preferences[0]
                var dateObj = new Date()
                console.log(dateObj)
                var tabdate = []
                tabdate[0] = dateObj.getUTCMonth()+1+'/'+(dateObj.getUTCDate())+'/'+(dateObj.getUTCFullYear())
                for (let i = 1; i < 14; i++){
                    dateObj.setDate(dateObj.getDate()+1);
                    tabdate[i] = dateObj.getUTCMonth()+1+'/'+(dateObj.getUTCDate())+'/'+(dateObj.getUTCFullYear())
                }
                const stage = "selectday"
                const templateVars = [id, modepreference, role, tabdate, stage]
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
module.exports = { redirectHomepage, redirectContact, sendFormContact, redirectInformation, redirectSettings, redirectMenu, redirectReservation, selectDayReservation, selectHourReservation, valideReservation }