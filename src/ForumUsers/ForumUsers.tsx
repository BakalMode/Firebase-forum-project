import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import { auth } from '../config/firebase'; // Import the Firebase auth instance

const ForumUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        fetchUsers();
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe(); // Cleanup the listener when the component is unmounted
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users');
      const data = await response.json();
      const modifiedUsers = data.map((user: any) => {
        if (!user.displayName) {
          const emailParts = user.email.split('@');
          const name = emailParts[0];
          user.displayName = name;
        }
        return user;
      });
      setUsers(modifiedUsers);
    } catch (error) {
      console.log('Error fetching users:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div>
        <h1>User List</h1>
        {isLoggedIn ? (
          <ul>
            {users.map((user: any) => (
              <li key={user.uid}>
                Email: {user.email}, Display Name: {user.displayName}
              </li>
            ))}
          </ul>
        ) : (
          <p>You must be logged in to see the list of users.</p>
        )}
      </div>
    </div>
  );
};

export default ForumUsers;
