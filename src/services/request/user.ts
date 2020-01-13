const base = 'https://us-central1-kostnadr.cloudfunctions.net'

interface User {
  uid: string
  email: string
}

const defaultHeaders = {
  'content-type': 'application/json',
}

export async function createUser({ uid, email }: User): Promise<void> {
  if (!uid || !email) {
    throw new Error('Need a uid and email to create user!')
  }

  await fetch(`${base}/user`, {
    method: 'POST',
    headers: {
      ...defaultHeaders,
      'x-kostnadr-uid': uid,
    },
    body: JSON.stringify({ email }),
  })
}
