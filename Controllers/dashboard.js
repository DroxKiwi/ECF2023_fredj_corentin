const pool = require('../Utils/db');
var fs = require('fs');
const path = require('path');
const easyimg = require('easyimage');

async function redirectDashboard(req, res){
    if (req.role == "ROLE_ADMIN"){
        res.redirect(302, 'usersGet')
    }
    else {
        res.redirect(302, '/')
    }
}

async function redirectShowUser(req, res){
    const { user_id } = req.body
    if (req.role == "ROLE_ADMIN"){
        const userToken = req.cookies.userToken.token
        const id = req.email
        // We select into the database the preferences in link with the current user connected by checking the token
        pool.query(`SELECT preferences FROM users WHERE token = '${userToken}'`, (error, results) => {
            if (error){
                throw error
            }
            else {
                const modepreference = results.rows[0].preferences[0]
                pool.query(`SELECT * FROM users WHERE user_id = '${user_id}'`, (error, results) => {
                    if (error){
                        throw error
                    }
                    else {
                        email = results.rows[0].email
                        token = results.rows[0].token
                        role = results.rows[0].role
                        pool.query(`SELECT * FROM logs WHERE user_id = '${user_id}'`, (error, results) => {
                            if (error){
                                throw error
                            }
                            else {
                                const logs = results.rows
                                const templateVars = [ id, modepreference, user_id, email, token, role, logs ]
                                res.render('./Templates/AdminDashboard/showuser.html.twig', { templateVars })
                            }
                        })
                    }
                })
            }
        })
    }
    else {
        res.redirect(302, '/')
    }
}

async function redirectLogs(req, res){
    if (req.role == "ROLE_ADMIN"){
        const userToken = req.cookies.userToken.token
        const id = req.email
        // We select into the database the preferences in link with the current user connected by checking the token
        pool.query(`SELECT preferences FROM users WHERE token = '${userToken}'`, (error, results) => {
            if (error){
                throw error
            }
            else {
                const modepreference = results.rows[0].preferences[0]
                pool.query(`SELECT * FROM logs`, (error, results) => {
                    if (error){
                        throw error
                    }
                    else {
                        const logs = results.rows
                        const templateVars = [ id, modepreference, logs ]
                        res.render('./Templates/AdminDashboard/logs.html.twig', { templateVars })
                    }
                })
            }
        })
    }
    else {
        res.redirect(302, "/")
    }
}

async function redirectFormcontact(req, res){
    if (req.role == "ROLE_ADMIN"){
        const userToken = req.cookies.userToken.token
        const id = req.email
        // We select into the database the preferences in link with the current user connected by checking the token
        pool.query(`SELECT preferences FROM users WHERE token = '${userToken}'`, (error, results) => {
            if (error){
                throw error
            }
            else {
                const modepreference = results.rows[0].preferences[0]
                pool.query(`SELECT * FROM contacts`, (error, results) => {
                    if (error){
                        throw error
                    }
                    else {
                        const formcontacts = results.rows
                        const templateVars = [ id, modepreference, formcontacts ]
                        res.render('./Templates/AdminDashboard/formcontact.html.twig', { templateVars })
                    }
                })
            }
        })
    }
    else {
        res.redirect(302, "/")
    }
}

async function addOpenHours(req, res){
    if (req.role == "ROLE_ADMIN"){
        const { day, state, openhour, closehour } = req.body
        if (openhour > closehour){
            res.send("Impossible d'ajouter la règle ! votre heure de début doit être inférieur à l'heure de fin !")
        }
        else {
            pool.query(`INSERT INTO openhours (day, state, openhour, closehour) VALUES ('${day}', '${state}', '${openhour}', '${closehour}')`, (error, results) => {
                if (error){
                    throw error
                }
                else {
                    res.redirect(302, '/managesite')
                }
            })
        }
    }
    else {
        res.redirect(302, '/')
    }
}

async function deleteOpenHours(req, res){
    if (req.role == "ROLE_ADMIN"){
        const { openhour_id } = req.body
        pool.query(`DELETE FROM openhours WHERE openhour_id = '${openhour_id}'`, (error, results) => {
            if (error){
                throw error
            }
            else {
                res.redirect(302, '/managesite')
            }
        })
    }
    else {
        res.redirect(302, '/')
    }
}

async function addFormule(req, res){
    if (req.role == "ROLE_ADMIN"){
        const { title, period, description, price } = req.body
        pool.query(`INSERT INTO formules (title, period, description, price) VALUES ('${title}', '${period}', '${description}', '${price}')`, (error, results) => {
            if (error){
                throw error
            }
            else {
                res.redirect(302, '/managesite')
            }
        })
    }
    else {
        res.redirect(302, '/')
    }
}

async function deleteFormule(req, res){
    if (req.role == "ROLE_ADMIN"){
        const { formule_id } = req.body
        pool.query(`DELETE FROM menus WHERE formule_id = '${formule_id}'`, (error, results) => {
            if (error){
                throw error
            }
            else {
                res.redirect(302, '/managesite')
            }
        })
    }
    else {
        res.redirect(302, '/')
    }
}

