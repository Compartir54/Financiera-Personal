import { describe, it, expect } from 'vitest';
import Salary from './Salary.js';

describe('Salary', () => {
  it('calcula el ratio de ahorro basado en salario bruto', () => {
    const salary = new Salary({ grossAmount: 3000, netAmount: 2500, period: 'Mensual' });
    expect(salary.savingsRatio(300)).toBe(10);
  });

  it('devuelve 0 cuando salario bruto es cero', () => {
    const salary = new Salary({ grossAmount: 0, netAmount: 0, period: 'Mensual' });
    expect(salary.savingsRatio(100)).toBe(0);
  });
});
