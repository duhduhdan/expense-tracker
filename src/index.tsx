import React from 'react'
import ReactDOM from 'react-dom'
import { Database } from '@nozbe/watermelondb'
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs'
import schema from './model/schema'
import Expense from './model/Expense'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'

const adapter = new LokiJSAdapter({ schema })

const database = new Database({
  adapter,
  modelClasses: [Expense],
  actionsEnabled: true,
})

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
