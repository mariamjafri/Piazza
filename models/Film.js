const mongoose = require('mongoose')

const filmSchema = mongoose.Schema({
    film_name:{
        type:String, 
        required: true
    },
    film_type:{
        type:String,
        required: true
    },
    film_year:{
        type:String,
        required: true
    },
    film_link:{
        type:String,
        required: true
    }

})

module.exports = mongoose.model('films', filmSchema)