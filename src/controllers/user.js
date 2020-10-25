const {User: mUser} = require('../db/models')
const bcrypt = require('bcrypt')

class User {

    async login(req,res){
        try{
            const user = await mUser.findOne({where : {username : req.body.username}})
            if(!user) throw {message : 'Username or Password incorrect', status:400}
            const ada = await bcrypt.compare(req.body.password, user.password)
            if(!ada) throw {message : 'Username or Password incorrect', status:400}
            req.session.user = user
            res.json(user)
        }catch(e){
            res.status(e.status ? e.status : 500).send(e)
        }
    }

    async logout(req,res){
        try{
            await req.session.destroy()
            res.json({message : 'Logged out !'})
        }catch(e){
            res.status(500).send(e)
        }
    }

    async addOne(req,res){
        try{
            if(req.body.password && req.body.password==='') delete req.body.password
            const user = await mUser.create(req.body)
            res.json(user)
        }catch(e){
            res.status(500).send(e)
        }
    }

    async getOne(req,res){
        try{
            const user = await mUser.findOne({where : {id : req.params.id}})
            res.json(user)
        }catch(e){
            res.status(500).send(5)
        }
    }

    async getAll(req,res){
        try{
            const users = await mUser.findAll({where: {type: 'client'}})
            res.json(users)
        }catch(e){
            res.status(500).send(e)
        }
    }

    async updateOne(req,res){
        try{
            const user = await mUser.findOne({where: {id : req.body.user_id}})
            if(!user) throw {message : 'not found', status : 404}
            if(req.body.update.password && req.body.update.password!==''){
                req.body.update.password = await bcrypt.hash(req.body.update.password, 10)
            }
            for(const prop in req.body.update){
                user[prop] = req.body.update[prop]
            }
            await user.save()
            res.json({message : 'update success', user})
        }catch(e){
            res.status(e.status ? e.status : 500).send(e)
        }
    }

    async deleteOne(req,res){
        try{
            await mUser.destroy({where : {id : req.params.id}})
            res.json({message : 'user deleted'})
        }catch(e){
            res.status(500).send(e)
        }
    }

    async checkAuth(req,res){
        try{
            if(!req.session.user) throw {message : 'you are not logged in', status : 400}
            res.json(req.session.user)
        }catch(e){
            res.status(e.status ? e.status : 500).send(e)
        }
    }

}

module.exports = new User()