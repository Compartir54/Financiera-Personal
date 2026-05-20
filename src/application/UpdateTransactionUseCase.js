export default class UpdateTransactionUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  execute(transactionId, updateData) {
    return this.repository.updateTransaction(transactionId, updateData);
  }
}
