const bcrypt = require('bcrypt')
const { PrismaClient } = require('@prisma/client')
const jwt = require("jsonwebtoken")

const prisma = new PrismaClient()

const create = async (req, res) => {
    bcrypt.genSalt(10, function(err, salt) {
        if (err == null) {
          bcrypt.hash(req.body.senha, salt, async function(errCrypto, hash) {
            if(errCrypto == null){
                req.body.senha = hash
              
                const usuario = await prisma.usuario.create({
                    data: req.body
                })

                res.status(200).json(usuario).end()
            } else {
              res.status(500).json(errCrypto).end()
            }
          });
        } else {
          res.status(500).json(err).end()
        }
      })
}

const login = async(req, res) => {
    const usuario = await prisma.usuario.findFirstOrThrow({
      where: {
        email: req.body.email
      }
    }).then((value) => {return(value)})
    .catch((err) => {return {"erro": "Usuário não encontrado"}})

    bcrypt.compare(req.body.senha, usuario.senha).then((value) => {
      if (value) {
        let data = {"uid": usuario.id, "role": usuario.tipo}
        jwt.sign(data, process.env.KEY, {expiresIn: '30s'}, function(err2, token) {
          if(err2 == null){
            if (req.body.update === true) {
              next()
            }else{
              res.status(200).json({"token": token, "uid": result[0].id, "uname": result[0].nome, "validation": true}).end()
            }
          } else {
              res.status(404).json(err2).end()
          }
          
        })  
      } else {
        res.status(201).json({"validation": false}).end()
      }
    })

    res.status(200).json(usuario).end()
}

const readAll = async (req, res) => {
    
}

module.exports = {
    create,
    login,
    readAll
}