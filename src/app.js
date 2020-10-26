const express = require('express')
const path = require('path')
const http = require('http')
const cors = require('cors')
const session = require('express-session')
const connect_session_sequelize = require('connect-session-sequelize')
const {sequelize: db} = require('./db/models/index')

const app = express()
const publicPath = path.join(__dirname, '../public')
const SequelizeStore = connect_session_sequelize(session.Store)
const sessionStore = new SequelizeStore({db: db})
const sessConfig = {
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    },
    store: sessionStore
}
const corsConfig = {
    origin: process.env.CORS_ORIGIN,
    credentials: true
}

if(app.get('env')==='production'){
    app.set('trust proxy', 1) // trust first proxy
    sessConfig.cookie.secure = true // serve secure cookie
    sessConfig.cookie.sameSite = "none" // for access 3rd party cookies
}

const rAuth = require('./routes/auth')
const rUser = require('./routes/user')
const rSchedule = require('./routes/schedule')
const rAttendance = require('./routes/attendance')

app.use(express.static(publicPath))
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(session(sessConfig))
app.use(cors(corsConfig))
sessionStore.sync()


app.use('/user', rUser)
app.use('/schedule', rSchedule)
app.use('/attendance', rAttendance)

const cUser = require('./controllers/user')
const {isAuth} = require('./middlewares/auth')
app.post('/login', cUser.login)
app.get('/logout', isAuth, cUser.logout)
app.all('*', (req,res) => res.status(404).send({message: 'Not Found'}))

const server = http.createServer(app)

// Socket IO
const io = require('socket.io')(server)
const qrcodeSocket = io.of('/qrcode')
const qrcodeEvents = require('./sockets/qrcode')
// socket io configuration
qrcodeSocket.on('connection', (socket) => {
    qrcodeEvents(socket, io)
})

module.exports = {app, server}