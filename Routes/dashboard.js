const { redirectDashboard, redirectShowUser, redirectLogs, redirectFormcontact, redirectManageSite } = require("../Controllers/dashboard")

function adminRoute(app){

    // Dashboard and redirection
    app.get('/dashboard', redirectDashboard)

    app.post('/showuser', redirectShowUser)

    app.get('/logs', redirectLogs)

    app.get('/formcontact', redirectFormcontact)

    app.get('/managesite', redirectManageSite)
    app.post('/uploadImage', redirectManageSite)
    app.post('/deleteImage', redirectManageSite)
}

module.exports = adminRoute