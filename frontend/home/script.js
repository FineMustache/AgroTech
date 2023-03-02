var motoristas = []

function togglesbi(ev, mainId) {
    document.querySelectorAll('.sb-i').forEach(i => {
        i.classList.remove('active')
    })

    ev.classList.add('active')

    window.location.href = mainId

}

function carregar() {
    carregarMotoristas()
    carregarVeiculos()
}

function carregarMotoristas() {
    const options = {method: 'GET'};

    fetch('http://localhost:3000/agrotech/motoristas', options)
    .then(response => response.json())
    .then(response => {
        motoristas = response
        response.forEach(r => {
            let modelo = document.querySelector('.page-motoristas').querySelector('.modelo').cloneNode(true)
            modelo.querySelector('#nome').innerHTML = r.nome
            modelo.querySelector('#cpf').innerHTML = r.cpf
            modelo.querySelector('#cnh').innerHTML = r.cnh
            modelo.querySelector('#disp').innerHTML = r.disponivel ? "Livre" : "Ocupado"
            modelo.querySelector('#nop').innerHTML = r.operacoes.length

            modelo.id = "m" + r.id
            modelo.setAttribute('disponibilidade', r.disponivel)

            modelo.classList.remove('modelo')

            document.querySelector('.page-motoristas').appendChild(modelo)
        })
    })
    .catch(err => console.error(err));
}

function toggleModalEditMotorista(card){
    console.log(card)
    if (card !== undefined) {
        document.querySelector('.modal-edit-motorista').querySelector('#inpNome').value = card.querySelector('#nome').innerHTML
        document.querySelector('.modal-edit-motorista').querySelector('#inpCpf').value = card.querySelector('#cpf').innerHTML
        document.querySelector('.modal-edit-motorista').querySelector('#inpCnh').value = card.querySelector('#cnh').innerHTML
        document.querySelector('.modal-edit-motorista').querySelector('#nop').innerHTML = card.querySelector('#nop').innerHTML
        document.querySelector('.modal-edit-motorista').querySelector('#inpId').value = card.id.slice(1)
    } else {
        document.querySelector('.modal-edit-motorista').querySelector('#inpNome').value = ""
        document.querySelector('.modal-edit-motorista').querySelector('#inpCpf').value = ""
        document.querySelector('.modal-edit-motorista').querySelector('#inpCnh').value = ""
    }
    document.querySelector('.modal-edit-motorista').classList.toggle('escondido')
    document.body.style.overflow = 'hidden'
}

function toggleModalCreateMotorista(card){
    console.log(card)
    if (card !== undefined) {
        document.querySelector('.modal-create-motorista').querySelector('#inpNome').value = card.querySelector('#nome').innerHTML
        document.querySelector('.modal-create-motorista').querySelector('#inpCpf').value = card.querySelector('#cpf').innerHTML
        document.querySelector('.modal-create-motorista').querySelector('#inpCnh').value = card.querySelector('#cnh').innerHTML
        document.querySelector('.modal-create-motorista').querySelector('#inpId').value = card.id.slice(1)
    } else {
        document.querySelector('.modal-create-motorista').querySelector('#inpNome').value = ""
        document.querySelector('.modal-create-motorista').querySelector('#inpCpf').value = ""
        document.querySelector('.modal-create-motorista').querySelector('#inpCnh').value = ""
    }
    document.querySelector('.modal-create-motorista').classList.toggle('escondido')
    document.body.style.overflow = 'hidden'
}

function wiggle(ev) {
    if (ev.target.classList.contains('modal')) {
        ev.target.querySelector('.modal-container').classList.add('wiggle')
        setTimeout(() => {
            ev.target.querySelector('.modal-container').classList.remove('wiggle')
        }, 500)
    }
}

function cpfChange(ev) {
    if (isNaN(ev.key) && ev.key !== "Backspace") {
        ev.preventDefault()
    } else if(ev.key !== "Backspace") {
        if (ev.target.value.length == 2) {
            ev.preventDefault()
            ev.target.value = ev.target.value + ev.key + "."
        } else if (ev.target.value.length == 6) {
            ev.preventDefault()
            ev.target.value = ev.target.value + ev.key + "."
        } else if (ev.target.value.length == 10) {
            ev.preventDefault()
            ev.target.value = ev.target.value + ev.key + "-"
        } else if (ev.target.value.length == 3) {
            ev.preventDefault()
            ev.target.value = ev.target.value + "." + ev.key
        } else if (ev.target.value.length == 7) {
            ev.preventDefault()
            ev.target.value = ev.target.value + "." + ev.key
        } else if (ev.target.value.length == 11) {
            ev.preventDefault()
            ev.target.value = ev.target.value + "-" + ev.key
        }
    }
}

