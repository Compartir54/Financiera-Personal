export default class RegisterExpenseUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  execute(transactionPayload) {
    return this.repository.createTransaction(transactionPayload);
  }
}
