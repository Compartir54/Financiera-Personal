import { describe, it, expect } from 'vitest';
import CalculateSavingsUseCase from './CalculateSavingsUseCase.js';

const emptyRepository = {
  listTransactions: () => [
    { type: 'income', amount: 1500 },
    { type: 'expense', amount: 400 },
    { type: 'expense', amount: 100 }
  ],
  listGoals: () => [
    { currentAmount: 250 },
    { currentAmount: 150 }
  ],
  getSalary: () => ({ grossAmount: 2000, netAmount: 1800, period: 'Mensual' })
};

describe('CalculateSavingsUseCase', () => {
  it('calcula totales y neto correctamente', () => {
    const useCase = new CalculateSavingsUseCase(emptyRepository);
    const result = useCase.execute();

    expect(result.totalIncome).toBe(1500);
    expect(result.totalExpenses).toBe(500);
    expect(result.netSavings).toBe(1000);
    expect(result.goalCurrentAmount).toBe(400);
    expect(result.salary.grossAmount).toBe(2000);
  });
});
