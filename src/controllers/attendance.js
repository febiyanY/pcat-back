const {User: mUser, Day: mDay, Attendance: mAttendance, Schedule: mSchedule, Sequelize, sequelize: db} = require('../db/models/index')
const {v4: uuidv4} = require('uuid')
var attendCode = uuidv4()
var allowedIp = '#%$%$%'

class Attendance {

    async setAllowedIp(req,res){
        try{
            let ipAddress = req.body.ip.split('.')
            allowedIp= ipAddress[0]+'.'+ipAddress[1]
            res.json({message: 'allowed prefix ' +allowedIp})
        }catch(e){
            res.status(500).send(e)
        }
    }

    async attend(req,res){
        try{
            if(attendCode!==req.body.attendCode) throw {message : 'Code is incorrect', status : 400}
            const today = new Date()
            const isInTodaySchedule = await mSchedule.findOne({where : {user_id: req.session.user.id, day_id: today.getDay()}})
            if(!isInTodaySchedule) throw {message : 'you are not in todays schedule', status: 400}
            const didIAttend = await this.isAlreadyAttend(req.session.user.id, `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`)
            if(didIAttend) throw {message : 'udah absen', status: 400}
            await mAttendance.create({
                time: new Date(),
                user_id: req.session.user.id,
                day_id: today.getDay()
            })
            attendCode = uuidv4()
            res.json({message : 'success'})

            // res.json({tanggal : `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`})
        }catch(e){
            res.status(e.status ? e.status : 500).send(e)
        }
    }

    async showCode(req,res){
        try{
            res.json({attendCode})
        }catch(e){
            res.status(500).send(e)
        }
    }

    async generateCode(req,res){
        attendCode = uuidv4()
        res.json({message: 'success'})
    }

    async isAlreadyAttend(user_id, date){
        try{
            // const attendances = await db.query(`
            // select * from "Attendances" 
            // where user_id=${user_id}
            // and time >= '${date}'::date 
            // and time <= ('${date}'::date + '1 day'::interval)
            // `
            // ,{
            //     type : Sequelize.QueryTypes.SELECT
            // })
            
            // if(attendances.length==0){
            //     return false
            // }else{
            //     return true
            // }

            const attendance = await mAttendance.findOne({where : {user_id: user_id, time: {
                [Sequelize.Op.between] : [new Date(`${date} 00:00:00`), new Date(`${date} 23:59:59`)]
            }}})
            
            if(!attendance) return false
            return true
            

        }catch(e){
            return e
            // res.status(500).send(e)
        }
    }

    async checkAttendance(req,res){
        try{
            let clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress
            if (clientIp.substr(0, 7) == "::ffff:") clientIp = clientIp.substr(7)
            console.log({clientIp, allowedIp})
            if(!clientIp.includes(allowedIp) && clientIp!=='::1') throw {message : 'Unauthorized', status : 401}
            const today= new Date()
            const isInTodaySchedule = await mSchedule.findOne({where : {user_id: req.session.user.id, day_id: today.getDay()}})
            if(!isInTodaySchedule) throw {message : 'you are not in todays schedule', status: 400}
            const didIAttend = await this.isAlreadyAttend(req.session.user.id, `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`)
            if(didIAttend) throw {message : 'udah absen', status: 400}
            res.json({message : 'belom absen', status:200})
        }catch(e){
            res.status(e.status ? e.status : 500).send(e)
        }
    }

    async getAttendancesPerDay(req,res){
        try{
            // const attendance = await db.query(`
            //     select sch.user_id, users.username as username, att.time
            //     from "Schedules" as sch 
            //     inner join "Days" as day ON sch.day_id = day.id
            //     inner join "Users" as users ON sch.user_id = users.id
            //     left join "Attendances" as att ON sch.user_id = att.user_id
            //     where sch.day_id=3 
            //     and att.time >= '2020-10-21'::date 
            //     and att.time <= ('2020-10-21'::date + '1 day'::interval)
            //     order by sch.day_id asc
            // `,{
            //     type : Sequelize.QueryTypes.SELECT
            // })
            // res.json(attendance)

            // date format = year-month-date
            if(!req.query.date) throw {message : 'request invalid',status : 400}
            const date = new Date(req.query.date)
            const attendance = await mDay.findOne({where: {id: date.getDay()}, include : [
                {model : mUser, as : 'schedule', attributes : ['id','name'], include : [
                    {
                        model : mAttendance, 
                        attributes: ['time'],
                        where : {time: {
                            [Sequelize.Op.between] : [new Date(`${req.query.date} 00:00:00`), new Date(`${req.query.date} 23:59:59`)]
                        }}, required : false
                    }
                ]}
            ]})
            res.json(attendance)
        }catch(e){
            res.status(e.status ? e.status : 500).send(e)
        }
    }

}

module.exports = new Attendance()