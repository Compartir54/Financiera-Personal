export default class Account {
  constructor({ id = 'account-main', name = 'Cuenta principal', balance = 0 } = {}) {
    this.id = id;
    this.name = name;
    this.balance = Number(balance);
  }

  applyTransaction(transaction) {
    if (transaction.isIncome()) {
      this.balance += Number(transaction.amount);
    } else if (transaction.isExpense()) {
      this.balance -= Number(transaction.amount);
    }
    return this;
  }
}
