import * as admin from 'firebase-admin'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

interface User {
  uid: string
  email: string
}

export async function createUser({ uid, email }: User) {
  if (!uid) {
    throw new Error('Failed to add user, need a uid!')
  }

  const db = admin.firestore()

  try {
    const ref = db.collection('users').doc(uid)

    await ref.set({
      uid,
      email,
      created_at: dayjs.utc().format(),
    })
  } catch (e) {
    console.error(e)
  }
}
