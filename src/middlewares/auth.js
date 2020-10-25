const isAuth = (req, res, next) => {
    try {
        if (!req.session.user) throw { message: 'Unauthorized', status: 401 }
        next()
    } catch (e) {
        res.status(e.status ? e.status : 500).send(e)
    }
}
const isAdmin = (req, res, next) => {
    try {
        if (!req.session.user) throw { message: 'Unauthorized', status: 401 }
        if (req.session.user.type !== 'admin') throw { message: 'Unauthorized', status: 401 }
        next()
    } catch (e) {
        res.status(e.status ? e.status : 500).send(e)
    }
}

const isInArea = (req, res, next) => {
    try {
        // let clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        // if (clientIp.substr(0, 7) == "::ffff:") clientIp = clientIp.substr(7)
        // console.log({ clientIp })
        next()
    } catch (e) {
        res.status(e.status ? e.status : 500)
    }
}

module.exports = { isAuth, isAdmin, isInArea }