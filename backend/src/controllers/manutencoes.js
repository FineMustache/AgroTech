const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const create = async (req, res) => {     
    const manutencao = await prisma.manutencao.createMany({
        data: req.body
    }).catch((err) => {
        console.log(err)
        return({})
    })

    res.status(200).json(manutencao).end()
}

const readAll = async (req, res) => {
    const manutencoes = await prisma.manutencao.findMany()

    res.status(200).json(manutencoes).end()
}

const read = async (req, res) => {
    const manutencao = await prisma.manutencao.findFirst({
        where: {
            id: Number(req.params.id)
        }
    })

    res.status(200).json(manutencao).end()
}

const update = async (req, res) => {
    req.body.id = Number(req.body.id)
    const manutencao = await prisma.manutencao.update({
        where: {
            id: req.body.id
        },
        data: req.body
    })

    res.status(200).json(manutencao).end()
}

const remove = async (req, res) => {
    const manutencao = await prisma.manutencao.delete({
        where: {
            id: Number(req.body.id)
        }
    })

    res.status(200).json(manutencao).end()
}

module.exports = {
    create,
    readAll,
    read,
    update,
    remove
}