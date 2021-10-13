const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const User = require('./model/user')
const bcrypt = require('bcryptjs')
const { response } = require('express')
require('dotenv').config();
const jwt = require('jsonwebtoken')
const JWT_SECRET = 'wswpjsidhjnbuyabdsiaeyeytrjd$%^H^&bkaddssrdrthbbnm'


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=> {
  console.log("DB Connected")
}).catch((err) =>{
  console.log(err)
})



const app = express()
app.use('/', express.static(path.join(__dirname, 'static')))
app.use('/', express.static(path.join(__dirname, 'css')))
app.use(express.json())



app.post('/api/login', async (req,res) => {

  const {username, password } = req.body
  const user = await User.findOne({ username }).lean()
  if(!user){   

    return res.json({status: 'error', error:'Invalid username/password'})
  }

  if(await bcrypt.compare(password, user.password)){

       //this token is visible publicly, do not store credit card
    const token = jwt.sign({ 
      id: user._id, 
      username: user.username
    }, JWT_SECRET
    )
    return res.json({status: 'ok', data: token})
  }

  res.json({status: 'error', error:'username/password'})
})



app.post('/api/register', async (req,res) => {
  // console.log(req.body)
  const { username, password:plainTextPassword, email, branch, year} = req.body

  if(!username || typeof username !== 'string'){
    return res.json({ status:'error', error: 'Invalid uname'})
  }

  // password validation
  if(!plainTextPassword || typeof plainTextPassword !== 'string'){
    return res.json({ status:'error', error: 'Invalid pass'})
  }

  if(checkEmail(email)==false){
    return res.json({ status:'error', error: 'Email format invalid, must be of the "@siesgst.ac.in" format'})
  }


  if(checkPassword(plainTextPassword)==false){
    return res.json({ status:'error', error: 'Password must be in Regex fromat'})
  }

 

  //bcrypt
  const password = await bcrypt.hash(plainTextPassword, 4)

  try{
      const response = await User.create({
        username,
        password,
        email,
        branch,
        year
      })
      console.log('User created',response)
  } catch(error){
    if (error.code === 11000){
      return res.json({status: 'error', error: 'Username already exists'})
    }
    throw error
  }

  res.json({status: 'ok'})
})


function checkPassword(pass)
{
    var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    return re.test(pass);
}

function checkEmail(email){
  // var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(siesgst.ac.in)$/;
  return validRegex.test(email)
}



app.listen(9900, ()=>{
  console.log('Server up at 9900')
})