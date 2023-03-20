const { redirectDashboard, redirectShowUser, redirectLogs, redirectFormcontact, redirectManageSite, uploadImage, deleteImage, selectImage } = require("../Controllers/dashboard")

function adminRoute(app){

    // Dashboard and redirection
    app.get('/dashboard', redirectDashboard)

    app.post('/showuser', redirectShowUser)

    app.get('/logs', redirectLogs)

    app.get('/formcontact', redirectFormcontact)

    app.get('/managesite', redirectManageSite)
    app.post('/uploadImage', uploadImage)
    app.post('/deleteImage', deleteImage)

    app.post('/selectImage', selectImage)
}

module.exports = adminRoute