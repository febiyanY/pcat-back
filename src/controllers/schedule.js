const {User: mUser, Day: mDay, Schedule: mSchedule, sequelize: db, Sequelize} = require('../db/models/index')

class Schedule {
    
    async getSchedulePerDay(req,res){
        try{
            const schedule = await mDay.findOne({where: {id: req.params.day_id}, include : [
                {model : mUser, as : 'schedule', attributes : ['id','name']}
            ]})
            res.json(schedule)
        }catch(e){
            res.status(500).send(e)
        }
    }

    async addUser(req,res){
        try{
            const ada = await mSchedule.findOne({where : {user_id: req.body.user_id, day_id: req.body.day_id}})
            if(ada) throw {message : 'Udah dimasukkin ke jadwal', status: 400}
            db.query('insert into "Schedules" values (?,?)', {
                replacements: [req.body.day_id, req.body.user_id],
                type: Sequelize.QueryTypes.INSERT
            })
            res.json({message : 'user successfully added to schedule'})
        }catch(e){
            res.status(500).send(e)
        }
    }

    async removeUser(req,res){
        try{
            const ada = await mSchedule.findOne({where : {user_id: req.params.user_id, day_id: req.params.day_id}})
            if(!ada) throw {message : 'user is not available in the schedule', status: 404}
            await mSchedule.destroy({where : {user_id: req.params.user_id, day_id: req.params.day_id}})
            res.json({message : 'user successfully removed from the schedule'})
        }catch(e){
            res.status(500).send(e)
        }
    }

    async loadAvailableUser(req,res){
        try{
            // const users = await mUser.findAll({include: [
            //     {model : mDay, as : 'schedule', attributes: ['id'], where : {id : {[Sequelize.Op.ne] : req.params.day_id}}}
            // ], attributes: ['id','username']})

            const day = await mDay.findOne({where : {id : req.params.day_id}, include : [
                {model : mUser, as: 'schedule', attributes: ['id','username']}
            ]})
            const userIds = day.schedule.map(user => user.id)
            const availableUser = await mUser.findAll({where : {id : {
                [Sequelize.Op.notIn] : userIds
            }, type: 'client'}})
            

            res.json(availableUser)
        }catch(e){
            res.status(e.status ? e.status : 500).send(e)
        }
    }

    async searchUser(req,res){
        try{
            const day = await mDay.findOne({where : {id : req.params.day_id}, include : [
                {model : mUser, as: 'schedule', attributes: ['id','username']}
            ]})
            const userIds = day.schedule.map(user => user.id)
            const availableUser = await mUser.findAll({where : {id : {
                [Sequelize.Op.notIn] : userIds
            }, type: 'client', name: {
                [Sequelize.Op.substring] : req.query.key
            }}})
            
            res.json(availableUser)
        }catch(e){
            res.status(e.status ? e.status : 500).send(e)
        }
    }

}

module.exports = new Schedule()