async function addMenu(req, res){
    if (req.role == "ROLE_ADMIN"){
        const { type, title, description, price } = req.body
        pool.query(`INSERT INTO menus (type, title, description, price) VALUES ('${type}', '${title}', '${description}', '${price}')`, (error, results) => {
            if (error){
                throw error
            }
            else {
                res.redirect(302, '/managesite')
            }
        })
    }
    else {
        res.redirect(302, '/')
    }
}

async function deleteMenu(req, res){
    if (req.role == "ROLE_ADMIN"){
        const { menu_id } = req.body
        pool.query(`DELETE FROM menus WHERE menu_id = '${menu_id}'`, (error, results) => {
            if (error){
                throw error
            }
            else {
                res.redirect(302, '/managesite')
            }
        })
    }
    else {
        res.redirect(302, '/')
    }
}

// This function is used to set the image we want on the landing page of the site
async function selectImage(req, res){
    if (req.role == "ROLE_ADMIN"){
        const { selectImage } = req.body
        const { imageFullName } = req.body
        const imgName = path.parse(imageFullName).name
        const imgExt = path.parse(imageFullName).ext
        const tmp_path = './Public/Uploads/'+imageFullName
        const tmp_extless = tmp_path.replace(imgExt,'.png')
        await easyimg.convert({src: tmp_path, dst: tmp_extless, quality: 80}, (error) => { 
            if(error){
                throw error
            }
        })
        fs.copyFile('./Public/Uploads/'+imgName+'.png', 'Public/Images/Homepage/'+selectImage+'.png', (error) => {
            if (error) {
                throw error
            } 
        fs.unlinkSync('./Public/Uploads/'+imgName+'.png')
        })
    }
    else {
        res.redirect(302, '/')
    }
}

async function uploadImage(req, res){
    if (req.role == "ROLE_ADMIN"){
        // Get the file that was set to our field named "image"
        const { image } = req.files;
        const { title } = req.body
        // If no image submitted, exit
        if (!image) {
            res.send("Ce n'est pas une image !");
        }
        else {
            // If does not have image mime type prevent from uploading
            if (!(/^image/.test(image.mimetype))) {
                res.send("Ce n'est pas un format acceptable !");
            }
            else {
                pool.query(`SELECT * FROM images WHERE name = '${image.name}'`, (error, results) => {
                    if (error){
                        throw error
                    }
                    else {
                        if (results.rows[0]){
                            res.send("Le nom est déjà utilisé ! Impossible d'avoir de doublon")
                        }
                        else {
                            // Move the uploaded image to our upload folder
                            image.mv('./Public/Uploads/' + image.name)
                            pool.query(`INSERT INTO images (name, title) VALUES ('${image.name}', '${title}')`, (error, results) => {
                                if (error){
                                    throw error
                                }
                                else {
                                    res.redirect(302, '/managesite')
                                }
                            })
                        }
                    }
                })
            }
        }
    }
    else {
        res.redirect(302, '/')
    }
}

async function deleteImage(req, res){
    if (req.role == "ROLE_ADMIN"){
        // If we send a post request for deleting an image
        const { name_image } = req.body
        pool.query(`DELETE FROM images WHERE name = '${name_image}'`, (error, results) => {
            if (error){
                throw error
            }
            else {
                // Delete the file from Uploads directory
                const filePath = './Public/Uploads/'+name_image; 
                fs.unlinkSync(filePath)
                res.redirect(302, '/managesite')
            }
        })
    }
    else {
        res.redirect(302, '/')
    }
}

async function redirectManageSite(req, res){
    if (req.role == "ROLE_ADMIN"){
        const userToken = req.cookies.userToken.token
        const id = req.email
        // We select into the database the preferences in link with the current user connected by checking the token
        pool.query(`SELECT preferences FROM users WHERE token = '${userToken}'`, (error, results) => {
            if (error){
                throw error
            }
            else {
                const modepreference = results.rows[0].preferences[0]
                pool.query(`SELECT * FROM images`, (error, results) => {
                    if (error){
                        throw error
                    }
                    else {
                        const imagesInDB = results.rows 
                        pool.query(`SELECT * FROM menus`, (error, results) => {
                            if (error){
                                throw error
                            }
                            else {
                                const menusInDB = results.rows
                                pool.query(`SELECT * FROM formules`, (error, results) => {
                                    if (error){
                                        throw error
                                    }
                                    else {
                                        const formulesInDB = results.rows
                                        pool.query(`SELECT * FROM openhours`, (error, results) => {
                                            if (error){
                                                throw error
                                            }
                                            else {
                                                const openhoursInDB = results.rows
                                                const templateVars = [ id, modepreference, imagesInDB, menusInDB, formulesInDB, openhoursInDB ]
                                                res.render('./Templates/AdminDashboard/managesite.html.twig', { templateVars })
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
    }
    else {
        res.redirect(302, "/")
    }
}


module.exports = { redirectDashboard, redirectShowUser, redirectLogs, redirectFormcontact, redirectManageSite, uploadImage, deleteImage, selectImage, addMenu, deleteMenu, addFormule, deleteFormule, addOpenHours, deleteOpenHours }