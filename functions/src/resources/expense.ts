import * as admin from 'firebase-admin'

interface Expense {
  uid: string
  expense?: any | any[]
  id?: string
  last_modified?: string
  since?: number
}

export async function createExpense({ uid, expense }: Expense): Promise<void> {
  if (!uid || !expense) {
    throw new Error('Need a uid and expense to add to expenses collection!')
  }

  const db = admin.firestore()

  try {
    const expenses_collection = db
      .collection('users')
      .doc(uid)
      .collection('expenses')

    if (Array.isArray(expense)) {
      expense.forEach(async e => {
        await expenses_collection.add({ ...e })
      })
    } else {
      await expenses_collection.add({ ...expense })
    }
  } catch (e) {
    console.error(e)
  }
}

export async function getExpenses({ uid, since }: Expense): Promise<Expense[]> {
  if (!uid) {
    throw new Error('Need a uid to get expenses')
  }

  const expenses: Expense[] = []
  const db = admin.firestore()

  try {
    if (since) {
      console.log(`~*~*~*~*~*~*~*~ ${since} ~*~*~*~*~*~*~*~`)

      const result = await db
        .collection('users')
        .doc(uid)
        .collection('expenses')
        .orderBy('last_modified', 'desc')
        .where('last_modified', '>', since)
        .get()

      const raw = await db
        .collection('users')
        .doc(uid)
        .collection('expenses')
        .get()

      console.log(
        `~*~*~*~*~*~*~*~ ${JSON.stringify(
          raw.forEach(doc => doc.data()),
        )} ~*~*~*~*~*~*~*~`,
      )

      result.forEach(doc => expenses.push(doc.data() as Expense))
    } else {
      const result = await db
        .collection('users')
        .doc(uid)
        .collection('expenses')
        .get()

      result.forEach(doc => expenses.push(doc.data() as Expense))
    }
  } catch (e) {
    console.error(e)
  }

  return expenses
}
