const transactionsUl = document.querySelector('#transactions');
const incomeDisplay = document.querySelector('#money-plus');
const expenseDisplay = document.querySelector('#money-minus');
const balanceDisplay = document.querySelector('#balance');
const form = document.querySelector('#form');
const inputTransactionName = document.querySelector('#text');
const inputTransactionAmount = document.querySelector('#amount');
const operatorPlus = document.getElementById("control-plus");
const operatorMinus = document.getElementById("control-minus");


const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null
    ? localStorageTransactions : [];

const removeTransaction = transaction => {
    transactions = transactions.filter(({ id }) => id !== transaction);
    updateLocalStorage();
    init();
}

const addTransactionIntoDOM = ({ id, name, amount }) => {
    const CSSClas = amount > 0 ? 'plus' : 'minus';
    const li = document.createElement('li');

    li.classList.add(CSSClas);
    li.innerHTML = `
    ${name} 
    <span> R$ ${amount.toFixed(2)}</span>
    <button class="delete-btn" onClick="removeTransaction(${id})">x</button>`

    transactionsUl.prepend(li);
}

const sumBalanceValues = (transactionsAmounts, positiveOrNegative) => {
    return `R$ ${transactionsAmounts.filter(item => positiveOrNegative == '+' ? item > 0 : item < 0)
        .reduce((accumulator, number) => accumulator + number, 0)
        .toFixed(2)
        .replace('.', ',')}`;
}

const getTotal = transactionsAmounts => {
    return transactionsAmounts
        .reduce((accumulator, number) => accumulator + number, 0)
        .toFixed(2)
        .replace('.', ',');
}

const updateBalanceValues = () => {
    const transactionsAmounts = transactions.map(({ amount }) => amount);
    const sumTotalTransactionsAmounts = getTotal(transactionsAmounts);

    incomeDisplay.textContent = sumBalanceValues(transactionsAmounts, '+');
    expenseDisplay.textContent = sumBalanceValues(transactionsAmounts, '-');
    balanceDisplay.textContent = `R$ ${sumTotalTransactionsAmounts}`;
}

const init = () => {
    transactionsUl.innerHTML = '';
    transactions.forEach(addTransactionIntoDOM);
    updateBalanceValues();
}

const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

const generateID = () => Math.round(Math.random() * 1000);

const addToTransactionArray = (transactionName, transactionAmount) => {
    transactions.push({
        id: generateID(),
        name: transactionName,
        amount: Number(transactionAmount)
    });
}

const cleanInputs = () => {
    inputTransactionName.value = '';
    inputTransactionAmount.value = '';
    operatorPlus.checked = false;
    operatorMinus.checked = false;
}

const handleFormSubmit = event => {
    event.preventDefault();

    const transactionName = inputTransactionName.value.trim();
    const transactionAmount = operatorPlus.checked
        ? inputTransactionAmount.value.trim()
        : `-${inputTransactionAmount.value.trim()}`;

    addToTransactionArray(transactionName, transactionAmount);


    init();
    updateLocalStorage();
}

form.addEventListener('submit', handleFormSubmit);