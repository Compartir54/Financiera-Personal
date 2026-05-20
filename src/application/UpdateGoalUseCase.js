export default class UpdateGoalUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  execute(goalId, updateData) {
    return this.repository.updateGoal(goalId, updateData);
  }
}
