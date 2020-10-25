const {Router}  = require('express')
const router = Router()
const {isAuth} = require('../middlewares/auth')
const cUser = require('../controllers/user')

router.post('/login', cUser.login)
router.get('/logout', isAuth, cUser.logout)

module.exports = router