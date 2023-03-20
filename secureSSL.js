const express = require('express')
const cookieParser = require('cookie-parser')
const getRolesMiddleware = require("./Utils/getRolesMiddleware")
const twig = require('twig')
const bodyParser = require('body-parser')
const fs = require("fs") //file system module
const https = require("https") // https module to create a ssl enabled server
const path = require("path") // path module 
const app = express()

// IF USING NPM !
const port = process.env.PORT
//IF USING NODEMON !
// const port = 3000

console.log(`Ready on ${process.env.NODE_ENV} mode`)
console.log(`Port listening on ${process.env.PORT} mode`)

// SSL certificate implementation

const options ={
      key:fs.readFileSync(path.join(__dirname,'./certs/key.pem')),
      cert:fs.readFileSync(path.join(__dirname,'./certs/cert.pem'))
}
const sslserver = https.createServer(options,app)


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

userRoute(app)
appRoute(app)
adminRoute(app)

sslserver.listen(port, () => {
    console.log(`Secure server listening on port ${port}`)
})