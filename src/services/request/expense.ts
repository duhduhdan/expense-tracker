const base = 'https://us-central1-kostnadr.cloudfunctions.net'

const defaultHeaders = {
  'content-type': 'application/json',
}

interface Expense {
  uid: string
  expense?: any | any[]
  id?: string
  since?: number
}

export async function createExpense({ uid, expense }: Expense): Promise<void> {
  if (!uid || !expense) {
    throw new Error('Need a uid and expense to create an expense!')
  }

  await fetch(`${base}/expense`, {
    method: 'POST',
    headers: {
      ...defaultHeaders,
      'x-kostnadr-uid': uid,
    },
    body: JSON.stringify({ expense }),
  })
}

export async function getExpenses({ uid, since }: Expense): Promise<any> {
  if (!uid) {
    throw new Error('Need a uid to get expenses!')
  }

  let url: string

  if (since) {
    url = `${base}/expense?since=${since}`
  } else {
    url = `${base}/expense`
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      ...defaultHeaders,
      'x-kostnadr-uid': uid,
    },
  })

  return response.json()
}
