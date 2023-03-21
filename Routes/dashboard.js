const { redirectDashboard, redirectShowUser, redirectLogs, redirectFormcontact, redirectManageSite, uploadImage, deleteImage, selectImage, addMenu, deleteMenu, addFormule, deleteFormule, addOpenHours, deleteOpenHours, redirectShowReservations, deleteReservation } = require("../Controllers/dashboard")

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
    app.post('/addMenu', addMenu)
    app.post('/deleteMenu', deleteMenu)
    app.post('/addFormule', addFormule)
    app.post('/deleteFormule', deleteFormule)
    app.post('/addOpenHours', addOpenHours)
    app.post('/deleteOpenHours', deleteOpenHours)

    app.get('/showReservations', redirectShowReservations)
    app.post('/deleteReservation', deleteReservation)

}

module.exports = adminRoute