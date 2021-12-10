const profileHandler = (req, res, db)=>{
  const {id} = req.params;
  db.select('*').from('users').where({
    id:id
  }).then(user=>{
    if (user.length){
      res.json(user[0])
    } else{
      res.status(400).json("Does Not Exist")
    }
  }).catch(err=>res.status(400).json("Error Getting User"))
}

const handleProfileUpdate =(req, res, db)=>{
  const {id} = req.params
  const {name, age, pet} = req.body;
  db('users').where({id}).update({name:name, age:age, pet:pet})
  .then(user=>{
    if(user){
      return res.json("success")
    }
  })
  .catch(err=>res.status(400).json(`User profile not available: ${err}`))
}

module.exports = {
  profileHandler,
  handleProfileUpdate
}