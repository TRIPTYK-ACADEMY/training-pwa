let incomes = [];
let expenses = [];

// Registering all the event handlers when the page loads
getInitialData("income", "listIncomes");
getInitialData("expense", "listExpenses");

renderBudgetByType(incomes, "listIncomes", true);
renderBudgetByType(expenses, "listExpenses", true);

document.querySelector("#incomeForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const income = document.querySelector("#incomeForm input").value;
  if (income.length == 0) {
    alert("You didn't input any content");
  } else {
    incomes.push(+income);
    renderBudgetByType(incomes, "listIncomes");
    save(incomes, "listIncomes");
    document.querySelector("#incomeForm input").value = "";
  }
});

document.querySelector("#expenseForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const expense = document.querySelector("#expenseForm input").value;
  if (expense.length == 0) {
    alert("You didn't input any content");
  } else {
    expenses.push(+expense);
    renderBudgetByType(expenses, "listExpenses");
    save(expenses, "listExpenses");
    document.querySelector("#expenseForm input").value = "";
  }
});

// document.querySelector("#btnLearn").addEventListener("click", (event) => {
//   location.href = "https://triptyk.eu";
// });

document.querySelector("#btnShare").addEventListener("click", (event) => {
  const totalExpenses = expenses.reduce((prev, curr) => prev + curr, 0);
  const totalIncomes = incomes.reduce((prev, curr) => prev + curr, 0);

  navigator.share({
    title: "Spendwise",
    text: `Budget total de ${totalIncomes - totalExpenses} €`,
  });
});

let bipEvent = null;
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  bipEvent = event;
});

document.querySelector("#btnInstall").addEventListener("click", (event) => {
  if (bipEvent) {
    bipEvent.prompt();
  } else {
    // incompatible browser, your PWA is not passing the criteria, the user has already installed the PWA
    //TODO: show the user information on how to install the app
    alert(
      "To install the app look for Add to Homescreen or Install in your browser's menu"
    );
  }
});

// Render the budget on the DOM
function renderBudgetByType(listBudget, listId, renderInitial = false) {
  const list = document.querySelector(`#${listId}`);
  list.innerHTML = "";
  listBudget.forEach((element, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${element} €`;

    const deleteButton = document.createElement("span");
    deleteButton.classList.add("material-symbols-outlined");
    deleteButton.innerText = "delete";
    deleteButton.addEventListener("click", () => {
      if (confirm("Do you want to delete this?")) {
        listBudget.splice(index, 1);
        renderBudgetByType(listBudget, listId);
        save(listBudget, listId);
      }
    });
    li.appendChild(deleteButton);
    list.appendChild(li);
  });
  renderTotalBudget(renderInitial);
}

function renderTotalBudget(renderInitial) {
  const result = document.querySelector(`#result`);
  const totalExpenses = expenses.reduce((prev, curr) => prev + curr, 0);
  const totalIncomes = incomes.reduce((prev, curr) => prev + curr, 0);
  const total = totalIncomes - totalExpenses;

  result.innerHTML = `${total} €`;

  if (total < 0 && !renderInitial) {
    fetch('http://localhost:8000/budget', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'Attention votre budget est négatif',
        body: `${total} €`
      })
    })
  }
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
