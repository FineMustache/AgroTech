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

                } else {
                    window.location.reload()
                }
            }
        })
        .catch(err => console.error(err));
}