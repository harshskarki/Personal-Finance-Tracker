// ==========================
// Finance Tracker Pro
// ==========================

// Elements

const form = document.getElementById("transaction-form");
const list = document.getElementById("transaction-list");

const balanceDisplay = document.getElementById("total-balance");
const incomeDisplay = document.getElementById("income");
const expenseDisplay = document.getElementById("expense");

const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter");

const totalTransactionsDisplay =
  document.getElementById("total-transactions");

const largestExpenseDisplay =
  document.getElementById("largest-expense");

const clearAllBtn =
  document.getElementById("clear-all");

// ==========================
// Local Storage
// ==========================

let transactions =
  JSON.parse(localStorage.getItem("transactions")) || [];

// ==========================
// Save Data
// ==========================

function saveTransactions() {
  localStorage.setItem(
    "transactions",
    JSON.stringify(transactions)
  );
}

// ==========================
// Delete Transaction
// ==========================

function deleteTransaction(id) {
  transactions = transactions.filter(
    transaction => transaction.id !== id
  );

  saveTransactions();
  updateDashboard();
}

// ==========================
// Clear All Transactions
// ==========================

clearAllBtn.addEventListener("click", () => {

  if (transactions.length === 0) {
    return;
  }

  const confirmDelete = confirm(
    "Delete all transactions?"
  );

  if (!confirmDelete) {
    return;
  }

  transactions = [];

  saveTransactions();
  updateDashboard();
});

// ==========================
// Statistics
// ==========================

function calculateStats() {

  const income = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expense;

  const savings =
Math.max(balance, 0);

  const savingsRate =
  income > 0
  ? ((savings / income) * 100).toFixed(1)
  : 0;

  const largestExpense = transactions
    .filter(t => t.type === "expense")
    .reduce(
      (max, t) => Math.max(max, t.amount),
      0
    );

  balanceDisplay.textContent =
    `$${balance.toFixed(2)}`;

  incomeDisplay.textContent =
    `$${income.toFixed(2)}`;

  expenseDisplay.textContent =
    `$${expense.toFixed(2)}`;

  totalTransactionsDisplay.textContent =
    transactions.length;

  largestExpenseDisplay.textContent =
    `$${largestExpense.toFixed(2)}`;

  document.getElementById("savings").textContent =
  `$${savings.toFixed(2)}`;

  document.getElementById("savings-rate").textContent =
  `${savingsRate}%`;
}

// ==========================
// Render Transactions
// ==========================

function renderTransactions() {

  list.innerHTML = "";

  let filteredTransactions = [...transactions];

  const searchTerm =
    searchInput.value.toLowerCase();

  const filterType =
    filterSelect.value;

  // Search

  if (searchTerm) {
    filteredTransactions =
      filteredTransactions.filter(
        transaction =>
          transaction.desc
            .toLowerCase()
            .includes(searchTerm)
      );
  }

  // Filter

  if (filterType !== "all") {
    filteredTransactions =
      filteredTransactions.filter(
        transaction =>
          transaction.type === filterType
      );
  }

  // Empty State

  if (filteredTransactions.length === 0) {

    list.innerHTML = `
  <li class="empty-state">

      <h3>📭 No Transactions</h3>

      <p>
          Add your first income or expense
          to get started.
      </p>

  </li>
`;

    return;
  }

  filteredTransactions.forEach(transaction => {

    const li =
      document.createElement("li");

    li.classList.add(
      "list-item",
      transaction.type
    );

    li.innerHTML = `
      <div class="transaction-left">
        <strong>${transaction.desc}</strong>
        <span class="transaction-date">
          ${transaction.date}
        </span>
      </div>

      <div class="transaction-right">

        <span class="transaction-amount">
          ${
            transaction.type === "income"
              ? "+"
              : "-"
          }$${transaction.amount.toFixed(2)}
        </span>

        <button
          class="delete-btn"
          onclick="deleteTransaction(${transaction.id})"
        >
          ✕
        </button>

      </div>
    `;

    list.appendChild(li);
  });
}

// ==========================
// Main Update
// ==========================

function updateDashboard() {
  calculateStats();
  renderTransactions();
  saveTransactions();
}

// ==========================
// Add Transaction
// ==========================

form.addEventListener("submit", e => {

  e.preventDefault();

  const desc =
    document
      .getElementById("desc")
      .value
      .trim();

  const amount =
    parseFloat(
      document
        .getElementById("amount")
        .value
    );

  const type =
    document
      .getElementById("type")
      .value;

  // Validation

  if (
    desc === "" ||
    isNaN(amount) ||
    amount <= 0
  ) {

    alert(
      "Please enter valid transaction details."
    );

    return;
  }

  const transaction = {

    id: Date.now(),

    desc,

    amount,

    type,

    date: new Date()
  .toLocaleDateString(
    "en-US",
    {
      day: "numeric",
      month: "short",
      year: "numeric"
    }
  )

  };

  // Newest First

  transactions.unshift(transaction);

  updateDashboard();

  form.reset();
});

// ==========================
// Search
// ==========================

searchInput.addEventListener(
  "input",
  renderTransactions
);

// ==========================
// Filter
// ==========================

filterSelect.addEventListener(
  "change",
  renderTransactions
);

// ==========================
// Global Access
// ==========================

const themeToggle =
  document.getElementById("theme-toggle");

const savedTheme =
  localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.setAttribute(
    "data-theme",
    "dark"
  );
}

themeToggle.addEventListener("click", () => {

  const isDark =
    document.body.getAttribute("data-theme")
    === "dark";

  if (isDark) {

    document.body.removeAttribute(
      "data-theme"
    );

    localStorage.setItem(
      "theme",
      "light"
    );

  } else {

    document.body.setAttribute(
      "data-theme",
      "dark"
    );

    localStorage.setItem(
      "theme",
      "dark"
    );

  }

});

// ==========================
// Initial Load
// ==========================

updateDashboard();