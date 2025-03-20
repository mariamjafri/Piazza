const express = require('express')
const router = express.Router()
require('dotenv').config();

const Post = require('../models/Post')
const User = require('../models/User')

const jsonwebtoken = require('jsonwebtoken')
const { json } = require('body-parser')
const verifyToken = require('../verifyToken')

//require authentication
router.post('/', verifyToken, async(req,res)=> {

    //code to insert data
    const postData = new Post ({
        title:req.body.title,
        description:req.body.description,
        likes:req.body.likes,
        createdBy:req.body.createdBy
    })
    try {
        const postToSave = await postData.save()
        res.send(postToSave)
    }
    catch(err) {
        res.send({message:err})
    }
})

//publicly available posts GET ALL
router.get('/', async(req,res)=> {
    try{
        const getPosts = await Post.find()
        res.send(getPosts)
    }
    catch(err){
        res.send({message:err})
    }
})

//GET SPECIFIC
router.get('/:id', async(req,res)=> {
    try{
        const getPost = await Post.findById(req.params.id)
        res.send(getPost)
    }
    catch(err){
        res.send({message:err})
    }
})

//update post - only the post creator can update
//PATCH
router.put('/:id', verifyToken, async(req, res)=>{

    const postData = new Post ({
        title:req.body.title,
        description:req.body.description,
        likes:req.body.likes,
        createdBy:req.body.createdBy
    })

    //validating the post creator
    try {
        const post = await Post.findById(req.params.id);
        if (post.createdBy.toString() !=req.user._id) {
            return res.status(400).send({message:'Cannot modify post'})
        }
    }
    catch(err) {
        res.send({message:err})
    }

    try{
        const updatePost = await Post.updateOne (
            {_id:req.params.id},
            {$set:{
                title:req.body.title,
                description:req.body.description,
                likes:req.body.likes,
                createdBy:req.body.createdBy
                }
            })
            res.send(updatePost)
    }
    catch(err){
        res.send({message:err})
    }
})

//DELETE BY ID only if the creator
router.delete('/:id', verifyToken, async(req, res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if (post.createdBy.toString() !=req.user._id) {
            return res.status(400).send({message:'Cannot modify post'})
        }
    }
    catch(err) {
        res.send({message:err})
    }
    
    try {
        const deletePost = await Post.deleteOne(
            {_id:req.params.id}
        )
        res.send(deletePost)
    }
    catch(err){
        res.send({message:err})
    }
})

module.exports = router