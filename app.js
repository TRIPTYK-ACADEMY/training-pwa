let incomes = [];
let expenses = [];

// Registering all the event handlers when the page loads
document.addEventListener("DOMContentLoaded", event => {
  document.querySelector("#incomeForm").addEventListener("submit", event => {
    event.preventDefault();
    const income = document.querySelector("#incomeForm input").value;
    if (income.length==0) {
        alert("You didn't input any content");
    } else {
      incomes.push(+income);
      renderBudgetByType(incomes, 'listIncomes');
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
      document.querySelector("#expenseForm input").value = "";
    }
  });

  document.querySelector("#btnLearn").addEventListener("click", event => {
    location.href = "https://triptyk.eu";
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