import Account from '../domain/Account.js';
import Transaction from '../domain/Transaction.js';
import SavingGoal from '../domain/SavingGoal.js';
import Salary from '../domain/Salary.js';

export default class FinanceRepository {
  constructor(driver) {
    this.driver = driver;
  }

  createTransaction(payload) {
    const transaction = Transaction.create(payload);
    this.driver.saveTransaction(transaction);
    this.driver.applyTransactionToAccount(transaction);
    return transaction;
  }

  createGoal(payload) {
    const goal = SavingGoal.create(payload);
    this.driver.saveGoal(goal);
    return goal;
  }

  findTransactionById(id) {
    return this.listTransactions().find((transaction) => transaction.id === id);
  }

  findGoalById(id) {
    return this.listGoals().find((goal) => goal.id === id);
  }

  updateTransaction(id, updateData) {
    const existing = this.findTransactionById(id);
    if (!existing) {
      throw new Error('Transacción no encontrada.');
    }
    const updated = new Transaction({
      ...existing,
      ...updateData,
      amount: Number(updateData.amount ?? existing.amount)
    });
    this.driver.updateTransaction(id, updated);
    this.driver.rebuildAccountFromTransactions();
    return updated;
  }

  updateGoal(id, updateData) {
    const existing = this.findGoalById(id);
    if (!existing) {
      throw new Error('Meta no encontrada.');
    }
    const updated = new SavingGoal({
      ...existing,
      ...updateData,
      targetAmount: Number(updateData.targetAmount ?? existing.targetAmount),
      currentAmount: Number(updateData.currentAmount ?? existing.currentAmount)
    });
    this.driver.updateGoal(id, updated);
    return updated;
  }

  deleteTransaction(id) {
    this.driver.deleteTransaction(id);
    this.driver.rebuildAccountFromTransactions();
  }

  deleteGoal(id) {
    this.driver.deleteGoal(id);
  }

  listTransactions() {
    return this.driver.fetchTransactions();
  }

  listGoals() {
    return this.driver.fetchGoals();
  }

  getAccount() {
    return this.driver.fetchAccount();
  }

  getSalary() {
    return this.driver.fetchSalary();
  }

  saveSalary(payload) {
    const salary = new Salary(payload);
    this.driver.saveSalary(salary);
    return salary;
  }

  exportData() {
    return this.driver.exportData();
  }

  importData(payload) {
    this.driver.importData(payload);
  }
}
