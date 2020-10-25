const {Router} = require('express')
const router = Router()
const {isAdmin} = require('../middlewares/auth')
const cUser = require('../controllers/user')

router.post('/', isAdmin, cUser.addOne)

router.patch('/', isAdmin, cUser.updateOne)
router.delete('/:id', isAdmin, cUser.deleteOne)
router.get('/check/auth', cUser.checkAuth)
router.get('/:id', isAdmin, cUser.getOne)
router.get('/', isAdmin, cUser.getAll)

module.exports = router