function makeRandomExpenses() {
  const categories = ['Grocery', 'Clothes', 'Living', 'Investments']
  const expenses = []

  for (let i = 0; i < 200; i++) {
    expenses.push({
      date: '12/20/2019',
      item: `Item--${i}`,
      amount: Math.floor(Math.random() * Math.floor(300)),
      category: categories[Math.floor(Math.random() * categories.length)],
    })
  }

  return expenses
}

export async function generate(db) {
  const expenses = makeRandomExpenses()
  const collection = db.collections.get('expenses')

  expenses.forEach(async expense => {
    await collection.create(e => {
      e.date = expense.date
      e.item = expense.item
      e.amount = expense.amount
      e.category = expense.category
    })
  })
}
