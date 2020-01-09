const base = 'https://us-central1-kostnadr.cloudfunctions.net'

export async function createUser({ uid }) {
  await fetch(`${base}/addUser`, {
    method: 'POST',
    headers: {
      'x-kostnadr-uid': uid,
    },
  })
}
