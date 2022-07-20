firebase.auth().onAuthStateChanged(user => {
    if (user) {
        createTransaction()
    } else {
        location.href = "/";
    }
});
function saveTransaction() {
    const transaction  = createTransaction();

    firebase.firestore()
        .collection('Transactions')
        .add(transaction)
        .then(() => {
            location.href = "./home.html"
        })
}
function createTransaction() {
    return {
        type: form.type().checked ? "income" : "expense",
        date: form.date().value,
        money: {
            currency: form.currency().value,
            value: parseFloat(form.value().value)
        },
        transactionType: form.transactionType().value,
        description: form.description().value,
        user: {
            uid: firebase.auth().currentUser.uid
        }
    };
}


const form = {
    type: () => document.getElementById('income'),
    date: () => document.getElementById('date'),
    currency: () => document.getElementById('currency'),
    value: () => document.getElementById('value'),
    transactionType: () => document.getElementById('transactionType'),
    description: () => document.getElementById('description')
}

function back(){
    location.href = './home.html'
}