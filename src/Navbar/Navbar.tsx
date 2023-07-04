import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';

const Navbar = () => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setIsLoggedIn(!!user);
      });
  
      return () => unsubscribe();
    }, []);
  
    const logout = async () => {
      try {
        await signOut(auth);
        setIsLoggedIn(false);
      } catch (error) {
        console.log(error);
        // Handle the error here
      }
      window.location.href = '/signin';
    };
  
    const goToSignIn = () => {
      window.location.href = '/signin';
    };

  return (
    <header>
    <h1>WebDevs forum</h1>
    <nav>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/userslist">Forum-Users</a></li>
      <li><a href="/about">About</a></li>
      <li>      {isLoggedIn ? (
  <a onClick={logout}>Sign Out</a>
) : (
  <a onClick={goToSignIn}>Sign In / up</a>
)}</li>
    </ul>
  </nav>
  </header>
  )
}

export default Navbar