function editMotorista() {
    const nome = document.querySelector('.modal-edit-motorista').querySelector('#inpNome').value
    const cpf = document.querySelector('.modal-edit-motorista').querySelector('#inpCpf').value
    const cnh = document.querySelector('.modal-edit-motorista').querySelector('#inpCnh').value
    const id = document.querySelector('.modal-edit-motorista').querySelector('#inpId').value
    if (nome.length > 0 && cpf.length > 0 && cnh.length > 0) {
        const options = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: `{"id":${id},"nome":"${nome}","cpf":"${cpf}","cnh":"${cnh}"}`
          };
          
          fetch('http://localhost:3000/agrotech/motoristas', options)
            .then(response => response.json())
            .then(response => {
                if (response.id !== null) {
                    let modelo = document.querySelector('.page-motoristas').querySelector('.modelo').cloneNode(true)
                    document.querySelector('.page-motoristas').innerHTML = ""
                    document.querySelector('.page-motoristas').appendChild(modelo)
                    carregarMotoristas()
                    toggleModalEditMotorista()
                }
            })
            .catch(err => console.error(err));
    }
}

function excluirMotorista() {
    const id = document.querySelector('.modal-edit-motorista').querySelector('#inpId').value
    const options = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: `{"id":${id}}`
      };
      
      fetch('http://localhost:3000/agrotech/motoristas', options)
        .then(response => response.json())
        .then(response => {
            if (response.id !== null) {
                let modelo = document.querySelector('.page-motoristas').querySelector('.modelo').cloneNode(true)
                document.querySelector('.page-motoristas').innerHTML = ""
                document.querySelector('.page-motoristas').appendChild(modelo)
                carregarMotoristas()
                toggleModalEditMotorista()
            }
        })
        .catch(err => console.error(err));
}

function toggleFilterMotoristas() {
    document.querySelector('.main-motoristas').querySelector('.filter-db').classList.toggle('escondido')
}

function filterMotoristasChange() {
    let cbDisp = document.querySelector("#cbMotDisp")
    let cbInd = document.querySelector("#cbMotInd")
    let cards = document.querySelector('.page-motoristas').querySelectorAll('.card-motorista')

    if (cbDisp.checked) {
        cards.forEach((c, index) => {
            if(index !== 0){
                if (c.getAttribute('disponibilidade') == "true") {
                    c.classList.remove('escondido')
                }
            }
            
        })
    } else {
        cards.forEach((c, index) => {
            if(index !== 0){
                if (c.getAttribute('disponibilidade') == "true") {
                    c.classList.add('escondido')
                }
            }
            
        })
    }

    if (cbInd.checked) {
        cards.forEach((c, index) => {
            if(index !== 0){
                if (c.getAttribute('disponibilidade') == "false") {
                    c.classList.remove('escondido')
                }
            }
            
        })

    } else {
        cards.forEach((c, index) => {
            if(index !== 0){
                if (c.getAttribute('disponibilidade') == "false") {
                    c.classList.add('escondido')
                }
            }
            
        })
    }
}

function cadastrarMotorista() {
    const nome = document.querySelector('.modal-create-motorista').querySelector('#inpNome').value
    const cpf = document.querySelector('.modal-create-motorista').querySelector('#inpCpf').value
    const cnh = document.querySelector('.modal-create-motorista').querySelector('#inpCnh').value
    if (nome.length > 0 && cpf.length > 0 && cnh.length > 0) {
            const options = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: `{"cpf":"${cpf}","cnh":"${cnh}","nome":"${nome}"}`
              };
              
              fetch('http://localhost:3000/agrotech/motoristas', options)
                .then(response => response.json())
                .then(response => {
                    if (response.count !== null) {
                        let modelo = document.querySelector('.page-motoristas').querySelector('.modelo').cloneNode(true)
                        document.querySelector('.page-motoristas').innerHTML = ""
                        document.querySelector('.page-motoristas').appendChild(modelo)
                        carregarMotoristas()
                        toggleModalCreateMotorista()
                    }
                })
                .catch(err => console.error(err));
    }
}

