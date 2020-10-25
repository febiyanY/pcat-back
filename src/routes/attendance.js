const {Router}  = require('express')
const router = Router()
const {isAuth, isAdmin, isInArea} = require('../middlewares/auth')
const cAttendance = require('../controllers/attendance')

router.post('/', isAuth, isInArea, cAttendance.attend.bind(cAttendance))
router.post('/setip', isAdmin, cAttendance.setAllowedIp)
router.get('/code', isAdmin, cAttendance.showCode)
router.get('/code/generate', isAdmin, cAttendance.generateCode)
router.get('/check', isAuth, cAttendance.checkAttendance.bind(cAttendance))
router.get('/perday', isAdmin, cAttendance.getAttendancesPerDay)

module.exports = router