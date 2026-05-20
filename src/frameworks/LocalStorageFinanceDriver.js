import Account from '../domain/Account.js';
import Salary from '../domain/Salary.js';

const TRANSACTIONS_KEY = 'finance_transactions';
const GOALS_KEY = 'finance_goals';
const ACCOUNT_KEY = 'finance_account';
const SALARY_KEY = 'finance_salary';

export default class LocalStorageFinanceDriver {
  constructor() {
    this.initialize();
  }

  initialize() {
    if (!localStorage.getItem(TRANSACTIONS_KEY)) {
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(GOALS_KEY)) {
      localStorage.setItem(GOALS_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(ACCOUNT_KEY)) {
      localStorage.setItem(ACCOUNT_KEY, JSON.stringify({ id: 'account-main', name: 'Cuenta principal', balance: 0 }));
    }
    if (!localStorage.getItem(SALARY_KEY)) {
      localStorage.setItem(SALARY_KEY, JSON.stringify({ grossAmount: 0, netAmount: 0, period: 'Mensual' }));
    }
  }

  fetchTransactions() {
    const raw = localStorage.getItem(TRANSACTIONS_KEY) || '[]';
    return JSON.parse(raw);
  }

  fetchGoals() {
    const raw = localStorage.getItem(GOALS_KEY) || '[]';
    return JSON.parse(raw);
  }

  fetchAccount() {
    const raw = localStorage.getItem(ACCOUNT_KEY) || JSON.stringify({ id: 'account-main', name: 'Cuenta principal', balance: 0 });
    const account = JSON.parse(raw);
    return new Account(account);
  }

  fetchSalary() {
    const raw = localStorage.getItem(SALARY_KEY) || JSON.stringify({ grossAmount: 0, netAmount: 0, period: 'Mensual' });
    const salaryData = JSON.parse(raw);
    return new Salary(salaryData);
  }

  saveTransaction(transaction) {
    const current = this.fetchTransactions();
    current.push(transaction);
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(current));
    return transaction;
  }

  updateTransaction(id, updatedTransaction) {
    const transactions = this.fetchTransactions();
    const next = transactions.map((item) => (item.id === id ? updatedTransaction : item));
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(next));
    return updatedTransaction;
  }

  deleteTransaction(id) {
    const transactions = this.fetchTransactions();
    const next = transactions.filter((transaction) => transaction.id !== id);
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(next));
  }

  saveGoal(goal) {
    const current = this.fetchGoals();
    current.push(goal);
    localStorage.setItem(GOALS_KEY, JSON.stringify(current));
    return goal;
  }

  updateGoal(id, updatedGoal) {
    const goals = this.fetchGoals();
    const next = goals.map((item) => (item.id === id ? updatedGoal : item));
    localStorage.setItem(GOALS_KEY, JSON.stringify(next));
    return updatedGoal;
  }

  deleteGoal(id) {
    const goals = this.fetchGoals();
    const next = goals.filter((goal) => goal.id !== id);
    localStorage.setItem(GOALS_KEY, JSON.stringify(next));
  }

  applyTransactionToAccount(transaction) {
    const account = this.fetchAccount();
    const accountModel = new Account(account);
    accountModel.applyTransaction(transaction);
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(accountModel));
    return accountModel;
  }

  rebuildAccountFromTransactions() {
    const transactions = this.fetchTransactions();
    const accountModel = new Account({});
    transactions.forEach((transaction) => {
      accountModel.applyTransaction(transaction);
    });
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(accountModel));
    return accountModel;
  }

  saveSalary(salary) {
    localStorage.setItem(SALARY_KEY, JSON.stringify(salary));
    return salary;
  }

  exportData() {
    return {
      transactions: this.fetchTransactions(),
      goals: this.fetchGoals(),
      account: this.fetchAccount(),
      salary: this.fetchSalary()
    };
  }

  importData(payload) {
    let documentData = payload;
    if (typeof payload === 'string') {
      documentData = JSON.parse(payload);
    }
    if (!documentData || !Array.isArray(documentData.transactions) || !Array.isArray(documentData.goals)) {
      throw new Error('El archivo importado no contiene datos válidos.');
    }
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(documentData.transactions));
    localStorage.setItem(GOALS_KEY, JSON.stringify(documentData.goals));
    localStorage.setItem(SALARY_KEY, JSON.stringify(documentData.salary || { grossAmount: 0, netAmount: 0, period: 'Mensual' }));
    this.rebuildAccountFromTransactions();
  }
}
