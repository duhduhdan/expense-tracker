import * as admin from 'firebase-admin'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export async function addUser(uid: string) {
  const db = admin.firestore()

  try {
    await db.collection('users').add({
      uid,
      created_at: dayjs.utc().format(),
    })
  } catch (e) {
    console.error(e)
  }
}