function logout() {
    window.localStorage.removeItem('@uinfo')
    window.location.href = "../login"
}

setInterval(validarToken, 5000)

function validarToken() {
    let uinfo = window.localStorage.getItem('@uinfo')
    if (uinfo == null) {
        window.location.href = "../login"
    }else{
        uinfo = JSON.parse(uinfo)
        const options = {
            method: 'POST',
            headers: {
              Authorization: `${uinfo.token}`,
              'Content-Type': 'application/json'
            },
            body: `{"id":${uinfo.uid}}`
          };
          
          fetch('http://localhost:3000/agrotech/validate', options)
            .then(response => response.json())
            .then(response => {
                if (!response.validation) {
                    logout()
                }
            })
            .catch(err => console.error(err));
    }
}

function toggleShowVeic(num, num2) {
    document.querySelector('.radio-opt-' + num).classList.add('radio-opt-active')
    document.querySelector('.radio-opt-' + num2).classList.remove('radio-opt-active')
}

function carregarVeiculos() {
    const options = {method: 'GET'};

    fetch('http://localhost:3000/agrotech/veiculos', options)
    .then(response => response.json())
    .then(response => {
        if (document.querySelector('.radio-opt-1').classList.contains('radio-opt-active')) {
            response.forEach(v => {
                let modelo = document.querySelector('.modeloVeicGeral').cloneNode(true)
                modelo.querySelector('#vgPlaca').innerHTML = v.placa
                modelo.querySelector('#vgModelo').innerHTML = v.modelo
                modelo.querySelector('#vgMarca').innerHTML = v.marca
                modelo.querySelector('#vgTipo').innerHTML = v.tipo.slice(0, 1).toUpperCase() + v.tipo.slice(1)
                modelo.querySelector('#vgDisp').innerHTML = v.disponivel ? "Livre" : "Ocupado"
                modelo.querySelector('#vgNop').innerHTML = v.operacoes.length
                modelo.querySelector('#vgNman').innerHTML = v.manutencoes.length
                modelo.addEventListener('click', () => toggleModalEditVeic(v))
                modelo.setAttribute('disponibilidade', v.disponivel)

                modelo.classList.remove('escondido')

                document.querySelector('#veicGeral').querySelector('.table-body').appendChild(modelo)
            })
        }
    })
    .catch(err => console.error(err));   
}

function toggleModalEditVeic(v) {
    console.log(v)
    if (v.id !== undefined) {
        console.log(v.tipo)
        document.querySelector('.modal-edit-veic').querySelector('#inpPlaca').value = v.placa
        document.querySelector('.modal-edit-veic').querySelector('#inpModelo').value = v.modelo
        document.querySelector('.modal-edit-veic').querySelector('#inpMarca').value = v.marca
        document.querySelector('.modal-edit-veic').querySelector('#inpTipo').value = v.tipo
        document.querySelector('.modal-edit-veic').querySelector('#nop').innerHTML = v.operacoes.length
        document.querySelector('.modal-edit-veic').querySelector('#nman').innerHTML = v.manutencoes.length
        document.querySelector('.modal-edit-veic').querySelector('#inpId').value = v.id
    } else {
        document.querySelector('.modal-edit-veic').querySelector('#inpPlaca').value = ""
        document.querySelector('.modal-edit-veic').querySelector('#inpModelo').value = ""
        document.querySelector('.modal-edit-veic').querySelector('#inpMarca').value = ""
        document.querySelector('.modal-edit-veic').querySelector('#nop').innerHTML = ""
        document.querySelector('.modal-edit-veic').querySelector('#nman').innerHTML = ""
        document.querySelector('.modal-edit-veic').querySelector('#inpId').value = ""
    }
    document.querySelector('.modal-edit-veic').classList.toggle('escondido')
    document.body.style.overflow = 'hidden'
}

