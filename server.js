const express = require('express')
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require('knex');
const register = require('./controllers/register.js');
const signIn = require('./controllers/signin.js');
const profile = require('./controllers/profile.js');
const imageApi =  require('./controllers/image.js');
const auth = require('./controllers/authorization')
const dotenv = require('dotenv');
dotenv.config();

const app = express()
app.use(cors())

// const isProduction = process.env.NODE_ENV === "production";
const connectionString = process.env.POSTGRES_URI
const db= knex({
  client: 'pg',
  connection: connectionString
});

app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.get("/", (req, res)=>{
  res.send('App has been confirmed working')
})

app.post("/signin", (req, res)=>signIn.handleAuthorization(req, res, db, bcrypt));
app.post('/register', (req, res) =>register.handleRegister(req, res, db, bcrypt));
app.get('/profile/:id', auth.requireAuth, (req, res)=>profile.profileHandler(req, res, db));
app.post('/profile/:id', auth.requireAuth, (req, res)=>profile.handleProfileUpdate(req, res, db));
app.put('/image', auth.requireAuth, (req, res)=>imageApi.imageHandler(req, res, db));
app.post('/imageUrl', auth.requireAuth, (req, res)=>imageApi.handleApiCall(req, res));

app.listen(process.env.PORT || 2000, ()=>console.log(`app is running on port ${process.env.PORT}`))