const express = require('express')
const router = express.Router()

const Usuario = require('./controllers/usuarios')

router.post('/agrotech/usuarios', Usuario.create)
router.post('/agrotech/login', Usuario.login)

module.exports = router