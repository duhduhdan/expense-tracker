import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import cors from 'cors'

import { addUser as addUserResource } from './resources/add-user'

admin.initializeApp(functions.config().firebase)

const corsHandler = cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: [
    'content-type',
    'cache-control',
    'pragma',
    'origin',
    'authorization',
    'x-requested-with',
    'x-kostnadr-uid',
  ],
})

const addUser = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const uid = req.get('x-kostnadr-uid') as string

    try {
      await addUserResource(uid)

      res.send(200)
    } catch (err) {
      console.error(err)
    }
  })
})

export { addUser }
