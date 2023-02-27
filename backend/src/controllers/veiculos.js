const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const create = async (req, res) => {     
    const veiculo = await prisma.veiculo.createMany({
        data: req.body
    }).catch((err) => {
        console.log(err)
        return({})
    })

    res.status(200).json(veiculo).end()
}

const readAll = async (req, res) => {
    const veiculos = await prisma.veiculo.findMany({
        select: {
            id: true,
            placa: true,
            modelo: true,
            marca: true,
            tipo: true,
            disponivel: true,
            operacoes: true,
            manutencoes: true,
        }
    })

    res.status(200).json(veiculos).end()
}

const read = async (req, res) => {
    const veiculo = await prisma.veiculo.findFirst({
        where: {
            id: Number(req.params.id)
        },
        select: {
            id: true,
            placa: true,
            modelo: true,
            marca: true,
            tipo: true,
            disponivel: true,
            operacoes: true,
            manutencoes: true,
        }
    })

    res.status(200).json(veiculo).end()
}

const update = async (req, res) => {
    req.body.id = Number(req.body.id)
    const veiculo = await prisma.veiculo.update({
        where: {
            id: req.body.id
        },
        data: req.body
    })

    res.status(200).json(veiculo).end()
}

const remove = async (req, res) => {
    const veiculo = await prisma.veiculo.delete({
        where: {
            id: Number(req.body.id)
        }
    })

    res.status(200).json(veiculo).end()
}

module.exports = {
    create,
    readAll,
    read,
    update,
    remove
}