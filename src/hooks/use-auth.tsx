import React, { useEffect, useState, useContext, createContext } from 'react'
import firebase from 'firebase'
import 'firebase/auth'

firebase.initializeApp({
  apiKey: 'AIzaSyDbhXwyhj1BmfEaIHgZ7cgD3ypSiH5i0JY',
  authDomain: 'kostnadr.firebaseapp.com',
  databaseURL: 'https://kostnadr.firebaseio.com',
  projectId: 'kostnadr',
  storageBucket: 'kostnadr.appspot.com',
  messagingSenderId: '739070515575',
  appId: '1:739070515575:web:030aa8b50dedb688f9a972',
})

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const auth = useProviderAuth()

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

function useProviderAuth() {
  const [user, setUser] = useState(null)

  async function signin(email: string, password: string) {
    const response = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)

    setUser(response.user)
  }

  async function signup(email: string, password: string) {
    const response = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)

    setUser(response.user)
  }

  async function signout() {
    await firebase.auth().signOut()

    setUser(false)
  }

  async function sendPasswordResetEmail(email: string) {
    await firebase.auth().sendPasswordResetEmail(email)
  }

  async function confirmPasswordReset(code: string, password: string) {
    await firebase.auth().confirmPasswordReset(code, password)
  }

  useEffect(() => {
    const unsub = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user)
      } else {
        setUser(false)
      }
    })

    return () => unsub()
  })

  return {
    user,
    signin,
    signup,
    signout,
    sendPasswordResetEmail,
    confirmPasswordReset,
  }
}
