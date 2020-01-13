import * as admin from 'firebase-admin'
import * as express from 'express'
import * as functions from 'firebase-functions'
import cors from 'cors'

import { createUser } from './resources/user'
import { createExpense, getExpenses } from './resources/expense'

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

const user = functions.https.onRequest(
  async (req: express.Request, res: express.Response) => {
    corsHandler(req, res, async () => {
      const uid = req.get('x-kostnadr-uid') as string
      const { email } = req.body

      try {
        await createUser({ uid, email })

        res.send(200)
      } catch (err) {
        console.error(err)
      }
    })
  },
)

const expense = functions.https.onRequest(
  async (req: express.Request, res: express.Response) => {
    corsHandler(req, res, async () => {
      const uid = req.get('x-kostnadr-uid') as string
      const { expense, id } = req.body
      const { since } = req.query
      const { method } = req

      try {
        switch (method) {
          case 'POST':
            await createExpense({ uid, expense, id })
            res.send(200)
            break
          case 'GET':
            const expenses = await getExpenses({ uid, since })
            res.send({ expenses })
            break
          default:
            throw new Error('Invalid method type')
        }
      } catch (err) {
        console.error(err)
        res.send(500).send(err)
      }
    })
  },
)

export { expense, user }
