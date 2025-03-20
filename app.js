const express = require('express')
const app = express()

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config();

app.use(bodyParser.json()) 

//const filmsRoute = require('./routes/films')
const postsRoute = require('./routes/posts')
const authRoute = require('./routes/auth')

//app.use('/api/film', filmsRoute)
app.use('/api/posts', postsRoute)

app.use(bodyParser.json())  
app.use('/api/user', authRoute)

//trying
app.get('/', (req, res)=> {
    res.send('Homepage')
})

//EXURL = "mongodb+srv://mjafri:1234@cluster0.jb09b.mongodb.net/MiniFilms?retryWrites=true&w=majority&appName=Cluster0"
mongoose.connect(process.env.DB_CONNECTOR, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connection successful...');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });


app.listen(3000, ()=> {
    console.log('Server is running')
})