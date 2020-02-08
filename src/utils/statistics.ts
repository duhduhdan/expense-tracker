import moment from 'moment'

export function calculateMonthOverMonth(expenses, lastMonthExpenses): number {
  const thisMonth = expenses.reduce((accum, curr) => (accum += curr.amount), 0)
  const lastMonth = lastMonthExpenses.reduce(
    (accum, curr) => (accum += curr.amount),
    0,
  )

  return ((thisMonth - lastMonth) * 100) / lastMonth
}

export function avgWeeklySpend(expenses): number {
  return expenses.reduce(
    (total: number, current: any) =>
      (total += current.amount / moment().week()),
    0,
  )
}
