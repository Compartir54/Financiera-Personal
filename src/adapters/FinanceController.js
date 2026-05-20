export default class FinanceController {
  constructor({ registerExpenseUseCase, registerGoalUseCase, updateTransactionUseCase, updateGoalUseCase, calculateSavingsUseCase, repository, strategy }) {
    this.registerExpenseUseCase = registerExpenseUseCase;
    this.registerGoalUseCase = registerGoalUseCase;
    this.updateTransactionUseCase = updateTransactionUseCase;
    this.updateGoalUseCase = updateGoalUseCase;
    this.calculateSavingsUseCase = calculateSavingsUseCase;
    this.repository = repository;
    this.strategy = strategy;
  }

  addTransaction(payload) {
    return this.registerExpenseUseCase.execute(payload);
  }

  addGoal(payload) {
    return this.registerGoalUseCase.execute(payload);
  }

  updateTransaction(id, payload) {
    return this.updateTransactionUseCase.execute(id, payload);
  }

  updateGoal(id, payload) {
    return this.updateGoalUseCase.execute(id, payload);
  }

  deleteTransaction(id) {
    return this.repository.deleteTransaction(id);
  }

  deleteGoal(id) {
    return this.repository.deleteGoal(id);
  }

  getSavings() {
    return this.calculateSavingsUseCase.execute();
  }

  analyzeFinancialRelations(summary) {
    return this.strategy.apply(summary);
  }

  saveSalary(payload) {
    return this.repository.saveSalary(payload);
  }

  exportData() {
    return this.repository.exportData();
  }

  importData(payload) {
    return this.repository.importData(payload);
  }
}
