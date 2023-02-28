function login() {
    let email = document.querySelector('#email').value
    let senha = document.querySelector('#senha').value

    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: `{"email":"${email}","senha":"${senha}"}`
      };
      
      fetch('http://localhost:3000/agrotech/login', options)
        .then(response => response.json())
        .then(response => {
            if (response.erro !== undefined) {
                document.querySelector('.error').innerHTML = response.erro
                document.querySelector('.error').classList.remove('escondido')
            } else {
                document.querySelector('.error').classList.add('escondido')
                localStorage.setItem('@uinfo', JSON.stringify(response))
                if (response.tipo == "gerente") {
                    window.location.href = "../home/index.html"
                } else if (response.tipo == "funcionario") {
                    window.location.href = "../home/index.html"
                } else {
                    window.location.reload()
                }
            }
        })
        .catch(err => console.error(err));
}

setInterval(validarToken, 5000)

function validarToken() {
    let uinfo = window.localStorage.getItem('@uinfo')
        if (uinfo !== null) {
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
                        window.localStorage.removeItem('@uinfo')
                    } else {
                        window.location.href = '../home'
                    }
                })
                .catch(err => console.error(err));
        }
}