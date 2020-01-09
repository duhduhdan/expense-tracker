import React from 'react'
import ReactDOM from 'react-dom'
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider'
import { database } from './db'
import { AuthProvider } from './hooks/use-auth'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'

// import { generate } from './generate-data'

// generate(database)

ReactDOM.render(
  <DatabaseProvider database={database}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </DatabaseProvider>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
