const router = require('express').Router();
const bcrypt=require('bcryptjs')
const jwt = require('jsonwebtoken')

const Users = require("../users/users-model")
const { isValid } = require("../users/users-service")

const {jwtSecret } = require('./secrets')

router.post('/register', (req, res) => {
  const credentials =req.body
  if(isValid(credentials)) {
    const rounds = process.env.BCRYPT_ROUNDS ||8
    const hash = bcrypt.hashSync(credentials.password, rounds)
    credentials.password = hash

    Users.add(credentials)
    .then(user => {
      res.status(201).json({data: user})
    })
    .catch(error => {
      res.status(500).json({message: error.message})
    })
  } else {
    res.status(400).json({
      message: "please provide username and password"
    })
  }
});

router.post('/login', (req, res) => {
  const { username, password } = req.body

  if(isValid(req.body)) {
    Users.findBy({username: username})
      .then(([user])=>{
        if (user && bcrypt.compareSync(password, user.password)){
          const token = makeToken(user)
          res.status(200).json({ message: "Wilkomen meinen damen und heren!", token })
        } else {
          res.status(401).json({ message: "you got no cred"})
        }
      })
      .catch(err =>{
        res.status(500).json({message: error.message })
      })
  }else {
    res.status(400).json({ message: 'provide user/pass'})
  }
});

function makeToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  }
  const options={
    expiresIn: '120 seconds'
  }
  return jwt.sign(payload, jwtSecret, options)
}


module.exports = router;
