export default class Salary {
  constructor({ grossAmount = 0, netAmount = 0, period = 'Mensual' } = {}) {
    this.grossAmount = Number(grossAmount);
    this.netAmount = Number(netAmount);
    this.period = period;
  }

  savingsRatio(savingsAmount) {
    if (Number.isNaN(Number(savingsAmount)) || this.grossAmount <= 0) {
      return 0;
    }
    return Math.round((Number(savingsAmount) / this.grossAmount) * 100);
  }
}
