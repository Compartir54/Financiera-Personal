export default class RegisterGoalUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  execute(goalPayload) {
    return this.repository.createGoal(goalPayload);
  }
}
