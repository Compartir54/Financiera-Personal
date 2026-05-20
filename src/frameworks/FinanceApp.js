import LocalStorageFinanceDriver from './LocalStorageFinanceDriver.js';
import FinanceRepository from '../adapters/FinanceRepository.js';
import FinanceController from '../adapters/FinanceController.js';
import RegisterExpenseUseCase from '../application/RegisterExpenseUseCase.js';
import RegisterGoalUseCase from '../application/RegisterGoalUseCase.js';
import UpdateTransactionUseCase from '../application/UpdateTransactionUseCase.js';
import UpdateGoalUseCase from '../application/UpdateGoalUseCase.js';
import CalculateSavingsUseCase from '../application/CalculateSavingsUseCase.js';
import AnalyzeFinancialRelationsStrategy from '../application/AnalyzeFinancialRelationsStrategy.js';

export default class FinanceApp {
  constructor() {
    this.driver = new LocalStorageFinanceDriver();
    this.repository = new FinanceRepository(this.driver);
    this.controller = new FinanceController({
      registerExpenseUseCase: new RegisterExpenseUseCase(this.repository),
      registerGoalUseCase: new RegisterGoalUseCase(this.repository),
      updateTransactionUseCase: new UpdateTransactionUseCase(this.repository),
      updateGoalUseCase: new UpdateGoalUseCase(this.repository),
      calculateSavingsUseCase: new CalculateSavingsUseCase(this.repository),
      repository: this.repository,
      strategy: new AnalyzeFinancialRelationsStrategy()
    });

    this.authKey = 'finance_authenticated';
    this.credentials = { username: 'admin', password: 'financiera123' };

    this.elements = {
      appShell: document.getElementById('appShell'),
      loginShell: document.getElementById('loginShell'),
      loginForm: document.getElementById('loginForm'),
      loginUsername: document.getElementById('loginUsername'),
      loginPassword: document.getElementById('loginPassword'),
      logoutButton: document.getElementById('logoutButton'),
      balanceValue: document.getElementById('balanceValue'),
      incomeValue: document.getElementById('incomeValue'),
      expenseValue: document.getElementById('expenseValue'),
      savingRatioValue: document.getElementById('savingRatioValue'),
      transactionsTableBody: document.querySelector('#transactionsTable tbody'),
      goalsTableBody: document.querySelector('#goalsTable tbody'),
      transactionForm: document.getElementById('transactionForm'),
      goalForm: document.getElementById('goalForm'),
      salaryForm: document.getElementById('salaryForm'),
      exportButton: document.getElementById('exportButton'),
      importInput: document.getElementById('importInput'),
      toast: document.getElementById('toast'),
      salaryGross: document.getElementById('salaryGross'),
      salaryNet: document.getElementById('salaryNet'),
      salaryPeriod: document.getElementById('salaryPeriod')
    };

    this.init();
  }

  init() {
    this.elements.transactionForm.addEventListener('submit', (event) => this.handleTransactionSubmit(event));
    this.elements.goalForm.addEventListener('submit', (event) => this.handleGoalSubmit(event));
    this.elements.salaryForm.addEventListener('submit', (event) => this.handleSalarySubmit(event));
    this.elements.exportButton.addEventListener('click', () => this.handleExport());
    this.elements.importInput.addEventListener('change', (event) => this.handleImport(event));
    this.elements.loginForm.addEventListener('submit', (event) => this.handleLoginSubmit(event));
    this.elements.logoutButton.addEventListener('click', () => this.handleLogout());
    this.updateView();
  }

  loadState() {
    if (!this.isAuthenticated()) {
      return;
    }

    this.renderAccountSummary();
    this.renderTransactions();
    this.renderGoals();
    this.fillSalaryForm();
  }

  isAuthenticated() {
    return localStorage.getItem(this.authKey) === 'true';
  }

  updateView() {
    if (this.isAuthenticated()) {
      this.elements.loginShell.classList.add('hidden');
      this.elements.appShell.classList.remove('hidden');
      this.elements.logoutButton.classList.remove('hidden');
      this.loadState();
    } else {
      this.elements.loginShell.classList.remove('hidden');
      this.elements.appShell.classList.add('hidden');
      this.elements.logoutButton.classList.add('hidden');
    }
  }

  handleLoginSubmit(event) {
    event.preventDefault();
    const username = this.elements.loginUsername.value.trim();
    const password = this.elements.loginPassword.value.trim();

    if (username === this.credentials.username && password === this.credentials.password) {
      localStorage.setItem(this.authKey, 'true');
      this.elements.loginForm.reset();
      this.showToast('Inicio de sesión correcto.');
      this.updateView();
      return;
    }

    this.showToast('Usuario o contraseña incorrectos.', true);
  }

  handleLogout() {
    localStorage.removeItem(this.authKey);
    this.showToast('Sesión cerrada.');
    this.updateView();
  }

  renderAccountSummary() {
    const summary = this.controller.getSavings();
    const analysis = this.controller.analyzeFinancialRelations(summary);

    this.elements.balanceValue.textContent = this.formatCurrency(summary.netSavings);
    this.elements.incomeValue.textContent = this.formatCurrency(summary.totalIncome);
    this.elements.expenseValue.textContent = this.formatCurrency(summary.totalExpenses);
    this.elements.savingRatioValue.textContent = `${analysis.savingsRatio}%`;
  }

