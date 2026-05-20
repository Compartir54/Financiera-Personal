import { describe, it, expect } from 'vitest';
import SavingGoal from './SavingGoal.js';

describe('SavingGoal', () => {
  it('calcula el progreso correctamente', () => {
    const goal = SavingGoal.create({
      name: 'Fondo de emergencia',
      targetAmount: 1000,
      currentAmount: 250,
      deadline: '2026-12-31'
    });

    expect(goal.progressPercentage()).toBe(25);
  });

  it('rechaza una meta con monto actual mayor que el objetivo', () => {
    expect(() => {
      SavingGoal.create({
        name: 'Vacaciones',
        targetAmount: 500,
        currentAmount: 600,
        deadline: '2026-12-30'
      });
    }).toThrow('El monto actual no puede ser mayor que el objetivo.');
  });
});
