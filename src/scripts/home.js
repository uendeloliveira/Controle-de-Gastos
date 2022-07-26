firebase.auth().onAuthStateChanged(user => {
    if (!user) {
        location.href = "/Controle-de-Gastos/"
    }
    return findTransactions(user);
})
function logout () {
    firebase.auth().signOut().then(() =>{
        location.href = "/Controle-de-Gastos/"
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
            transactions = snapshot.docs.map(doc => ({
                ...doc.data(),
                uid: doc.id
            }));
    PegarData = document.getElementById('findTransactionsButton')
    firstDate = document.getElementById('firstDate')
    lastDate = document.getElementById('lastDate')
    PegarData.addEventListener('click', () => {
        primeiraData = firstDate.value
        segundaData = lastDate.value
        
        const newTransactionsResult = transactions.filter(setData => 
            setData.date >= primeiraData && setData.date <= segundaData
            )
            
        addTransactionsToScreen(newTransactionsResult);
        const income = document.getElementById('income');
        const expense = document.getElementById('expense');
        const result = document.getElementById('balance');
        const pegarIncome = document.querySelectorAll('li.income p:nth-child(3)');
        const pegarExpense = document.querySelectorAll('li.expense p:nth-child(3)');
        var somaIncome = 0;
        var somaExpense = 0;
        for (var i = 0; i<pegarIncome.length; i++){
            somaIncome += parseFloat(pegarIncome[i].innerHTML)
        }
        for (var i = 0; i<pegarExpense.length; i++){
            somaExpense += parseFloat(pegarExpense[i].innerHTML)
        }
        income.innerHTML = `R$ ` + somaIncome
        expense.innerHTML = `R$ ` + somaExpense
        result.innerHTML = `R$ ` + (somaIncome-somaExpense)
        })
    })

    clean = document.getElementById('clean')
    clean.addEventListener('click', () => {
        location.href = "./home.html"
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
    return `${money.value.toFixed(2)}`
}