  renderTransactions() {
    const summary = this.controller.getSavings();
    const transactions = summary.transactions;
    this.elements.transactionsTableBody.innerHTML = '';

    if (transactions.length === 0) {
      this.elements.transactionsTableBody.innerHTML = '<tr><td colspan="6">No hay transacciones registradas.</td></tr>';
      return;
    }

    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    transactions.forEach((transaction) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><span class="badge ${transaction.type === 'income' ? 'badge-income' : 'badge-expense'}">${transaction.type === 'income' ? 'Ingreso' : 'Gasto'}</span></td>
        <td>${this.formatCurrency(transaction.amount)}</td>
        <td>${transaction.category}</td>
        <td>${transaction.date}</td>
        <td>${transaction.note || '---'}</td>
        <td>
          <button class="action-button" data-action="delete-transaction" data-id="${transaction.id}">Eliminar</button>
        </td>
      `;
      this.elements.transactionsTableBody.appendChild(row);
    });

    this.elements.transactionsTableBody.querySelectorAll('[data-action="delete-transaction"]').forEach((button) => {
      button.addEventListener('click', (event) => {
        const id = event.currentTarget.dataset.id;
        this.handleTransactionDelete(id);
      });
    });
  }

  renderGoals() {
    const goals = this.controller.getSavings().goals;
    this.elements.goalsTableBody.innerHTML = '';

    if (goals.length === 0) {
      this.elements.goalsTableBody.innerHTML = '<tr><td colspan="6">No hay metas definidas.</td></tr>';
      return;
    }

    goals.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    goals.forEach((goal) => {
      const progress = goal.currentAmount && goal.targetAmount ? Math.round((goal.currentAmount / goal.targetAmount) * 100) : 0;
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${goal.name}</td>
        <td>${this.formatCurrency(goal.targetAmount)}</td>
        <td>${this.formatCurrency(goal.currentAmount)}</td>
        <td>
          <div class="progress-bar"><span style="width:${progress}%"></span></div>
          <small>${progress}%</small>
        </td>
        <td>${goal.deadline}</td>
        <td>
          <button class="action-button delete" data-action="delete-goal" data-id="${goal.id}">Eliminar</button>
        </td>
      `;
      this.elements.goalsTableBody.appendChild(row);
    });

    this.elements.goalsTableBody.querySelectorAll('[data-action="delete-goal"]').forEach((button) => {
      button.addEventListener('click', (event) => {
        const id = event.currentTarget.dataset.id;
        this.handleGoalDelete(id);
      });
    });
  }

  fillSalaryForm() {
    const salary = this.repository.getSalary();
    this.elements.salaryGross.value = salary.grossAmount;
    this.elements.salaryNet.value = salary.netAmount;
    this.elements.salaryPeriod.value = salary.period;
  }

  handleTransactionSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const payload = {
      type: this.elements.transactionType.value,
      amount: this.elements.transactionAmount.value,
      category: this.elements.transactionCategory.value,
      date: this.elements.transactionDate.value,
      note: document.getElementById('transactionNote').value
    };

    try {
      this.controller.addTransaction(payload);
      form.reset();
      this.showToast('Transacción guardada correctamente.');
      this.loadState();
    } catch (error) {
      this.showToast(error.message, true);
    }
  }

  handleGoalSubmit(event) {
    event.preventDefault();
    const payload = {
      name: document.getElementById('goalName').value,
      targetAmount: document.getElementById('goalTarget').value,
      currentAmount: document.getElementById('goalCurrent').value,
      deadline: document.getElementById('goalDeadline').value
    };

    try {
      this.controller.addGoal(payload);
      event.target.reset();
      this.showToast('Meta de ahorro creada correctamente.');
      this.loadState();
    } catch (error) {
      this.showToast(error.message, true);
    }
  }

  handleSalarySubmit(event) {
    event.preventDefault();
    const payload = {
      grossAmount: this.elements.salaryGross.value,
      netAmount: this.elements.salaryNet.value,
      period: this.elements.salaryPeriod.value
    };

    try {
      this.controller.saveSalary(payload);
      this.showToast('Salario actualizado correctamente.');
      this.loadState();
    } catch (error) {
      this.showToast(error.message, true);
    }
  }

  handleTransactionDelete(id) {
    this.controller.deleteTransaction(id);
    this.showToast('Transacción eliminada.');
    this.loadState();
  }

  handleGoalDelete(id) {
    this.controller.deleteGoal(id);
    this.showToast('Meta eliminada.');
    this.loadState();
  }

  handleExport() {
    const data = this.controller.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'financiera-personal-export.json';
    link.click();
    URL.revokeObjectURL(url);
    this.showToast('Datos exportados correctamente.');
  }

  async handleImport(event) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    try {
      const text = await file.text();
      this.controller.importData(text);
      this.showToast('Datos importados correctamente.');
      this.loadState();
    } catch (error) {
      this.showToast(error.message, true);
    } finally {
      event.target.value = '';
    }
  }

  showToast(message, isError = false) {
    this.elements.toast.textContent = message;
    this.elements.toast.style.background = isError ? '#b91c1c' : '#111827';
    this.elements.toast.classList.add('show');
    window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => {
      this.elements.toast.classList.remove('show');
    }, 3000);
  }

  formatCurrency(value) {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 2
    }).format(value || 0);
  }
}

new FinanceApp();
