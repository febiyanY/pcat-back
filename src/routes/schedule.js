const {Router} = require('express')
const router = Router()
const {isAdmin} = require('../middlewares/auth')
const cSchedule = require('../controllers/schedule')

router.post('/', isAdmin, cSchedule.addUser)
router.delete('/:user_id/:day_id', isAdmin, cSchedule.removeUser)
router.get('/user/search/:day_id', isAdmin, cSchedule.searchUser)
router.get('/user/:day_id', isAdmin, cSchedule.loadAvailableUser)
router.get('/:day_id', isAdmin, cSchedule.getSchedulePerDay)


module.exports = router