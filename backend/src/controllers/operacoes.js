const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const create = async (req, res) => {
    req.body.forEach(async m => {
        await prisma.veiculo.update({
            where: {
                id: m.id_veiculo
            },
            data: {
                disponivel: false
            }
        })

        await prisma.motorista.update({
            where: {
                id: m.id_motorista
            },
            data: {
                disponivel: false
            }
        })  
    })

    const operacao = await prisma.operacao.createMany({
        data: req.body
    }).catch((err) => {
        console.log(err)
        return({})
    })

    res.status(200).json(operacao).end()
}

const readAll = async (req, res) => {
    const operacoes = await prisma.operacao.findMany({
        select: {
            id: true,
            id_motorista: true,
            id_veiculo: true,
            data_saida: true,
            data_retorno: true,
            descricao: true,
            motorista: true,
            veiculo: true
        }
    })

    res.status(200).json(operacoes).end()
}

const read = async (req, res) => {
    const operacao = await prisma.operacao.findFirst({
        where: {
            id: Number(req.params.id)
        },
        select: {
            id: true,
            id_motorista: true,
            id_veiculo: true,
            data_saida: true,
            data_retorno: true,
            descricao: true,
            motorista: true,
            veiculo: true
        }
    })

    res.status(200).json(operacao).end()
}

const update = async (req, res) => {
    req.body.id = Number(req.body.id)
    const operacao = await prisma.operacao.update({
        where: {
            id: req.body.id
        },
        data: req.body
    })

    res.status(200).json(operacao).end()
}

const remove = async (req, res) => {
    const operacao = await prisma.operacao.delete({
        where: {
            id: Number(req.body.id)
        }
    })

    res.status(200).json(operacao).end()
}

const finish = async (req, res) => {
    req.body.id = Number(req.body.id)
    const operacao = await prisma.operacao.update({
        where: {
            id: req.body.id
        },
        data: {
            data_retorno: new Date().toISOString()
        }
    })

    await prisma.veiculo.update({
        where: {
            id: operacao.id_veiculo
        },
        data: {
            disponivel: true
        }
    })

    await prisma.motorista.update({
        where: {
            id: operacao.id_motorista
        },
        data: {
            disponivel: true
        }
    })

    res.status(200).json(operacao).end()
}

module.exports = {
    create,
    readAll,
    read,
    update,
    remove,
    finish
}