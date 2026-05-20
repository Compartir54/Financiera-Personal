export default class AnalyzeFinancialRelationsStrategy {
  apply({ totalIncome, totalExpenses, netSavings, salary }) {
    const savingsRatio = salary?.savingsRatio(netSavings) ?? 0;
    const expenseRatio = salary?.grossAmount > 0 ? Math.round((totalExpenses / salary.grossAmount) * 100) : 0;
    const incomeCoverage = salary?.netAmount > 0 ? Math.round((totalIncome / salary.netAmount) * 100) : 0;

    return {
      savingsRatio,
      expenseRatio,
      incomeCoverage,
      salaryPeriod: salary?.period || 'N/A'
    };
  }
}
