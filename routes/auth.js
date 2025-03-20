const express = require('express')
const router = express.Router()
require('dotenv').config();


const User = require('../models/User')
const {registerValidation,loginValidation} = require('../validations/validation')

const bcryptjs = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')
const { json } = require('body-parser')

router.post('/register', async(req,res)=> {

    //Validation 1 to check user input
    const {error} = registerValidation(req.body)
    if(error) {
        return res.status(400).send({message:error['details'][0]['message']})
    }
    //Validation 2 to check if email already exisits
    const userExists = await User.findOne({email:req.body.email})
    if (userExists) {
        return res.status(400).send({message:'User already exisits'})
    }

    //encrypt password
    const salt = await bcryptjs.genSalt(5)
    const hashedPassword = await bcryptjs.hash(req.body.password, salt)

    //code to insert data
    const user = new User({
        name:req.body.name,
        email:req.body.email,
        password:hashedPassword
    })
    try{
        const savedUser = await user.save()
        res.send(savedUser)
    }catch(err) {
        res.status(400).send({message:err})
    }
})
router.post('/login', async(req,res)=> {
    //Validate the user input
    const {error} = loginValidation(req.body)
    if(error) {
        return res.status(400).send({message:error['details'][0]['message']})
    }

    
    //Validation 2 to check if user exists
    const user = await User.findOne({email:req.body.email})
    if (!user) {
        return res.status(400).send({message:'User does not exisit'})
    }

    //Check if password is correct
    const passwordValidation = await bcryptjs.compare(req.body.password,user.password)
    if (!passwordValidation) {
        return res.status(400).send({message:'Password does not match'})
    }
    //Generate authentication token
    const token = jsonwebtoken.sign({_id:user._id}, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send({'auth-token':token})

})

module.exports = router