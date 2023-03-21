const { redirectHomepage, redirectContact, sendFormContact, redirectInformation, redirectSettings, redirectMenu, redirectReservation, selectDayReservation, selectHourReservation, valideReservation } = require("../Controllers/app")

function appRoute(app){

    // Homepage application and redirection
    app.get('/', redirectHomepage)

    app.get('/contact', redirectContact)
    app.post('/contact', sendFormContact)

    // user settings redirection
    app.get('/information', redirectInformation)

    // Account settings are managed by the user controller
    app.get('/settings', redirectSettings)

    // Redirect to the menu page
    app.get('/menu', redirectMenu)

    // Redirect to the reservation page
    app.get('/reservation', redirectReservation)
    app.post('/selectDayReservation', selectDayReservation)
    app.post('/selectHourReservation', selectHourReservation)
    app.post('/valideReservation', valideReservation)
}

module.exports = appRoute