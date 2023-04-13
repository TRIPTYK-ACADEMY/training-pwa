let incomes = [];
let expenses = [];

// Registering all the event handlers when the page loads
document.addEventListener("DOMContentLoaded", event => {
  getInitialData('income', "listIncomes");
  getInitialData('expense', "listExpenses");

  renderBudgetByType(incomes, 'listIncomes');
  renderBudgetByType(expenses, 'listExpenses');

  document.querySelector("#incomeForm").addEventListener("submit", event => {
    event.preventDefault();
    const income = document.querySelector("#incomeForm input").value;
    if (income.length==0) {
        alert("You didn't input any content");
    } else {
      incomes.push(+income);
      renderBudgetByType(incomes, 'listIncomes');
      save(incomes, 'listIncomes')
      document.querySelector("#incomeForm input").value = "";
    }
  });

  document.querySelector("#expenseForm").addEventListener("submit", event => {
    event.preventDefault();
    const expense = document.querySelector("#expenseForm input").value;
    if (expense.length==0) {
        alert("You didn't input any content");
    } else {
      expenses.push(+expense);
      renderBudgetByType(expenses, 'listExpenses');
      save(expenses, 'listExpenses')
      document.querySelector("#expenseForm input").value = "";
    }
  });

  document.querySelector("#btnLearn").addEventListener("click", event => {
    location.href = "https://triptyk.eu";
  })

  document.querySelector("#btnShare").addEventListener("click", event => {
    const totalExpenses = expenses.reduce((prev, curr) => prev + curr, 0);
    const totalIncomes = incomes.reduce((prev, curr) => prev + curr, 0);

    navigator.share({
        title: "Spendwise",
        text: `Budget total de ${totalIncomes - totalExpenses} €`
    })
  })
})


// Render the budget on the DOM
function renderBudgetByType(listBudget, listId) {
  const list = document.querySelector(`#${listId}`);
  list.innerHTML = "";
  listBudget.forEach( (element, index) => {
      const li = document.createElement("li");
      li.innerHTML = `${element} €`;

      const deleteButton = document.createElement("span");
      deleteButton.classList.add('material-symbols-outlined');
      deleteButton.innerText = 'delete';
      deleteButton.addEventListener("click", () => {
          if (confirm("Do you want to delete this?")) {
            listBudget.splice(index, 1);
            renderBudgetByType(listBudget, listId);
            save(listBudget, listId)
          }
      });
      li.appendChild(deleteButton);
      list.appendChild(li);
  })
  renderTotalBudget();
}

function renderTotalBudget() {
  const result = document.querySelector(`#result`);
  const totalExpenses = expenses.reduce((prev, curr) => prev + curr, 0);
  const totalIncomes = incomes.reduce((prev, curr) => prev + curr, 0);

  result.innerHTML = `${totalIncomes - totalExpenses} €`;
}

function save(listBudget, listId) {
  localStorage.setItem(listId, JSON.stringify(listBudget));
}

function getInitialData(type, listId) {
  if (localStorage.getItem(listId)) {
    if (type === "expense") {
      expenses = JSON.parse(localStorage.getItem(listId));
    }
    if (type === "income") {
      incomes = JSON.parse(localStorage.getItem(listId));
    }
  }
} 