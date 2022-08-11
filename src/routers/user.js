const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()
const multer = require('multer')
const sharp = require('sharp')
const {sendWelcomeEmail,sendCancelationEmail} = require('../emails/account')

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
}) 

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

// router.get('/users/me', auth, async (req, res) => {
//     res.send(req.user)
// })

// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id

//     try {
//         const user = await User.findById(_id)

//         if (!user) {
//             return res.status(404).send()
//         }

//         res.send(user)
//     } catch (e) {
//         res.status(500).send()
//     }
// })

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        //const user = await User.findById(req.params.id)

        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        // if (!user) {
        //     return res.status(404).send()
        // }

        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id)

        // if (!user) {
        //     return res.status(404).send()
        // }
        await req.user.remove()
        sendCancelationEmail(user.email,user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})


const { application } = require('express')

const upload = multer({
    //dest: 'avatar',
    limits:{
        fileSize:1000000
    },
    fileFilter(res, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image!'))
        }
        cb(undefined, true)
    }
})

const errorMiddleware = (req, res, next) => {
    throw new Error('Please upload an image')
}

router.post('/users/me/avatar', auth, upload.single('avatar'),async (req,res)=>{
    
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer() //convert all img to png and resize it to a particular size
    req.user.avatar = buffer//store the data in buffer instead of storing in our local machine
    await req.user.save()
    res.send()
},(error, req, res, next)=>{
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth, async (req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
},(error, req, res, next)=>{
    res.status(400).send({error: error.message})
})

router.get('users/:id/avatar', async (req,res)=>{
    try{
        const user = await User.findById(req.params.id)

        if(!user||!user.avatar){
            throw new Error()
        }

        res.set('Content-Type', 'image/png') //responds header
        res.send(user.avatar)
    }catch(e){

    }
})

module.exports = router