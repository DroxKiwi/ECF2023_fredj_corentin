const pool = require('../Utils/db');
var fs = require('fs');

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

async function redirectManageSite(req, res){
    if (req.role == "ROLE_ADMIN"){
        const userToken = req.cookies.userToken.token
        const id = req.email
        const { uploadImage, deleteImage } = req.body
        // If we send a request for uploading an image
        if (uploadImage == "true"){
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
                            console.log(results.rows[0])
                            if (results.rows[0]){
                                res.send("Le nom est déjà utilisé ! Impossible d'avoir de doublon")
                            }
                            else {
                                // Move the uploaded image to our upload folder
                                image.mv('./Public/Uploads/' + image.name);
                                pool.query(`INSERT INTO images (name, title) VALUES ('${image.name}', '${title}')`, (error, results) => {
                                    if (error){
                                        throw error
                                    }
                                    else {
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
                                                        const templateVars = [ id, modepreference, imagesInDB ]
                                                        res.render('./Templates/AdminDashboard/managesite.html.twig', { templateVars })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        }
                    })
                }
            }
        }
        // If we send a post request for deleting an image
        else if (deleteImage == "true"){
            const { name_image } = req.body
            pool.query(`DELETE FROM images WHERE name = '${name_image}'`, (error, results) => {
                if (error){
                    throw error
                }
                else {
                    // Delete the file from Uploads directory
                    const filePath = './Public/Uploads/'+name_image; 
                    fs.unlinkSync(filePath);
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
                                    const templateVars = [ id, modepreference, imagesInDB ]
                                    res.render('./Templates/AdminDashboard/managesite.html.twig', { templateVars })
                                }
                            })
                        }
                    })
                }
            })
        }
        else {
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
                            const templateVars = [ id, modepreference, imagesInDB ]
                            res.render('./Templates/AdminDashboard/managesite.html.twig', { templateVars })
                        }
                    })
                }
            })
        }
    }
    else {
        res.redirect(302, "/")
    }
}


module.exports = { redirectDashboard, redirectShowUser, redirectLogs, redirectFormcontact, redirectManageSite }