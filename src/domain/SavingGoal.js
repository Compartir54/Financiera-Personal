export default class SavingGoal {
  constructor({ id, name, targetAmount, currentAmount, deadline }) {
    this.id = id;
    this.name = name;
    this.targetAmount = Number(targetAmount);
    this.currentAmount = Number(currentAmount);
    this.deadline = deadline;
  }

  static create({ name, targetAmount, currentAmount, deadline }) {
    if (!name?.trim()) {
      throw new Error('El nombre de la meta es obligatorio.');
    }
    if (Number.isNaN(Number(targetAmount)) || Number(targetAmount) <= 0) {
      throw new Error('El monto objetivo debe ser mayor que cero.');
    }
    if (Number.isNaN(Number(currentAmount)) || Number(currentAmount) < 0) {
      throw new Error('El monto actual debe ser igual o mayor que cero.');
    }
    if (currentAmount > targetAmount) {
      throw new Error('El monto actual no puede ser mayor que el objetivo.');
    }
    return new SavingGoal({
      id: `goal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim(),
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount),
      deadline: deadline || new Date().toISOString().slice(0, 10)
    });
  }

  progressPercentage() {
    if (this.targetAmount === 0) {
      return 0;
    }
    return Math.min(100, Math.round((this.currentAmount / this.targetAmount) * 100));
  }
}
