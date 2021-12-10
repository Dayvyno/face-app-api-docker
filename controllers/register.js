const handleRegister = (req, res, db, bcrypt)=>{
  const {email, name, password} = req.body

  if (!email || !name || !password){
    return res.status(400).json("Incorrect Form Submission")
  }

  var hash = bcrypt.hashSync(password);
  db.transaction(trx=>{
    return trx('login')
    .insert({
      hash: hash,
      email: email
    })
    .returning('email')
    .then(loginEmail=>{
      return trx('users')
      .insert({
        email:loginEmail[0],
        name:name,
        joined: new Date()
      })
      .returning('*')
      .then(user=>{
        return res.json(user[0]) 
      })
    })
    .then(trx.commit)
    .catch(trx.rollback)
  })
  .catch(err=>res.status(400).json("Unable to register"))
}

module.exports = {handleRegister}