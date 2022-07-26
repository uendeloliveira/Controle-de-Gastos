firebase.auth().onAuthStateChanged(user => {
    if (user) {
        location.href = "./home.html"
    }
})

function login() {

    var loginEmail = document.getElementById('loginEmail').value;
    var loginSenha = document.getElementById('loginPassword').value;

    firebase.auth().signInWithEmailAndPassword(
        loginEmail, loginSenha
    ).then(response => {
        location.href = "./home.html"
    }).catch(error => {
        alert(getErrorMessage(error));
        console.log('erro', error)
    });
}
// function register(){
//     var registerEmail = document.getElementById('registerEmail').value;
//     var registerSenha = document.getElementById('registerPassword').value;

//     firebase.auth().createUserWithEmailAndPassword(
//         registerEmail, registerSenha
//     ).then(() => {
//         location.href = "./login.html"
//     }).catch(error => {
//         alert(getErrorMessage(error))
//     })
// }

function getErrorMessage(error) {
    if (error.code == "auth/user-not-found"){
        return "Usuário não encontrado"
    }
    if (error.code == "auth/invalid-email"){
        return "Email inválido"
    }
    if (error.code == "auth/email-already-in-use"){
        return "O usuário já existe"
    }
    return error.message;
}

function register_page() {
    location.href = "./register.html"
}
function back() {
    location.href = "./login.html"
}
function to_login() {
    location.href = "./src/pages/login.html"
}
function to_register_page() {
    location.href = "./src/pages/register.html"
}