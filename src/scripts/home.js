firebase.auth().onAuthStateChanged(user => {
    if (!user) {
        location.href = "/"
    }
    return findTransactions(user);
})

function logout () {
    firebase.auth().signOut().then(() =>{
        location.href = "/"
    }).catch(() => {
        alert('Error ao fazer logout')
    })
}

function newTransaction(){
    location.href = "./transaction.html"
}

function findTransactions(user) {
    firebase.firestore()
        .collection('Transactions')
        .where('user.uid', '==', user.uid)
        .orderBy('date', 'desc')
        .get()
        .then(snapshot => {
            const transactions = snapshot.docs.map(doc => ({
                ...doc.data(),
                uid: doc.id
            }));
            addTransactionsToScreen(transactions);
        })
}

function addTransactionsToScreen(transactions) {
    const orderedList = document.getElementById('transactions');

    transactions.forEach(transaction => {
        const li = document.createElement('li');
        li.classList.add(transaction.type);
        li.id = transaction.uid;

        const deleteButton = document.createElement('button')
        deleteButton.innerHTML = "-";
        deleteButton.classList.add('delete')
        deleteButton.addEventListener('click', event => {
            event.stopPropagation();
            askRemoveTransaction(transaction);
        })
        li.appendChild(deleteButton);

        const date = document.createElement('p');
        date.innerHTML = formatDate(transaction.date);
        li.appendChild(date);

        const money = document.createElement('p');
        money.innerHTML = formatMoney(transaction.money);
        li.appendChild(money);

        const type = document.createElement('p');
        type.innerHTML = transaction.transactionType;
        li.appendChild(type);

        if(transaction.description) {
            const description = document.createElement('p')
            description.innerHTML = transaction.description;
            li.appendChild(description);
        }

        orderedList.appendChild(li);
    });
}

function askRemoveTransaction(transaction) {
    const shouldRemove = confirm('Deseja remover a transação?')
    if (shouldRemove) {
        removeTransaction(transaction);
    }
}
function removeTransaction(transaction) {
    firebase.firestore()
        .collection('Transactions')
        .doc(transaction.uid)
        .delete()
        .then(() => {
            document.getElementById(transaction.uid).remove()
        })
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-br', {timeZone: 'GMT'});
}

function formatMoney(money) {
    return `${money.currency} ${money.value.toFixed(2)}`
}