function toggleModalCreateVeic() {
    document.querySelector('.modal-create-veic').querySelector('#inpPlaca').value = ""
    document.querySelector('.modal-create-veic').querySelector('#inpModelo').value = ""
    document.querySelector('.modal-create-veic').querySelector('#inpMarca').value = ""
    document.querySelector('.modal-create-veic').querySelector('#inpId').value = ""

    document.querySelector('.modal-create-veic').classList.toggle('escondido')
    document.body.style.overflow = 'hidden'
}

function toggleFilterVeic() {
    document.querySelector('.main-veiculos').querySelector('.filter-db').classList.toggle('escondido')
}

function filterVeicChange() {
    let cbDisp = document.querySelector("#cbVeicDisp")
    let cbInd = document.querySelector("#cbVeicInd")
    let cards = document.querySelector('.page-veiculos').querySelectorAll('.modeloVeicGeral')

    if (cbDisp.checked) {
        cards.forEach((c, index) => {
            if(index !== 0){
                if (c.getAttribute('disponibilidade') == "true") {
                    c.classList.remove('escondido')
                }
            }
            
        })
    } else {
        cards.forEach((c, index) => {
            if(index !== 0){
                if (c.getAttribute('disponibilidade') == "true") {
                    c.classList.add('escondido')
                }
            }
            
        })
    }

    if (cbInd.checked) {
        cards.forEach((c, index) => {
            if(index !== 0){
                if (c.getAttribute('disponibilidade') == "false") {
                    c.classList.remove('escondido')
                }
            }
            
        })

    } else {
        cards.forEach((c, index) => {
            if(index !== 0){
                if (c.getAttribute('disponibilidade') == "false") {
                    c.classList.add('escondido')
                }
            }
            
        })
    }
}

function editVeic() {
    const placa = document.querySelector('.modal-edit-veic').querySelector('#inpPlaca').value
    const modelo = document.querySelector('.modal-edit-veic').querySelector('#inpModelo').value
    const marca = document.querySelector('.modal-edit-veic').querySelector('#inpMarca').value
    const tipo = document.querySelector('.modal-edit-veic').querySelector('#inpTipo').value
    const id = document.querySelector('.modal-edit-veic').querySelector('#inpId').value

    const options = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: `{"id":${id},"placa":"${placa}","modelo":"${modelo}", "marca": "${marca}","tipo":"${tipo}"}`
      };
      
      fetch('http://localhost:3000/agrotech/veiculos', options)
        .then(response => response.json())
        .then(response => {
            let modelo = document.querySelector('.table-body').querySelector('.modeloVeicGeral').cloneNode(true)
            document.querySelector('.table-body').innerHTML = ""
            document.querySelector('.table-body').appendChild(modelo)
            carregarVeiculos()
            toggleModalEditVeic({})
        })
        .catch(err => console.error(err));
}

function cadastrarVeiculo() {
    const placa = document.querySelector('.modal-create-veic').querySelector('#inpPlaca').value
    const modelo = document.querySelector('.modal-create-veic').querySelector('#inpModelo').value
    const marca = document.querySelector('.modal-create-veic').querySelector('#inpMarca').value
    const tipo = document.querySelector('.modal-create-veic').querySelector('#inpTipo').value

    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: `{"placa":"${placa}","modelo":"${modelo}", "marca": "${marca}","tipo":"${tipo}"}`
      };
      
      fetch('http://localhost:3000/agrotech/veiculos', options)
        .then(response => response.json())
        .then(response => {
            let modelo = document.querySelector('.table-body').querySelector('.modeloVeicGeral').cloneNode(true)
            document.querySelector('.table-body').innerHTML = ""
            document.querySelector('.table-body').appendChild(modelo)
            carregarVeiculos()
            toggleModalCreateVeic({})
        })
        .catch(err => console.error(err));
}

function excluirVeic() {
    const id = document.querySelector('.modal-edit-veic').querySelector('#inpId').value
    const options = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: `{"id":${id}}`
      };
      
      fetch('http://localhost:3000/agrotech/veiculos', options)
        .then(response => response.json())
        .then(response => {
            let modelo = document.querySelector('.table-body').querySelector('.modeloVeicGeral').cloneNode(true)
            document.querySelector('.table-body').innerHTML = ""
            document.querySelector('.table-body').appendChild(modelo)
            carregarVeiculos()
            toggleModalEditVeic({})
        })
        .catch(err => console.error(err));
}