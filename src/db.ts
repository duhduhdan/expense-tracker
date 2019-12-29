import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs'
import { Database } from '@nozbe/watermelondb'
import Expense from './model/Expense'
import schema from './model/schema'

const adapter = new LokiJSAdapter({ schema })

export const database = new Database({
  adapter,
  modelClasses: [Expense],
  actionsEnabled: true,
})
