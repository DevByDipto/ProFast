import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "../../firebase/firebaseinit";
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [loading,setLoading] = useState(true)
const provider = new GoogleAuthProvider();

const signinWithGoogle=()=>{
 return signInWithPopup(auth, provider)
}
    
  const createUser = (email, password) => {
    //??????????????????aikhane loading true korar gurotto??
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logoutUser=()=>{
     signOut(auth)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log({currentUser});
      
        setUser(currentUser);
        setLoading(false)
      return () => {
        unsubscribe();
      };
    });
  });

  const authInfo = {
    createUser,
    signInUser,
    user,
    loading,
    signinWithGoogle,
    logoutUser,
  };

  return <AuthContext value={authInfo}>{children}</AuthContext>;
};

export default AuthProvider;
