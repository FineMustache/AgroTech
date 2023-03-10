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
    .catch((err) => {return {"erro": "Usuário não encontrado", "validation": false}})

    if (usuario.erro == null) {
      bcrypt.compare(req.body.senha, usuario.senha).then((value) => {
        if (value) {
          let data = {"uid": usuario.id, "role": usuario.tipo}
          jwt.sign(data, process.env.KEY, {expiresIn: '2  h'}, function(err2, token) {
            if(err2 == null){
  
                res.status(200).json({"token": token, "uid": usuario.id, "uname": usuario.nome, "tipo": usuario.tipo, "validation": true}).end()
            } else {
                res.status(500).json(err2).end()
            }
            
          })  
        } else {
          res.status(201).json({"erro": "Senha inválida", "validation": false}).end()
        }
      })
    } else {
      res.status(404).json(usuario).end()
    }

    
}

const readAll = async (req, res) => {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true
      }
    })

    res.status(200).json(usuarios).end()
}

module.exports = {
    create,
    login,
    readAll
}