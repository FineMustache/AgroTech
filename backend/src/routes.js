const express = require('express')
const router = express.Router()

const Usuario = require('./controllers/usuarios')
const Motorista = require('./controllers/motoristas')
const Veiculo = require('./controllers/veiculos')
const Manutencao = require('./controllers/manutencoes')
const Operacao = require('./controllers/operacoes')
const Middleware = require('./middleware/validation')

//USUARIOS
router.post('/agrotech/usuarios', Usuario.create)
router.post('/agrotech/login', Usuario.login)
router.get('/agrotech/usuarios', Usuario.readAll)
router.post('/agrotech/validate', Middleware.permitir)

//MOTORISTAS
router.post('/agrotech/motoristas', Motorista.create)
router.get('/agrotech/motoristas', Motorista.readAll)
router.get('/agrotech/motoristas/:id', Motorista.read)
router.put('/agrotech/motoristas', Motorista.update)
router.delete('/agrotech/motoristas', Motorista.remove)

//VEICULOS
router.post('/agrotech/veiculos', Veiculo.create)
router.get('/agrotech/veiculos', Veiculo.readAll)
router.get('/agrotech/veiculos/:id', Veiculo.read)
router.put('/agrotech/veiculos', Veiculo.update)
router.delete('/agrotech/veiculos', Veiculo.remove)

//MANUTENÇÕES
router.post('/agrotech/manutencoes', Manutencao.create)
router.get('/agrotech/manutencoes', Manutencao.readAll)
router.get('/agrotech/manutencoes/:id', Manutencao.read)
router.put('/agrotech/manutencoes', Manutencao.update)
router.delete('/agrotech/manutencoes', Manutencao.remove)
router.put('/agrotech/manutencoes/finalizar', Manutencao.finish)

//OPERAÇÕES
router.post('/agrotech/operacoes', Operacao.create)
router.get('/agrotech/operacoes', Operacao.readAll)
router.get('/agrotech/operacoes/:id', Operacao.read)
router.put('/agrotech/operacoes', Operacao.update)
router.delete('/agrotech/operacoes', Operacao.remove)
router.put('/agrotech/operacoes/finalizar', Operacao.finish)

module.exports = router