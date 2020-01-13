import { Model } from '@nozbe/watermelondb'
import { omitBy, isUndefined } from 'lodash'

import { database } from '../db'

interface ExpenseModel extends Model {
  date: string
  item: string
  amount: number
  category: string
  last_modified: number
}

type Expense = {
  date?: string
  item?: string
  amount?: number
  category?: string
  last_modified?: number
  id?: string
}

export async function createExpense({
  date,
  item,
  amount,
  category,
  last_modified,
  id,
}: Expense): Promise<void> {
  const collection = database.collections.get('expenses')

  await database.action(async () => {
    await collection.create((expense: ExpenseModel) => {
      expense.date = date
      expense.item = item
      expense.amount = amount
      expense.category = category
      expense['_raw'].id = id
      expense.last_modified = last_modified
    })
  })
}

export async function deleteExpense({ id }: Expense): Promise<void> {
  if (!id) {
    throw new Error('Need an id to delete the expense')
  }

  const collection = database.collections.get('expenses')

  await database.action(async () => {
    const expense = await collection.find(id)

    await expense.markAsDeleted()
  })
}

export async function updateExpense({
  id,
  date,
  item,
  amount,
  category,
}: Expense): Promise<void> {
  if (!id) {
    throw new Error('Need an id to update the expense')
  }

  const collection = database.collections.get('expenses')

  await database.action(async () => {
    const expense = await collection.find(id)
    const toUpdate = {
      ...omitBy({ date, item, amount, category }, isUndefined),
    }

    await expense.update((expense: ExpenseModel) => {
      Object.keys(toUpdate).forEach(key => (expense[key] = toUpdate[key]))
      expense.last_modified = Date.now()
    })
  })
}
