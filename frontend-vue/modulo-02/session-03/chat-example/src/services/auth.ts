import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
  } from 'firebase/auth'
  import { auth } from '../firebase'
  
  export const registerUser = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      return userCredential
    } catch (error: any) {
      throw new Error(error.message || 'Error al registrar')
    }
  }
  
  export const loginUser = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return userCredential
    } catch (error: any) {
      throw new Error(error.message || 'Error al iniciar sesión')
    }
  }
  
  export const logoutUser = () => signOut(auth)
  
  export const onUserStateChange = (callback: (user: any) => void) => {
    onAuthStateChanged(auth, callback)
  }