const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const create = async (req, res) => {
    
    req.body.forEach(async m => {
        let veic = await prisma.veiculo.update({
            where: {
                id: m.id_veiculo
            },
            data: {
                disponivel: false
            }
        })

        console.log(veic)
    })

    const manutencao = await prisma.manutencao.createMany({
        data: req.body
    }).catch((err) => {
        console.log(err)
        return({})
    })

    res.status(200).json(manutencao).end()
}

const readAll = async (req, res) => {
    const manutencoes = await prisma.manutencao.findMany({
        select:{
            id: true,
            data_inicio: true,
            data_fim: true,
            valor: true,
            descricao: true,
            veiculo: true
        }
    })

    res.status(200).json(manutencoes).end()
}

const read = async (req, res) => {
    const manutencao = await prisma.manutencao.findFirst({
        where: {
            id: Number(req.params.id)
        },
        select:{
            id: true,
            data_inicio: true,
            data_fim: true,
            valor: true,
            descricao: true,
            veiculo: true
        }
    })

    res.status(200).json(manutencao).end()
}

const update = async (req, res) => {
    req.body.id = Number(req.body.id)
    req.body.valor = Number(req.body.valor)
    req.body.id_veiculo = Number(req.body.id_veiculo)
    const manutencao = await prisma.manutencao.update({
        where: {
            id: req.body.id
        },
        data: req.body
    })

    res.status(200).json(manutencao).end()
}

const remove = async (req, res) => {
    await prisma.veiculo.update({
        where: {
            id: Number(req.body.id_veiculo)
        },
        data: {
            disponivel: true
        }
    })

    const manutencao = await prisma.manutencao.delete({
        where: {
            id: Number(req.body.id)
        }
    })

    res.status(200).json(manutencao).end()
}

const finish = async (req, res) => {
    req.body.id = Number(req.body.id)
    const manutencao = await prisma.manutencao.update({
        where: {
            id: req.body.id
        },
        data: {
            data_fim: new Date().toISOString()
        }
    })

    await prisma.veiculo.update({
        where: {
            id: req.body.id_veiculo
        },
        data: {
            disponivel: true
        }
    })

    res.status(200).json(manutencao).end()
}

module.exports = {
    create,
    readAll,
    read,
    update,
    remove,
    finish
}