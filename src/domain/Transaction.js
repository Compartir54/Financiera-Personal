export default class Transaction {
  constructor({ id, type, amount, category, date, note }) {
    this.id = id;
    this.type = type;
    this.amount = Number(amount);
    this.category = category;
    this.date = date;
    this.note = note || '';
  }

  static create({ type, amount, category, date, note }) {
    if (!type || !['income', 'expense'].includes(type)) {
      throw new Error('El tipo de transacción debe ser income o expense.');
    }
    if (Number.isNaN(Number(amount)) || Number(amount) <= 0) {
      throw new Error('El monto de la transacción debe ser mayor que cero.');
    }
    return new Transaction({
      id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type,
      amount: Number(amount),
      category: category?.trim() || 'General',
      date: date || new Date().toISOString().slice(0, 10),
      note: note?.trim() || ''
    });
  }

  isIncome() {
    return this.type === 'income';
  }

  isExpense() {
    return this.type === 'expense';
  }
}
