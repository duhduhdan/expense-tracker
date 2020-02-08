import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'

import { useAuth } from './hooks/use-auth'
import { ExpensesScreen } from './screens/ExpensesScreen'
import { LoginScreen } from './screens/LoginScreen'

function PrivateRoute({ children, ...rest }) {
  const { user } = useAuth()

  return (
    <Route
      {...rest}
      render={({ location }) =>
        !!user ? (
          children
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: location } }} />
        )
      }
    />
  )
}

function App({ database }) {
  return (
    <Router>
      <Switch>
        <Route path="/login">
          <LoginScreen />
        </Route>
        <PrivateRoute path="/">
          <ExpensesScreen database={database} />
        </PrivateRoute>
      </Switch>
    </Router>
  )
}

export default App
