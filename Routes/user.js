const { usersGet, userCreate, resetPassword, userUpdate, userDelete, settingsPreferences, userLogin, userLogout } = require("../Controllers/user")

function userRoute(app){
    // User CRUD routing

    // Create
    app.post("/userCreate", userCreate)
    app.get("/userCreate", userCreate)

    // Read
    app.get("/usersGet", usersGet)
    // userGet post request exist to request a research into the dashboard
    app.post("/usersGet", usersGet)

    
    // Reset the user password with one randomly generated
    app.post("/resetpassworduser", resetPassword)

    // Update
    app.post("/userUpdate", userUpdate)

    // Delete
    app.post("/userDelete", userDelete)

    // Set preferences 
    app.post('/settingsPreferences', settingsPreferences)

    // Login
    app.get("/userLogin", userLogin)
    app.post("/userLogin", userLogin)
    
    // Logout
    app.get("/userLogout", userLogout)
}

module.exports = userRoute