import React, { useState } from 'react';
import './signIn.css';
import { auth, firestore, googleAuth, db } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { getDocs, collection, DocumentData, addDoc,where, query,  doc, getDoc } from 'firebase/firestore';

import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignIn = async () => {
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      const usersRef = collection(db, 'users');
      const userSnapshot = await getDoc(doc(usersRef, user.uid));
      if (!userSnapshot.exists()) {
        await addDoc(usersRef, {
          uid: user.uid,
          isAdmin: false
        });
      }
    } catch (error) {
      console.log(error);
      // Handle the error here
    }

    window.location.href = '/';
  };

  const handleSignInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuth);
      const { user } = result;
  
      // Check if the user already exists
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('uid', '==', user.uid));
      const userSnapshot = await getDocs(q);
  
      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        console.log(userData); // Retrieve user data
      } else {
        // Create a new user document
        await addDoc(usersRef, {
          uid: user.uid,
          isAdmin: false
        });
      }
    } catch (error) {
      console.log(error);
      // Handle the error here
    }
  };
  

  return (
    <div>      <Navbar/>
    
    <div className="container">
      <h1 className="text">SignIn/Up</h1>

      <input placeholder='email...' onChange={(e) => setEmail(e.target.value)} />
      <input placeholder='password.' type="password" onChange={(e) => setPassword(e.target.value)} />
      <br />
      <button type='submit' onClick={handleSignIn}>Submit</button>
      <br />
      <button onClick={handleSignInWithGoogle}>Sign in/up with Google</button>
      <br/>

      {errorMessage && <p className="error">{errorMessage}</p>}

    </div>
    </div>
  );
};

export default SignIn;
