const express = require('express')
const cookieParser = require('cookie-parser')
const getRolesMiddleware = require("./Utils/getRolesMiddleware")
const twig = require('twig')
const bodyParser = require('body-parser')
const app = express()
const fileUpload = require('express-fileupload');

// IF USING NPM !
// const port = process.env.PORT
//IF USING NODEMON !
const port = 3000

//console.log(`Ready on ${process.env.NODE_ENV} mode`)
//console.log(`Port listening on ${process.env.PORT}`)

// routing initialization
const userRoute = require("./Routes/user")
const appRoute = require("./Routes/app")
const adminRoute = require("./Routes/dashboard")

app.use(express.json())
app.use(cookieParser())
app.use(getRolesMiddleware)
// set as view engine 
app.set('view engine', 'twig')
app.set('views', './Views')
app.engine('twig', twig.renderFile);

// used to parse form
app.use(bodyParser.urlencoded({ extended: false }));

// Setting up static directory
app.use(express.static('Public'));
app.use(
    fileUpload({
        limits: {
            fileSize: 10000000,
        },
        abortOnLimit: true,
    })
);

userRoute(app)
appRoute(app)
adminRoute(app)

app.listen(port, () => {
    console.log(`Dev app listening on port ${port}`)
})