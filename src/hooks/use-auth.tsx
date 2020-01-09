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
  const [errors, setErrors] = useState(null)

  async function login(email: string, password: string) {
    try {
      const response = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password)

      setErrors(null)
      setUser(response.user)
    } catch (error) {
      setErrors(error)
    }
  }

  async function signup(email: string, password: string) {
    try {
      const response = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)

      setErrors(null)
      setUser(response.user)
    } catch (error) {
      setErrors(error)
    }
  }

  async function signout() {
    try {
      await firebase.auth().signOut()

      setUser(false)
      setErrors(null)
    } catch (error) {
      setErrors(error)
    }
  }

  async function sendPasswordResetEmail(email: string) {
    try {
      setUser(false)
      await firebase.auth().sendPasswordResetEmail(email)
    } catch (error) {
      setErrors(error)
    }
  }

  async function confirmPasswordReset(code: string, password: string) {
    try {
      setUser(false)
      await firebase.auth().confirmPasswordReset(code, password)
    } catch (error) {
      setErrors(error)
    }
  }

  useEffect(() => {
    const unsub = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log(user)
        setUser(user)
      } else {
        setUser(false)
      }
    })

    return () => unsub()
  })

  return {
    errors,
    user,
    login,
    signup,
    signout,
    sendPasswordResetEmail,
    confirmPasswordReset,
  }
}
