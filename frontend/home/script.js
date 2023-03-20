var graficoFreq = {"limpo": true}
var graficoCusto = {"limpo": true}
var tempoMedioManutencaoChart = {"limpo": true}
var custoPorMesManutencaoChart = {"limpo": true}
var freqPorMesManutencaoChart = {"limpo": true}
var mediaHorasOpMotChart = {"limpo": true}
var graficoOpMot = {"limpo": true}

var graficoFreqOp = {"limpo": true}
var graficoCustoOp = {"limpo": true}
var tempoMedioOperacaoChart = {"limpo": true}
var custoPorMesOperacaoChart = {"limpo": true}
var freqPorMesOperacaoChart = {"limpo": true}

var myChart = {"limpo": true}
var myChartMot = {"limpo": true}

const {Utils} = Chart

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
    carregarManutencoes()
    carregarOperacoes()
}

function carregarMotoristas() {
    const options = {method: 'GET'};

    fetch('http://localhost:3000/agrotech/motoristas', options)
    .then(response => response.json())
    .then(response => {
        document.querySelectorAll('.allMot').forEach(s => {
            s.innerHTML = ""
        })
        document.querySelectorAll('.freeMot').forEach(s => {
            s.innerHTML = ""
        })
        filterMotoristasChange()
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

            document.querySelectorAll('.allMot').forEach(s => {
                let op = document.createElement('option')
                op.value = r.id
                op.innerHTML = `${r.id} - ${r.nome}`
                s.appendChild(op)
            })

            if (r.disponivel) {
                document.querySelectorAll('.freeMot').forEach(s => {
                    let op = document.createElement('option')
                    op.value = r.id
                    op.innerHTML = `${r.id} - ${r.nome}`
                    s.appendChild(op)
                })
            }
        })
        let nLivre = response.reduce((count, obj) => obj.disponivel ? count + 1 : count, 0)
        let nOcupado = response.reduce((count, obj) => !obj.disponivel ? count + 1 : count, 0)
        var ctx = document.getElementById('doughnut-chart-disp-mot').getContext('2d');

        if(!myChartMot.limpo){
            myChartMot.destroy()
        }

		myChartMot = new Chart(ctx, {
			type: 'doughnut',
			data: {
				labels: ['Ocupado', 'Livre'],
				datasets: [{
                    label: 'Motoristas',
					data: [nOcupado, nLivre],
					backgroundColor: [
						'#c00',
						'#00ffab',
					],
					hoverOffset: 4
				}]
			},
			options: {
				cutout: '70%',
				plugins: {
					legend: {
						display: false
					},
					tooltip: {
						enabled: true,
                        padding: 10,
                        
					},
					datalabels: {
						color: '#ffffff',
						font: {
							size: 20
						},
						formatter: function(value, context) {
							var sum = 0;
							var dataArr = context.chart.data.datasets[0].data;
							dataArr.map(function(data) {
								sum += data;
							});
							var percentage = ((value * 100) / sum).toFixed(2) + "%";
							return percentage;
						}
					},
                    spacing: 1
				}
			}
		});

		var centerValue = document.querySelector('#sum-value-disp-mot');
		centerValue.textContent = myChartMot.data.datasets[0].data.reduce((a, b) => a + b, 0);
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

function toggleFilterMan() {
    document.querySelector('.main-manutencoes').querySelector('.filter-db').classList.toggle('escondido')
}

function toggleFilterOp() {
    document.querySelector('.main-operacoes').querySelector('.filter-db').classList.toggle('escondido')
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

function filterManChange() {
    let cbManAb = document.querySelector("#cbManAb")
    let cbManFec = document.querySelector("#cbManFec")
    let cards = document.querySelector('.main-manutencoes').querySelectorAll('.modeloGeraMan')

    if (cbManAb.checked) {
        cards.forEach((c, index) => {
            if(index !== 0){
                if (c.getAttribute('aberto') == "true") {
                    c.classList.remove('escondido')
                }
            }
            
        })
    } else {
        cards.forEach((c, index) => {
            if(index !== 0){
                if (c.getAttribute('aberto') == "true") {
                    c.classList.add('escondido')
                }
            }
            
        })
    }

    if (cbManFec.checked) {
        cards.forEach((c, index) => {
            if(index !== 0){
                if (c.getAttribute('aberto') == "false") {
                    c.classList.remove('escondido')
                }
            }
            
        })

    } else {
        cards.forEach((c, index) => {
            if(index !== 0){
                if (c.getAttribute('aberto') == "false") {
                    c.classList.add('escondido')
                }
            }
            
        })
    }
}

function filterOpChange() {
    let cbOpAb = document.querySelector("#cbOpAb")
    let cbOpFec = document.querySelector("#cbOpFec")
    let cards = document.querySelector('.main-operacoes').querySelectorAll('.modeloGeraOp')

    if (cbOpAb.checked) {
        cards.forEach((c, index) => {
            if(index !== 0){
                if (c.getAttribute('aberto') == "true") {
                    c.classList.remove('escondido')
                }
            }
            
        })
    } else {
        cards.forEach((c, index) => {
            if(index !== 0){
                if (c.getAttribute('aberto') == "true") {
                    c.classList.add('escondido')
                }
            }
            
        })
    }

    if (cbOpFec.checked) {
        cards.forEach((c, index) => {
            if(index !== 0){
                if (c.getAttribute('aberto') == "false") {
                    c.classList.remove('escondido')
                }
            }
            
        })

    } else {
        cards.forEach((c, index) => {
            if(index !== 0){
                if (c.getAttribute('aberto') == "false") {
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
    window.location.href = "../login/index.html"
}

setInterval(validarToken, 5000)

function validarToken() {
    let uinfo = window.localStorage.getItem('@uinfo')
    if (uinfo == null) {
        window.location.href = "../login/index.html"
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
            document.querySelectorAll('.allVeic').forEach(s => {
                s.innerHTML = ""
            })
            document.querySelectorAll('.freeVeic').forEach(s => {
                s.innerHTML = ""
            })
            filterVeicChange()
            let uinfo = window.localStorage.getItem('@uinfo')
            if (uinfo == null) {
                window.location.href = "../login/index.html"
            }else{
                uinfo = JSON.parse(uinfo)
                
            }
            response.forEach(v => {
                let modelo = document.querySelector('.modeloVeicGeral').cloneNode(true)
                modelo.querySelector('#vgPlaca').innerHTML = v.placa
                modelo.querySelector('#vgModelo').innerHTML = v.modelo
                modelo.querySelector('#vgMarca').innerHTML = v.marca
                modelo.querySelector('#vgTipo').innerHTML = v.tipo.slice(0, 1).toUpperCase() + v.tipo.slice(1)
                modelo.querySelector('#vgDisp').innerHTML = v.disponivel ? "Livre" : "Ocupado"
                modelo.querySelector('#vgNop').innerHTML = v.operacoes.length
                modelo.querySelector('#vgNman').innerHTML = v.manutencoes.length
                if (uinfo.tipo !== 'funcionario') modelo.addEventListener('click', () => toggleModalEditVeic(v))                
                modelo.setAttribute('disponibilidade', v.disponivel)

                modelo.classList.remove('escondido')

                document.querySelector('#veicGeral').querySelector('.table-body').appendChild(modelo)

                document.querySelectorAll('.allVeic').forEach(s => {
                    let op = document.createElement('option')
                    op.value = v.id
                    op.innerHTML = `${v.placa} - ${v.marca} - ${v.modelo} - ${v.tipo.slice(0,1).toUpperCase() + v.tipo.slice(1)}`
                    s.appendChild(op)
                })

                if (v.disponivel) {
                    document.querySelectorAll('.freeVeic').forEach(s => {
                        let op = document.createElement('option')
                        op.value = v.id
                        op.innerHTML = `${v.placa} - ${v.marca} - ${v.modelo} - ${v.tipo.slice(0,1).toUpperCase() + v.tipo.slice(1)}`
                        s.appendChild(op)
                    })
                }
            })

        let nLivre = response.reduce((count, obj) => obj.disponivel ? count + 1 : count, 0)
        let nOcupado = response.reduce((count, obj) => !obj.disponivel ? count + 1 : count, 0)
        let nManutencao = 0
        response.forEach(v => {
            v.manutencoes.forEach(m => {
                if(m.data_fim == null){
                    nManutencao++
                }
            })
        })
        // let nManutencao = response.reduce((count, obj) => obj.manutencoes.length > 0 ? (obj.manutencoes.at(-1).data_fim == null ? count + 1 : count, 0) : count, 0)
        let nOp = 0
        response.forEach(v => {
            v.operacoes.forEach(o => {
                if(o.data_retorno == null){
                    nOp++
                }
            })
        })

        let nOutros = nOcupado - nManutencao - nOp

        var ctx = document.getElementById('doughnut-chart-disp-veic').getContext('2d');

        if (!myChart.limpo) {
            myChart.destroy()
        }

		myChart = new Chart(ctx, {
			type: 'doughnut',
			data: {
				datasets: [{
                    label: 'Veículos',
					data: [nOcupado, nLivre],
					backgroundColor: [
						'#c00',
						'#00ffab',
					],
					hoverOffset: 4,
                    labels: ['Ocupado', 'Livre'],
				},
                {
                    data: [
                        nManutencao,
                        nOp,
                        nOutros,
                        nLivre
                    ],
                    backgroundColor: [
                      "rgb(255, 150, 0)", // red
                      "#003961", // green
                      "#ccc", //blue
                      "#00ffab", //blue
                    ],
                    labels: ['Em Manutenção', 'Em Operação', 'Outros', 'Livre']
                  }]
			},
			options: {
				cutout: '70%',
				plugins: {
					legend: {
						display: false
					},
					tooltip: {
						enabled: true,
                        padding: 10,
                        callbacks: {
                            label: function(data) {
                              var label = data.dataset.labels !== undefined ? data.dataset.labels[data.dataIndex] : data.dataset.label;
                              var value = data.dataset.data[data.dataIndex];
                              return label + ': ' + value;
                            }
                          }
					},
					datalabels: {
						color: '#ffffff',
						font: {
							size: 20
						},
						formatter: function(value, context) {
							var sum = 0;
							var dataArr = context.chart.data.datasets[0].data;
							dataArr.map(function(data) {
								sum += data;
							});
							var percentage = ((value * 100) / sum).toFixed(2) + "%";
							return percentage;
						}
					},
                    spacing: 1
				},
                onClick: (e, a) => {
                    console.log(a)
                    if (a[0].datasetIndex == 1) {
                        if (document.querySelector('.dispTables').querySelectorAll('.showtvm').length > 0) {
                            if (document.querySelector('.dispTables').querySelector('.showtvm').querySelector('table').getAttribute('indexT') == a[0].index) {
                                document.querySelector('.dispTables').querySelector('.showtvm').classList.remove('showtvm')
                            } else {
                                document.querySelector('.dispTables').querySelectorAll('table').forEach(t => {
                                    t.parentNode.classList.remove('showtvm')
                                })
        
                                switch (a[0].index) {
                                    case 0:
                                        document.getElementById('tableVeicMan').parentNode.classList.add('showtvm')
                                        break;
                                    
                                    case 1:
                                        document.getElementById('tableVeicOp').parentNode.classList.add('showtvm')
                                        break;
        
                                    default:
                                        break;
                                }
                            }
                        } else {
                            document.querySelector('.dispTables').querySelectorAll('table').forEach(t => {
                                t.parentNode.classList.remove('showtvm')
                            })
    
                            switch (a[0].index) {
                                case 0:
                                    document.getElementById('tableVeicMan').parentNode.classList.add('showtvm')
                                    break;
                                
                                case 1:
                                    document.getElementById('tableVeicOp').parentNode.classList.add('showtvm')
                                    break;
    
                                default:
                                    break;
                            }
                        }
                        
                    } 
                }
			}
		});

		var centerValue = document.querySelector('#sum-value-disp-veic');
		centerValue.textContent = myChart.data.datasets[0].data.reduce((a, b) => a + b, 0);
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

function toggleShowDash(num) {
    document.querySelectorAll('.radio-opt-dash').forEach(o => {
        if (!o.classList.contains('radio-opt-dash-' + num)) {
            o.classList.remove('radio-opt-active')
        }else{
            o.classList.add('radio-opt-active')
        }
    })

    switch (num) {
        case 1:
            document.querySelector('.dashboard-disp').classList.remove('graf-escondido')
            document.querySelector('.dashboard-man').classList.add('graf-escondido')
            document.querySelector('.dashboard-op').classList.add('graf-escondido')
            break;
        case 2:
            document.querySelector('.dashboard-disp').classList.add('graf-escondido')
            document.querySelector('.dashboard-man').classList.remove('graf-escondido')
            document.querySelector('.dashboard-op').classList.add('graf-escondido')
            break;
        case 3:
            document.querySelector('.dashboard-disp').classList.add('graf-escondido')
            document.querySelector('.dashboard-man').classList.add('graf-escondido')
            document.querySelector('.dashboard-op').classList.remove('graf-escondido')
            break;
        default:
            break;
    }
}

function carregarManutencoes() {
    const options = {method: 'GET'};

    fetch('http://localhost:3000/agrotech/manutencoes', options)
    .then(response => response.json())
    .then(response => {
        document.getElementById('veicManTableBody').innerHTML = ""
        filterManChange()
        let uinfo = window.localStorage.getItem('@uinfo')
        if (uinfo == null) {
            window.location.href = "../login/index.html"
        }else{
            uinfo = JSON.parse(uinfo)
            
        }
        response.forEach(m => {

            let model = document.querySelector('.modeloGeraMan').cloneNode(true)

            model.querySelector('#gmPlaca').innerHTML = m.veiculo.placa
            model.querySelector('#gmDesc').innerHTML = m.descricao
            model.querySelector('#gmDataIni').innerHTML = new Date(m.data_inicio).toLocaleString('pt-br')
            model.querySelector('#gmDataFim').innerHTML = m.data_fim == undefined ? '-' : new Date(m.data_fim).toLocaleString('pt-br')
            model.querySelector('#gmValor').innerHTML = "R$ " + m.valor.toString().replace('.', ',')
            model.classList.remove('escondido')
            model.setAttribute('vid', m.veiculo.id)
            model.id = "m" + m.id
            model.setAttribute('aberto', m.data_fim == null)
            if (uinfo.tipo == 'funcionario') {
                model.removeAttribute('onclick')   
            }
            document.querySelector('#manGeral').querySelector('.table-body').appendChild(model)

            if (m.data_fim == null) {
                model.querySelector('.btnFinalizarGeral').classList.remove('escondido')
                let tr = document.createElement('tr')
                let placa = document.createElement('td')
                let tipo = document.createElement('td')
                let desc = document.createElement('td')
                let inicio = document.createElement('td')
                let fim = document.createElement('td')
                let valor = document.createElement('td')
    
                placa.innerHTML = m.veiculo.placa
                tipo.innerHTML = m.veiculo.tipo.slice(0,1).toUpperCase() + m.veiculo.tipo.slice(1)
                desc.innerHTML = m.descricao
                inicio.innerHTML = new Date(m.data_inicio).toLocaleString('pt-br')
                fim.innerHTML = m.data_fim !== null ? new Date(m.data_fim).toLocaleString('pt-br') : '-'
                valor.innerHTML = m.valor
    
                tr.append(placa, tipo, desc, inicio, fim, valor)
    
                document.getElementById('veicManTableBody').appendChild(tr)   
            }
        })

        // gerar gráfico de frequência de manutenções por tipo de veículo
        const freqManutencoes = {};
        response.forEach(manutencao => {
        const tipoVeiculo = manutencao.veiculo.tipo;
        if (!freqManutencoes[tipoVeiculo]) {
            freqManutencoes[tipoVeiculo] = 1;
        } else {
            freqManutencoes[tipoVeiculo]++;
        }
        });

        const labelsFreq = Object.keys(freqManutencoes).map(k => k = k.slice(0,1).toUpperCase() + k.slice(1));
        const dataFreq = Object.values(freqManutencoes);
        document.querySelector('#sum-value-man').innerHTML = response.length

        console.log(labelsFreq, dataFreq)
        
        if (!graficoFreq.limpo) {
            graficoFreq.destroy()
        }

        graficoFreq = new Chart(document.getElementById('grafico-freq'), {
        type: 'doughnut',
        data: {
            labels: labelsFreq,
            datasets: [{
            label: 'Frequência de Manutenções',
            data: dataFreq,
            backgroundColor: [
                'rgba(255, 99, 132)',
                'rgba(54, 162, 235)',
                'rgba(255, 206, 86)'
            ],
            borderColor: 'white',
            borderWidth: 1
            }]
        },
        options: {
            cutout: '70%',
            plugins: {
                legend: {
                    display: false
                }
            },
            spacing: 1
        }
        });

        // gerar gráfico de custo médio de manutenções por tipo de veículo
        const custoManutencoes = {};
        response.forEach(manutencao => {
        const tipoVeiculo = manutencao.veiculo.tipo;
        const valorManutencao = manutencao.valor;
        if (!custoManutencoes[tipoVeiculo]) {
            custoManutencoes[tipoVeiculo] = {
            total: valorManutencao,
            qtd: 1
            };
        } else {
            custoManutencoes[tipoVeiculo].total += valorManutencao;
            custoManutencoes[tipoVeiculo].qtd++;
        }
        });

        const labelsCusto = ['carga', 'visita', 'vendas'];
        const dataCusto = [];
        console.log(custoManutencoes)
        labelsCusto.forEach(label => {
        custoManutencoes[label] !== undefined ? dataCusto.push(custoManutencoes[label].total / custoManutencoes[label].qtd) : dataCusto.push(0);
        });

        if (!graficoCusto.limpo) {
            graficoCusto.destroy()
        }

        graficoCusto = new Chart(document.getElementById('grafico-custo'), {
        type: 'bar',
        data: {
            labels: labelsCusto.map(k => k = k.slice(0,1).toUpperCase() + k.slice(1)),
            datasets: [{
            label: 'Custo Médio de Manutenções',
            data: dataCusto,
            backgroundColor: [
                'rgba(255, 99, 132)',
                'rgba(54, 162, 235)',
                'rgba(255, 206, 86)'
            ],
            borderColor: 'white',
            borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                }
            }
        }
        });

        // ... código anterior

        const dadosPreparados = prepararDadosParaDashboard(response)
        console.log(dadosPreparados)

        // Calcula o tempo médio de manutenção por tipo de veículo
        const tempoMedioManutencaoCarga = calcularTempoMedioManutencao(dadosPreparados.manutencoesCarga, "carga");
        const tempoMedioManutencaoVendas = calcularTempoMedioManutencao(dadosPreparados.manutencoesVendas, "vendas");
        const tempoMedioManutencaoVisita = calcularTempoMedioManutencao(dadosPreparados.manutencoesVisita, "visita");

        // Cria o gráfico de tempo médio de manutenções por tipo de veículo
        const tempoMedioManutencaoCtx = document.getElementById('tempo-medio-manutencao').getContext('2d');
        
        if (!tempoMedioManutencaoChart.limpo) {
            tempoMedioManutencaoChart.destroy()
        }

        tempoMedioManutencaoChart = new Chart(tempoMedioManutencaoCtx, {
            type: 'bar',
            data: {
                labels: ['Carga', 'Visita', 'Vendas'],
                datasets: [{
                    label: 'Tempo Médio de Manutenção (dias)',
                    data: [tempoMedioManutencaoCarga, tempoMedioManutencaoVisita, tempoMedioManutencaoVendas],
                    backgroundColor: [
                        'rgba(255, 99, 132)',
                        'rgba(54, 162, 235)',
                        'rgba(255, 206, 86)'
                    ],
                    borderColor: 'white',
                    borderWidth: 1
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });

        const mediaMesCarga = separarMediaManutencaoPorMes(response, 'carga')
        // let dataCPMM = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        // mediaMesCarga.forEach(m => {
        //     dataCPMM[Number(m.mes.split('-')[1])] += m.media
        // })
        const mediaMesVendas = separarMediaManutencaoPorMes(response, 'vendas')
        // let dataVsPMM = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        // mediaMesVendas.forEach(m => {
        //     dataVsPMM[Number(m.mes.split('-')[1])] += m.media
        // })
        const mediaMesVisita = separarMediaManutencaoPorMes(response, 'visita')
        // let dataVPMM = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        // mediaMesVisita.forEach(m => {
        //     dataVPMM[Number(m.mes.split('-')[1])] += m.media
        // })

        const custoPorMesManutencaoCtx = document.getElementById('custo-mes-manutencao').getContext('2d')

        // const gradientCarga = custoPorMesManutencaoCtx.createLinearGradient(0, 0, 0, 450);

        // gradientCarga.addColorStop(0, 'rgba(255, 99, 132, 1)');
        // gradientCarga.addColorStop(0.5, 'rgba(255, 99, 132, 0.5)');
        // gradientCarga.addColorStop(1, 'rgba(255, 99, 132, 0)');

        // const gradientVendas = custoPorMesManutencaoCtx.createLinearGradient(0, 0, 0, 450);

        // gradientVendas.addColorStop(0, 'rgba(255, 206, 86, 1)');
        // gradientVendas.addColorStop(0.5, 'rgba(255, 206, 86, 0.5)');
        // gradientVendas.addColorStop(1, 'rgba(255, 206, 86, 0)');

        // const gradientVisita = custoPorMesManutencaoCtx.createLinearGradient(0, 0, 0, 450);

        // gradientVisita.addColorStop(0, 'rgba(54, 162, 235, 1)');
        // gradientVisita.addColorStop(0.5, 'rgba(54, 162, 235, 0.5)');
        // gradientVisita.addColorStop(1, 'rgba(54, 162, 235, 0)');

        if (!custoPorMesManutencaoChart.limpo) {
            custoPorMesManutencaoChart.destroy()
        }

        console.log(mediaMesCarga)

        custoPorMesManutencaoChart = new Chart(custoPorMesManutencaoCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                datasets: [
                    {
                        label: 'Carga',
                        data: mediaMesCarga,
                        fill: false,
                        backgroundColor: 'rgba(255, 99, 132)',
                        borderColor: 'rgba(255, 99, 132)',
                        tension: 0.1
                      },
                      {
                        label: 'Vendas',
                        data: mediaMesVendas,
                        fill: false,
                        borderColor: 'rgba(255, 206, 86)',
                        backgroundColor: 'rgba(255, 206, 86)',
                        tension: 0.1
                      },
                      {
                        label: 'Visita',
                        data: mediaMesVisita,
                        fill: false,
                        borderColor: 'rgba(54, 162, 235)',
                        backgroundColor: 'rgba(54, 162, 235)',
                        tension: 0.1
                      }
                ]
            },
            options: {
                responsive: true,
                aspectRatio: 5 / 2
            }
        })


        const freqManMesCarga = contarManutencoesPorMes(response, 'carga')
        const freqManMesVendas = contarManutencoesPorMes(response, 'vendas')
        const freqManMesVisita = contarManutencoesPorMes(response, 'visita')
        const freqPorMesManutencaoCtx = document.getElementById('freq-mes-manutencao').getContext('2d')

        console.log(freqManMesCarga)

        if (!freqPorMesManutencaoChart.limpo) {
            freqPorMesManutencaoChart.destroy()
        }

        freqPorMesManutencaoChart = new Chart(freqPorMesManutencaoCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                datasets: [
                    {
                        label: 'Carga',
                        data: freqManMesCarga,
                        fill: false,
                        backgroundColor: 'rgba(255, 99, 132)',
                        borderColor: 'rgba(255, 99, 132)',
                        tension: 0.1
                      },
                      {
                        label: 'Vendas',
                        data: freqManMesVendas,
                        fill: false,
                        borderColor: 'rgba(255, 206, 86)',
                        backgroundColor: 'rgba(255, 206, 86)',
                        tension: 0.1
                      },
                      {
                        label: 'Visita',
                        data: freqManMesVisita,
                        fill: false,
                        borderColor: 'rgba(54, 162, 235)',
                        backgroundColor: 'rgba(54, 162, 235)',
                        tension: 0.1
                      }
                ]
            },
            options: {
                responsive: true,
                aspectRatio: 5 / 2,
                scales: {
                    y: {
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        })
    })
    .catch(err => console.error(err));
}

function carregarOperacoes() {
    const options = {method: 'GET'};

    fetch('http://localhost:3000/agrotech/operacoes', options)
    .then(response => response.json())
    .then(response => {
        document.getElementById('veicOpTableBody').innerHTML = ""
        filterOpChange()
        let uinfo = window.localStorage.getItem('@uinfo')
            if (uinfo == null) {
                window.location.href = "../login/index.html"
            }else{
                uinfo = JSON.parse(uinfo)
                
            }

        response.forEach(o => {
            
            let model = document.querySelector('.modeloGeraOp').cloneNode(true)

            model.querySelector('#goPlaca').innerHTML = o.veiculo.placa
            model.querySelector('#goDesc').innerHTML = o.descricao
            model.querySelector('#goDataIni').innerHTML = new Date(o.data_saida).toLocaleString('pt-br')
            model.querySelector('#goDataFim').innerHTML = o.data_retorno == undefined ? '-' : new Date(o.data_retorno).toLocaleString('pt-br')
            model.querySelector('#goNome').innerHTML = o.motorista.nome
            model.classList.remove('escondido')
            model.setAttribute('vid', o.veiculo.id)
            model.setAttribute('mid', o.motorista.id)
            model.id = "o" + o.id
            model.setAttribute('aberto', o.data_retorno == null)
            if (uinfo.tipo == 'funcionario') {
                model.removeAttribute('onclick')   
            }
            document.querySelector('#opGeral').querySelector('.table-body').appendChild(model)

            if (o.data_retorno == null) {
                model.querySelector('.btnFinalizarGeral').classList.remove('escondido')
                let tr = document.createElement('tr')
                let placa = document.createElement('td')
                let tipo = document.createElement('td')
                let desc = document.createElement('td')
                let inicio = document.createElement('td')
                let fim = document.createElement('td')
                let motor = document.createElement('td')
    
                placa.innerHTML = o.veiculo.placa
                tipo.innerHTML = o.veiculo.tipo.slice(0,1).toUpperCase() + o.veiculo.tipo.slice(1)
                desc.innerHTML = o.descricao
                inicio.innerHTML = new Date(o.data_saida).toLocaleString('pt-br')
                fim.innerHTML = o.data_retorno !== null ? new Date(o.data_retorno).toLocaleString('pt-br') : '-'
                motor.innerHTML = o.motorista.nome
    
                tr.append(placa, tipo, desc, inicio, fim, motor)
    
                document.getElementById('veicOpTableBody').appendChild(tr)
            }
        })

        mediaHorasOpMot(response)

        // gerar gráfico de frequência de manutenções por tipo de veículo
        const freqOp = {};
        response.forEach(op => {
        const tipoVeiculo = op.veiculo.tipo;
        if (!freqOp[tipoVeiculo]) {
            freqOp[tipoVeiculo] = 1;
        } else {
            freqOp[tipoVeiculo]++;
        }
        });

        const labelsFreq = Object.keys(freqOp).map(k => k = k.slice(0,1).toUpperCase() + k.slice(1));
        const dataFreq = Object.values(freqOp);
        document.querySelector('#sum-value-op').innerHTML = response.length

        console.log(labelsFreq, dataFreq)
        
        if (!graficoFreqOp.limpo) {
            graficoFreqOp.destroy()
        }

        graficoFreqOp = new Chart(document.getElementById('grafico-freq-op'), {
        type: 'doughnut',
        data: {
            labels: labelsFreq,
            datasets: [{
            label: 'Frequência de Operações',
            data: dataFreq,
            backgroundColor: [
                'rgba(255, 99, 132)',
                'rgba(54, 162, 235)',
                'rgba(255, 206, 86)'
            ],
            borderColor: 'white',
            borderWidth: 1
            }]
        },
        options: {
            cutout: '70%',
            plugins: {
                legend: {
                    display: false
                }
            },
            spacing: 1
        }
        });

        // ... código anterior

        const dadosPreparados = prepararDadosParaDashboardOp(response)

        // Calcula o tempo médio de manutenção por tipo de veículo
        const tempoMedioOperacaoCarga = calcularTempoMedioOperacao(dadosPreparados.operacoesCarga, "carga");
        const tempoMedioOperacaoVendas = calcularTempoMedioOperacao(dadosPreparados.operacoesVendas, "vendas");
        const tempoMedioOperacaoVisita = calcularTempoMedioOperacao(dadosPreparados.operacoesVisita, "visita");


        // Cria o gráfico de tempo médio de manutenções por tipo de veículo
        const mediaHorasOpMotCtx = document.getElementById('med-horas-op').getContext('2d');
        
        if (!mediaHorasOpMotChart.limpo) {
            mediaHorasOpMotChart.destroy()
        }

        const dadosMediaHorasOpMot = mediaHorasOpMot(response)

        var COLORS = interpolateColors(dadosMediaHorasOpMot.mediaHoras.length, d3.interpolateInferno, {
            colorStart: 0,
            colorEnd: 1,
            useEndAsStart: false,
          })

        mediaHorasOpMotChart = new Chart(mediaHorasOpMotCtx, {
            type: 'bar',
            data: {
                labels: dadosMediaHorasOpMot.motoristasDiferentes,
                datasets: [{
                    label: 'Tempo Médio de Operação (dias)',
                    data: dadosMediaHorasOpMot.mediaHoras,
                    backgroundColor: COLORS,
                    borderColor: 'white',
                    borderWidth: 1
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });

        const nOpMot = nOpMotTipo(response)

        console.log(nOpMot)

        if (!graficoOpMot.limpo) {
            graficoOpMot.destroy()
        }

        graficoOpMot = new Chart(document.getElementById('grafico-op-mot'), {
        type: 'bar',
        data: {
            labels: dadosMediaHorasOpMot.motoristasDiferentes,
            datasets: [
                {
                    label: 'Operações de Carga',
                    data: nOpMot.carga,
                    backgroundColor: 'rgba(255, 99, 132)',
                    borderColor: 'white',
                    borderWidth: 1
                },
                {
                    label: 'Operações de Visita',
                    data: nOpMot.visita,
                    backgroundColor: 'rgba(54, 162, 235)',
                    borderColor: 'white',
                    borderWidth: 1
                },
                {
                    label: 'Operações de Vendas',
                    data: nOpMot.vendas,
                    backgroundColor: 'rgba(255, 206, 86)',
                    borderColor: 'white',
                    borderWidth: 1
                }
            ]
        },
        options: {
            plugins: {
              title: {
                display: false,
              },
              legend: {
                display: false
              }
            },
            responsive: true,
            scales: {
              x: {
                stacked: true,
              },
              y: {
                stacked: true,
                ticks:{
                    stepSize: 1
                }
              }
            }
          }
        });

        const tempoMedioOperacaoCtx = document.getElementById('tempo-medio-op').getContext('2d');

        if (!tempoMedioOperacaoChart.limpo) {
            tempoMedioOperacaoChart.destroy()
        }

        tempoMedioOperacaoChart = new Chart(tempoMedioOperacaoCtx, {
            type: 'bar',
            data: {
                labels: ['Carga', 'Visita', 'Vendas'],
                datasets: [{
                    label: 'Tempo Médio de Operação (dias)',
                    data: [tempoMedioOperacaoCarga, tempoMedioOperacaoVendas, tempoMedioOperacaoVisita],
                    backgroundColor: [
                        'rgba(255, 99, 132)',
                        'rgba(54, 162, 235)',
                        'rgba(255, 206, 86)'
                    ],
                    borderColor: 'white',
                    borderWidth: 1
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    })
    .catch(err => console.error(err));
}

// Função para agrupar manutenções por tipo de veículo
function agruparManutencoesPorTipoVeiculo(manutencoes) {
    const agrupado = manutencoes.reduce((obj, manutencao) => {
      const tipo = manutencao.veiculo.tipo;
      if (!obj[tipo]) {
        obj[tipo] = [];
      }
      obj[tipo].push(manutencao);
      return obj;
    }, {});
  
    return agrupado;
  }
  
  // Função para calcular a frequência média de manutenção por tipo de veículo
  function calcularFrequenciaMediaManutencaoPorTipoVeiculo(manutencoesAgrupadasPorTipoVeiculo) {
    const frequencias = {};
    for (const tipo in manutencoesAgrupadasPorTipoVeiculo) {
      const manutencoes = manutencoesAgrupadasPorTipoVeiculo[tipo];
      const intervalos = [];
      for (let i = 1; i < manutencoes.length; i++) {
        const dataAnterior = new Date(manutencoes[i - 1].data_inicio);
        const dataAtual = new Date(manutencoes[i].data_inicio);
        const intervaloEmDias = (dataAtual - dataAnterior) / (1000 * 60 * 60 * 24);
        intervalos.push(intervaloEmDias);
      }
      const frequenciaMedia = intervalos.reduce((acc, intervalo) => acc + intervalo, 0) / intervalos.length;
      frequencias[tipo] = frequenciaMedia.toFixed(2);
    }
    return frequencias;
  }

  function calcularCustoMedioManutencaoPorTipoVeiculo(dadosManutencoes) {
    const custoTotal = { carga: 0, venda: 0, visita: 0 };
    const qtdManutencoes = { carga: 0, venda: 0, visita: 0 };
  
    dadosManutencoes.forEach((manutencao) => {
      const tipoVeiculo = manutencao.veiculo.tipo;
      custoTotal[tipoVeiculo] += manutencao.valor;
      qtdManutencoes[tipoVeiculo] += 1;
    });
  
    const custoMedio = {
      carga: custoTotal.carga / qtdManutencoes.carga || 0,
      venda: custoTotal.venda / qtdManutencoes.venda || 0,
      visita: custoTotal.visita / qtdManutencoes.visita || 0,
    };
  
    return custoMedio;
  }


  function calcularTempoMedioManutencao(manutencoes, tipoVeiculo) {
    // Filtra as manutenções pelo tipo de veículo
    const manutencoesFiltradas = manutencoes.filter(
      (manutencao) => manutencao.veiculo.tipo === tipoVeiculo
    );
  
    if (manutencoesFiltradas.length === 0) {
      return 0;
    }
  
    // Calcula o tempo total de manutenção em minutos
    const tempoTotalManutencao = manutencoesFiltradas.reduce((total, manutencao) => {
      const dataInicio = new Date(manutencao.data_inicio);
      const dataFim = manutencao.data_fim ? new Date(manutencao.data_fim) : new Date();

    let diferenca = Math.ceil((dataFim - dataInicio) / 86400000)
      return total + diferenca
    }, 0);

    // Calcula o tempo médio de manutenção em minutos
    const tempoMedioManutencao = tempoTotalManutencao / manutencoesFiltradas.length;
    
  
    return tempoMedioManutencao;
  }

  function calcularTempoMedioOperacao(operacoes, tipoVeiculo) {
    // Filtra as manutenções pelo tipo de veículo
    const operacoesFiltradas = operacoes.filter(
      (operacao) => operacao.veiculo.tipo === tipoVeiculo
    );
  
    if (operacoesFiltradas.length === 0) {
      return 0;
    }
  
    // Calcula o tempo total de manutenção em minutos
    const tempoTotalOperacao = operacoesFiltradas.reduce((total, operacao) => {
      const dataInicio = new Date(operacao.data_saida);
      const dataFim = operacao.data_retorno ? new Date(operacao.data_retorno) : new Date();
      console.log(dataInicio, dataFim)

    let diferenca = Math.ceil((dataFim - dataInicio) / 86400000)
      return total + diferenca
    }, 0);

    // Calcula o tempo médio de manutenção em minutos
    const tempoMedioOperacao = tempoTotalOperacao / operacoesFiltradas.length;
    
  
    return Math.ceil(tempoMedioOperacao);
  }
  

  function prepararDadosParaDashboard(manutencoes) {
    const manutencoesCarga = manutencoes.filter((manutencao) => manutencao.veiculo.tipo === 'carga');
    const manutencoesVendas = manutencoes.filter((manutencao) => manutencao.veiculo.tipo === 'vendas');
    const manutencoesVisita = manutencoes.filter((manutencao) => manutencao.veiculo.tipo === 'visita');
  
    const custoMedioManutencaoPorTipoVeiculo = {
      carga: calcularCustoMedioManutencaoPorTipoVeiculo(manutencoesCarga),
      vendas: calcularCustoMedioManutencaoPorTipoVeiculo(manutencoesVendas),
      visita: calcularCustoMedioManutencaoPorTipoVeiculo(manutencoesVisita),
    };
  
    const tempoMedioManutencaoPorTipoVeiculo = {
      carga: calcularTempoMedioManutencao(manutencoesCarga),
      vendas: calcularTempoMedioManutencao(manutencoesVendas),
      visita: calcularTempoMedioManutencao(manutencoesVisita),
    };
  
    return {
      custoMedioManutencaoPorTipoVeiculo,
      tempoMedioManutencaoPorTipoVeiculo,
      manutencoesCarga,
      manutencoesVendas,
      manutencoesVisita,
    };
  }
  
  function separarMediaManutencaoPorMes(manutencoes, tipoVeiculo) {
    const manutencoesFiltradas = manutencoes.filter(m => m.veiculo.tipo === tipoVeiculo);
    const manutencoesPorMes = [0,0,0,0,0,0,0,0,0,0,0,0];
    const mediaPorMes = {};
        
  
    for (let manutencao of manutencoesFiltradas) {
        const dataDaManutencao = new Date(manutencao.data_inicio);
        const mesDaManutencao = dataDaManutencao.getMonth();
        manutencoesPorMes[mesDaManutencao] += manutencao.valor;
    }
    
    return manutencoesPorMes;
  }

  function contarManutencoesPorMes(listaDeManutencoes, tipoDeVeiculo) {
    const manutencoesPorMes = [0,0,0,0,0,0,0,0,0,0,0,0];
  
    for (let manutencao of listaDeManutencoes) {
      if (manutencao.veiculo.tipo === tipoDeVeiculo) {
        const dataDaManutencao = new Date(manutencao.data_inicio);
        const mesDaManutencao = dataDaManutencao.getMonth();
        manutencoesPorMes[mesDaManutencao]++;
      }
    }
  
    return manutencoesPorMes;
  }
  

function toggleModalEditMan(card) {
    if (card.id !== undefined) {
        document.querySelector('.modal-edit-man').querySelector('#inpVeic').value = card.getAttribute('vid')
        document.querySelector('.modal-edit-man').querySelector('#inpDesc').value = card.querySelector('#gmDesc').innerHTML
        document.querySelector('.modal-edit-man').querySelector('#inpValor').value = parseFloat(card.querySelector('#gmValor').innerHTML.slice(3).replace(',','.'))
        document.querySelector('.modal-edit-man').querySelector('#inpId').value = card.id.slice(1)
        document.querySelector('.modal-edit-man').querySelector('#inpIdVeic').value = card.getAttribute('vid')
        if (card.querySelector('#gmDataFim').innerHTML == "-") {
            document.querySelector('.modal-edit-man').querySelector('#inpVeic').setAttribute('disabled', true)
        } else {
            document.querySelector('.modal-edit-man').querySelector('#inpVeic').removeAttribute('disabled')
        }
    } else {
        document.querySelector('.modal-edit-man').querySelector('#inpDesc').value = ""
        document.querySelector('.modal-edit-man').querySelector('#inpValor').value = ""
    }
    document.querySelector('.modal-edit-man').classList.toggle('escondido')
    document.body.style.overflow = 'hidden'
}

function flip(el, ev) {
    
    if (ev.target.parentNode.classList.contains('man-info') || ev.target.parentNode.classList.contains('op-info') || ev.target.classList.contains('row-options')) {
        const has = el.classList.contains('flip')
        el.parentNode.querySelectorAll(".flip").forEach(m => m.classList.remove('flip'))
        if (!has) {
            el.classList.add('flip')
        }
    }
    
}

function finishMan(id, vid) {
    const options = {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: `{"id":${id.slice(1)}, "id_veiculo":${vid}}`};

    fetch('http://localhost:3000/agrotech/manutencoes/finalizar', options)
    .then(response => response.json())
    .then(response => {
        let modelo = document.querySelector('.main-manutencoes').querySelector('.table-body').querySelector('.modeloGeraMan').cloneNode(true)
            document.querySelector('.main-manutencoes').querySelector('.table-body').innerHTML = ""
            document.querySelector('.main-manutencoes').querySelector('.table-body').appendChild(modelo)
            carregarManutencoes()

            let modeloV = document.querySelector('.main-veiculos').querySelector('.table-body').querySelector('.modeloVeicGeral').cloneNode(true)
            document.querySelector('.main-veiculos').querySelector('.table-body').innerHTML = ""
            document.querySelector('.main-veiculos').querySelector('.table-body').appendChild(modeloV)
            carregarVeiculos()
    })
    .catch(err => console.error(err));
}

function editMan() {
    let id_veiculo = document.querySelector('.modal-edit-man').querySelector('#inpVeic').value
    let descricao = document.querySelector('.modal-edit-man').querySelector('#inpDesc').value
    let valor = document.querySelector('.modal-edit-man').querySelector('#inpValor').value
    let id = document.querySelector('.modal-edit-man').querySelector('#inpId').value

    

    const options = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id, descricao, valor, id_veiculo})
      };
      
      fetch('http://localhost:3000/agrotech/manutencoes', options)
        .then(response => response.json())
        .then(response => {
            let modelo = document.querySelector('.main-manutencoes').querySelector('.table-body').querySelector('.modeloGeraMan').cloneNode(true)
            document.querySelector('.main-manutencoes').querySelector('.table-body').innerHTML = ""
            document.querySelector('.main-manutencoes').querySelector('.table-body').appendChild(modelo)
            carregarManutencoes()

            let modeloV = document.querySelector('.main-veiculos').querySelector('.table-body').querySelector('.modeloVeicGeral').cloneNode(true)
            document.querySelector('.main-veiculos').querySelector('.table-body').innerHTML = ""
            document.querySelector('.main-veiculos').querySelector('.table-body').appendChild(modeloV)
            carregarVeiculos()

            toggleModalEditMan({})
        })
        .catch(err => console.error(err));
}

function toggleModalCreateMan() {
    document.querySelector('.modal-create-man').querySelectorAll('input').forEach(i => i.value = i.type !== 'number' ? "" : 0)
    document.querySelector('.modal-create-man').classList.toggle('escondido')
}

function cadastrarMan() {
    let id_veiculo = Number(document.querySelector('.modal-create-man').querySelector('#inpVeic').value)
    let descricao = document.querySelector('.modal-create-man').querySelector('#inpDesc').value
    let valor = Number(document.querySelector('.modal-create-man').querySelector('#inpValor').value)    
    let data_inicio = new Date().toISOString()

    if (descricao.length > 0) {
        const options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify([{id_veiculo, descricao, valor, data_inicio}])
          };
          
          fetch('http://localhost:3000/agrotech/manutencoes', options)
            .then(response => response.json())
            .then(response => {
                if (response.count !== null) {
                    let modelo = document.querySelector('.main-manutencoes').querySelector('.table-body').querySelector('.modeloGeraMan').cloneNode(true)
                    document.querySelector('.main-manutencoes').querySelector('.table-body').innerHTML = ""
                    document.querySelector('.main-manutencoes').querySelector('.table-body').appendChild(modelo)
                    carregarManutencoes()

                    let modeloV = document.querySelector('.main-veiculos').querySelector('.table-body').querySelector('.modeloVeicGeral').cloneNode(true)
                    document.querySelector('.main-veiculos').querySelector('.table-body').innerHTML = ""
                    document.querySelector('.main-veiculos').querySelector('.table-body').appendChild(modeloV)
                    carregarVeiculos()

                    toggleModalCreateMan()
                }
            })
            .catch(err => console.error(err));
    }
}

function excluirMan() {
    const id = document.querySelector('.modal-edit-man').querySelector('#inpId').value
    const id_veiculo = document.querySelector('.modal-edit-man').querySelector('#inpIdVeic').value
    const options = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: `{"id":${id}, "id_veiculo": ${id_veiculo}}`
      };
      
      fetch('http://localhost:3000/agrotech/manutencoes', options)
        .then(response => response.json())
        .then(response => {
            if (response.id !== null) {
                let modelo = document.querySelector('.main-manutencoes').querySelector('.table-body').querySelector('.modeloGeraMan').cloneNode(true)
                document.querySelector('.main-manutencoes').querySelector('.table-body').innerHTML = ""
                document.querySelector('.main-manutencoes').querySelector('.table-body').appendChild(modelo)
                carregarManutencoes()

                let modeloV = document.querySelector('.main-veiculos').querySelector('.table-body').querySelector('.modeloVeicGeral').cloneNode(true)
                document.querySelector('.main-veiculos').querySelector('.table-body').innerHTML = ""
                document.querySelector('.main-veiculos').querySelector('.table-body').appendChild(modeloV)
                carregarVeiculos()

                toggleModalEditMan({})
            }
        })
        .catch(err => console.error(err));
}

function toggleModalEditOp(card) {
    if (card.id !== undefined) {
        document.querySelector('.modal-edit-op').querySelector('#inpIdVeic').value = card.getAttribute('vid')
        document.querySelector('.modal-edit-op').querySelector('#inpVeic').value = card.getAttribute('vid')
        document.querySelector('.modal-edit-op').querySelector('#inpIdMot').value = card.getAttribute('mid')
        document.querySelector('.modal-edit-op').querySelector('#inpMot').value = card.getAttribute('mid')
        document.querySelector('.modal-edit-op').querySelector('#inpDesc').value = card.querySelector('#goDesc').innerHTML
        document.querySelector('.modal-edit-op').querySelector('#inpId').value = card.id.slice(1)
        if (card.querySelector('#goDataFim').innerHTML == "-") {
            document.querySelector('.modal-edit-op').querySelector('#inpVeic').setAttribute('disabled', true)
            document.querySelector('.modal-edit-op').querySelector('#inpMot').setAttribute('disabled', true)
        } else {
            document.querySelector('.modal-edit-op').querySelector('#inpVeic').removeAttribute('disabled')
            document.querySelector('.modal-edit-op').querySelector('#inpMot').removeAttribute('disabled')
        }
    } else {
        document.querySelector('.modal-edit-op').querySelector('#inpDesc').value = ""
    }
    document.querySelector('.modal-edit-op').classList.toggle('escondido')
    document.body.style.overflow = 'hidden'
}

function editOp() {
    let id_veiculo = document.querySelector('.modal-edit-op').querySelector('#inpVeic').value
    let id_motorista = document.querySelector('.modal-edit-op').querySelector('#inpMot').value
    let descricao = document.querySelector('.modal-edit-op').querySelector('#inpDesc').value
    let id = document.querySelector('.modal-edit-op').querySelector('#inpId').value

    const options = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id_veiculo, id_motorista, descricao, id})
      };
      
      fetch('http://localhost:3000/agrotech/operacoes', options)
        .then(response => response.json())
        .then(response => {
            let modelo = document.querySelector('.main-operacoes').querySelector('.table-body').querySelector('.modeloGeraOp').cloneNode(true)
            document.querySelector('.main-operacoes').querySelector('.table-body').innerHTML = ""
            document.querySelector('.main-operacoes').querySelector('.table-body').appendChild(modelo)
            carregarOperacoes()

            let modeloV = document.querySelector('.main-veiculos').querySelector('.table-body').querySelector('.modeloVeicGeral').cloneNode(true)
            document.querySelector('.main-veiculos').querySelector('.table-body').innerHTML = ""
            document.querySelector('.main-veiculos').querySelector('.table-body').appendChild(modeloV)
            carregarVeiculos()

            let modeloM = document.querySelector('.main-motoristas').querySelector('.page-motoristas').querySelector('.card-motorista').cloneNode(true)
            document.querySelector('.main-motoristas').querySelector('.page-motoristas').innerHTML = ""
            document.querySelector('.main-motoristas').querySelector('.page-motoristas').appendChild(modeloM)
            carregarMotoristas()

            toggleModalEditOp({})
        })
        .catch(err => console.error(err));
}

function toggleModalCreateOp() {
    document.querySelector('.modal-create-op').querySelectorAll('input').forEach(i => i.value = i.type !== 'number' ? "" : 0)
    document.querySelector('.modal-create-op').classList.toggle('escondido')
}

function cadastrarOp() {
    let id_veiculo = Number(document.querySelector('.modal-create-op').querySelector('#inpVeic').value)
    let id_motorista = Number(document.querySelector('.modal-create-op').querySelector('#inpMot').value)
    let descricao = document.querySelector('.modal-create-op').querySelector('#inpDesc').value

    if (descricao.length > 0) {
        const options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify([{id_veiculo, descricao, id_motorista}])
          };
          
          fetch('http://localhost:3000/agrotech/operacoes', options)
            .then(response => response.json())
            .then(response => {
                if (response.count !== null) {
                    let modelo = document.querySelector('.main-operacoes').querySelector('.table-body').querySelector('.modeloGeraOp').cloneNode(true)
                    document.querySelector('.main-operacoes').querySelector('.table-body').innerHTML = ""
                    document.querySelector('.main-operacoes').querySelector('.table-body').appendChild(modelo)
                    carregarOperacoes()

                    let modeloV = document.querySelector('.main-veiculos').querySelector('.table-body').querySelector('.modeloVeicGeral').cloneNode(true)
                    document.querySelector('.main-veiculos').querySelector('.table-body').innerHTML = ""
                    document.querySelector('.main-veiculos').querySelector('.table-body').appendChild(modeloV)
                    carregarVeiculos()

                    let modeloM = document.querySelector('.main-motoristas').querySelector('.page-motoristas').querySelector('.card-motorista').cloneNode(true)
                    document.querySelector('.main-motoristas').querySelector('.page-motoristas').innerHTML = ""
                    document.querySelector('.main-motoristas').querySelector('.page-motoristas').appendChild(modeloM)
                    carregarMotoristas()

                    toggleModalCreateOp()
                }
            })
            .catch(err => console.error(err));
    }
}

function finishOp(id, vid, mid) {
    const options = {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: `{"id":${id.slice(1)}, "id_veiculo": ${vid}, "id_motorista": ${mid}}`};

    fetch('http://localhost:3000/agrotech/operacoes/finalizar', options)
    .then(response => response.json())
    .then(response => {
        let modelo = document.querySelector('.main-operacoes').querySelector('.table-body').querySelector('.modeloGeraOp').cloneNode(true)
        document.querySelector('.main-operacoes').querySelector('.table-body').innerHTML = ""
        document.querySelector('.main-operacoes').querySelector('.table-body').appendChild(modelo)
        carregarOperacoes()

        let modeloV = document.querySelector('.main-veiculos').querySelector('.table-body').querySelector('.modeloVeicGeral').cloneNode(true)
        document.querySelector('.main-veiculos').querySelector('.table-body').innerHTML = ""
        document.querySelector('.main-veiculos').querySelector('.table-body').appendChild(modeloV)
        carregarVeiculos()

        let modeloM = document.querySelector('.main-motoristas').querySelector('.page-motoristas').querySelector('.card-motorista').cloneNode(true)
        document.querySelector('.main-motoristas').querySelector('.page-motoristas').innerHTML = ""
        document.querySelector('.main-motoristas').querySelector('.page-motoristas').appendChild(modeloM)
        carregarMotoristas()
    })
    .catch(err => console.error(err));
}

function excluirOp() {
    const id = document.querySelector('.modal-edit-op').querySelector('#inpId').value
    const id_veiculo = document.querySelector('.modal-edit-op').querySelector('#inpIdVeic').value
    const id_motorista = document.querySelector('.modal-edit-op').querySelector('#inpIdMot').value
    const options = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: `{"id":${id}, "id_veiculo": ${id_veiculo}, "id_motorista": ${id_motorista}}`
      };
      
      fetch('http://localhost:3000/agrotech/operacoes', options)
        .then(response => response.json())
        .then(response => {
            if (response.id !== null) {
                let modelo = document.querySelector('.main-operacoes').querySelector('.table-body').querySelector('.modeloGeraOp').cloneNode(true)
                document.querySelector('.main-operacoes').querySelector('.table-body').innerHTML = ""
                document.querySelector('.main-operacoes').querySelector('.table-body').appendChild(modelo)
                carregarOperacoes()

                let modeloV = document.querySelector('.main-veiculos').querySelector('.table-body').querySelector('.modeloVeicGeral').cloneNode(true)
                document.querySelector('.main-veiculos').querySelector('.table-body').innerHTML = ""
                document.querySelector('.main-veiculos').querySelector('.table-body').appendChild(modeloV)
                carregarVeiculos()

                let modeloM = document.querySelector('.main-motoristas').querySelector('.page-motoristas').querySelector('.card-motorista').cloneNode(true)
                document.querySelector('.main-motoristas').querySelector('.page-motoristas').innerHTML = ""
                document.querySelector('.main-motoristas').querySelector('.page-motoristas').appendChild(modeloM)
                carregarMotoristas()

                toggleModalEditOp({})
            }
        })
        .catch(err => console.error(err));
}

function prepararDadosParaDashboardOp(operacoes) {
    const operacoesCarga = operacoes.filter((operacao) => operacao.veiculo.tipo === 'carga');
    const operacoesVendas = operacoes.filter((operacao) => operacao.veiculo.tipo === 'vendas');
    const operacoesVisita = operacoes.filter((operacao) => operacao.veiculo.tipo === 'visita');

    const tempoMedioOperacaoPorTipoVeiculo = {
      carga: calcularTempoMedioOperacao(operacoesCarga, 'carga'),
      vendas: calcularTempoMedioOperacao(operacoesVendas, 'vendas'),
      visita: calcularTempoMedioOperacao(operacoesVisita, 'visita'),
    };
  
    return {
      tempoMedioOperacaoPorTipoVeiculo,
      operacoesCarga,
      operacoesVendas,
      operacoesVisita,
    };
  }

  function mediaHorasOpMot(operacoes) {
    const mapeamentoMotoristas = {};
    const mediaHoras = []
    const idDiferentes = []
    const motoristasDiferentes = operacoes.reduce((acc, viagem) => {
    const { id, nome } = viagem.motorista;
    if (!mapeamentoMotoristas[id]) {
        mapeamentoMotoristas[id] = nome.split(' ')[0] + " " + nome.split(' ').at(-1).slice(0, 1) + ".";
        acc.push(nome.split(' ')[0] + " " + nome.split(' ').at(-1).slice(0, 1) + ".");
        mediaHoras.push(0)
        idDiferentes.push(id)
    }
    return acc;
    }, []);

    idDiferentes.forEach((m, index) => {
        let med = 0
        let nop = 0
        operacoes.forEach(o => {
            if (m == o.motorista.id) {
                const dataInicio = new Date(o.data_saida);
                const dataFim = o.data_retorno ? new Date(o.data_retorno) : new Date();
                let diferenca = (dataFim - dataInicio) / 3600000
                med += diferenca
                nop++
            }
        })

        med = (med/nop).toFixed(2)
        mediaHoras[index] = Number(med)
    })

    return {
        mediaHoras,
        motoristasDiferentes
    }
  }

  function calculatePoint(i, intervalSize, colorRangeInfo) {
    var { colorStart, colorEnd, useEndAsStart } = colorRangeInfo;
    return (useEndAsStart
      ? (colorEnd - (i * intervalSize))
      : (colorStart + (i * intervalSize)));
  }

  function interpolateColors(dataLength, colorScale, colorRangeInfo) {
    var { colorStart, colorEnd } = colorRangeInfo;
    var colorRange = colorEnd - colorStart;
    var intervalSize = colorRange / dataLength;
    var i, colorPoint;
    var colorArray = [];
  
    for (i = 0; i < dataLength; i++) {
      colorPoint = calculatePoint(i, intervalSize, colorRangeInfo);
      colorArray.push(colorScale(colorPoint));
    }
  
    return colorArray;
  }  


  function nOpMotTipo(operacoes) {
    const mapeamentoMotoristas = {};
    const nOp = {
        'carga': [],
        'visita': [],
        'vendas': []
    }
    const idDiferentes = []
    const motoristasDiferentes = operacoes.reduce((acc, viagem) => {
    const { id, nome } = viagem.motorista;
    if (!mapeamentoMotoristas[id]) {
        mapeamentoMotoristas[id] = nome.split(' ')[0] + " " + nome.split(' ').at(-1).slice(0, 1) + ".";
        acc.push(nome.split(' ')[0] + " " + nome.split(' ').at(-1).slice(0, 1) + ".");
        nOp.carga.push(0)
        nOp.visita.push(0)
        nOp.vendas.push(0)
        idDiferentes.push(id)
    }
    return acc;
    }, []);

    idDiferentes.forEach((m, index) => {
        operacoes.forEach(o => {
            if (m == o.motorista.id) {
                nOp[o.veiculo.tipo][index]++
            }
        })
    })
    return nOp
  }