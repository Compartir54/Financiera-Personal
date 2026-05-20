import { describe, it, expect } from 'vitest';
import Transaction from './Transaction.js';

describe('Transaction', () => {
  it('crea una transacción de ingreso válida', () => {
    const transaction = Transaction.create({
      type: 'income',
      amount: 1200,
      category: 'Salario',
      date: '2026-05-19',
      note: 'Pago mensual'
    });

    expect(transaction.type).toBe('income');
    expect(transaction.isIncome()).toBe(true);
    expect(transaction.amount).toBe(1200);
    expect(transaction.category).toBe('Salario');
  });

  it('rechaza una transacción con monto negativo', () => {
    expect(() => {
      Transaction.create({
        type: 'expense',
        amount: -50,
        category: 'Comida',
        date: '2026-05-19'
      });
    }).toThrow('El monto de la transacción debe ser mayor que cero.');
  });
});
