const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const create = async (req, res) => {     
    const motorista = await prisma.motorista.createMany({
        data: req.body
    }).catch((err) => {
        console.log(err)
        return({})
    })

    res.status(200).json(motorista).end()
}

const readAll = async (req, res) => {
    const motoristas = await prisma.motorista.findMany({
        select: {
            id: true,
            cpf: true,
            cnh: true,
            nome: true,
            disponivel: true,
            operacoes: true
        }
    })

    res.status(200).json(motoristas).end()
}

const read = async (req, res) => {
    const motorista = await prisma.motorista.findFirst({
        where: {
            id: Number(req.params.id)
        },
        select: {
            id: true,
            cpf: true,
            cnh: true,
            nome: true,
            disponivel: true,
            operacoes: true
        }
    })

    res.status(200).json(motorista).end()
}

const update = async (req, res) => {
    req.body.id = Number(req.body.id)
    const motorista = await prisma.motorista.update({
        where: {
            id: req.body.id
        },
        data: req.body
    })
    console.log(motorista)
    res.status(200).json(motorista).end()
}

const remove = async (req, res) => {
    const motorista = await prisma.motorista.delete({
        where: {
            id: Number(req.body.id)
        }
    })

    res.status(200).json(motorista).end()
}

module.exports = {
    create,
    readAll,
    read,
    update,
    remove
}