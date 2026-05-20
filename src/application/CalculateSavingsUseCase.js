export default class CalculateSavingsUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  execute() {
    const transactions = this.repository.listTransactions();
    const goals = this.repository.listGoals();
    const salary = this.repository.getSalary();

    const totalIncome = transactions
      .filter((transaction) => transaction.type === 'income')
      .reduce((total, transaction) => total + Number(transaction.amount), 0);

    const totalExpenses = transactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((total, transaction) => total + Number(transaction.amount), 0);

    const netSavings = totalIncome - totalExpenses;
    const goalCurrentAmount = goals.reduce((total, goal) => total + Number(goal.currentAmount), 0);

    return {
      transactions,
      goals,
      totalIncome,
      totalExpenses,
      netSavings,
      goalCurrentAmount,
      salary
    };
  }
}
