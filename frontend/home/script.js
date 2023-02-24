function togglesbi(ev) {
    document.querySelectorAll('.sb-i').forEach(i => {
        i.classList.remove('active')
    })

    ev.classList.add('active')

}

function carregar() {
    carregarMotoristas()
}

function carregarMotoristas() {
    const options = {method: 'GET'};

    fetch('http://localhost:3000/agrotech/motoristas', options)
    .then(response => response.json())
    .then(response => {
        response.forEach(r => {
            let modelo = document.querySelector('.page-motoristas').querySelector('.modelo').cloneNode(true)
            modelo.querySelector('#nome').innerHTML = r.nome
            modelo.querySelector('#cpf').innerHTML = r.cpf
            modelo.querySelector('#cnh').innerHTML = r.cnh
            modelo.querySelector('#disp').innerHTML = r.disponivel ? "Livre" : "Ocupado"
            modelo.querySelector('#nop').innerHTML = r.operacoes.length

            modelo.classList.remove('modelo')

            document.querySelector('.page-motoristas').appendChild(modelo)
        })
    })
    .catch(err => console.error(err));
}