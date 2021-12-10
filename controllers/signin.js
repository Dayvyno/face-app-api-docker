const jwt = require('jsonwebtoken');
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URI);


const handleSignIn = (req, res, db, bcrypt)=>{

  const {email, password} =req.body

  if (!email || !password){
    return Promise.reject("Incorrect Form Submission")
  }

  return db.select('email', 'hash').from('login')
    .where({email:email})
    .then(data=>{
      if (!data){
        res.status(400).json('Credential not in our database, please click Register to register')
      }
      const isValid= bcrypt.compareSync(password, data[0].hash); // true
      if (isValid){
        return db.select('*').from('users')
        .where({email:email})
        .then(user=>(user[0]))
        .catch(err=>Promise.reject(`Invalid Credentialsp: ${err}`))
      }else{
        return Promise.reject(`Invalid Credentials`)
      }
    })
    .catch(err=>Promise.reject(`Email or Password not correct: ${err}`))
}

const authToken =(req, res)=>{
  const {authorization} = req.headers;
  return client.get(authorization, (err, reply)=>{
    if (err || !reply){
      res.status(400).json("Wrong Authorization")
    } else {
      return res.json({id:reply})
    }
  })
}

const setToken =(key, value)=>{
  return Promise.resolve(client.set(key, value))
}

const  createSession =(data)=>{
  const {email, id} = data;
  const payload = {email:email}
  const token = jwt.sign(payload, 'JWT_SECRET', { expiresIn: '2 days' });
  return setToken(token, id)
  .then(()=>{
    return {success: 'true', id, token}
  })
  .catch(err=>console.log(`Unable to create session: ${err}`))
}


const handleAuthorization =(req, res, db, bcrypt)=>{
  const {authorization} = req.headers;
  return authorization? authToken(req, res) : 
  handleSignIn(req, res, db, bcrypt)
  .then(data=> {
    return data.id && data.email? createSession(data): Promise.reject("Unable to createSession")
  })
  .then(session=>{
    return res.json(session);
  })
  .catch(err=>res.status(400).json(`Failed to sigin: ${err}`))
}


module.exports = {
  handleAuthorization
}