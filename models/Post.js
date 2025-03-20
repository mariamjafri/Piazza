const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    title:{
        type:String, 
        required: true,
        max:100,
    },
    description:{
        type:String,
        required: true,
        max:500
    },
    likes:{
        type:Number,
        default:0,
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }

})

module.exports = mongoose.model('posts', postSchema)