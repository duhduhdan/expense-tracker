import { database } from '../db'
import { Model } from '@nozbe/watermelondb'

interface ExpenseModel extends Model {
  date: string
  item: string
  amount: number
  category: string
}

type Expense = {
  date?: string
  item?: string
  amount?: number
  category?: string
  id?: string
}

export async function createExpense({ date, item, amount, category }: Expense) {
  const collection = database.collections.get('expenses')

  await database.action(async () => {
    await collection.create((expense: ExpenseModel) => {
      expense.date = date
      expense.item = item
      expense.amount = amount
      expense.category = category
    })
  })
}

export async function deleteExpense({ id }: Expense) {
  const collection = database.collections.get('expenses')

  await database.action(async () => {
    const expense = await collection.find(id)

    await expense.markAsDeleted()
  })
}