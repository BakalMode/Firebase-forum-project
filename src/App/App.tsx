import React, { useEffect, useState } from 'react';
import './app.css';
import { BrowserRouter, Link } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import Navbar from '../Navbar/Navbar';
import { db } from '../config/firebase';
import { getDocs, collection, DocumentData, addDoc, doc, getDoc, deleteDoc } from 'firebase/firestore';

function App() {
  const msgCollectionRef = collection(db, 'messages');
  const usersCollectionRef = collection(db, 'users');
  const [msgList, setMsgList] = useState<DocumentData[]>([]);
  const [userList, setUserList] = useState<DocumentData[]>([]);
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userCollection = collection(db, 'users');
        const userDocs = await getDocs(userCollection);
        const users = userDocs.docs.map((doc) => doc.data());
        setUserList(users);
        console.log(userList);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const getMsgList = async () => {
      try {
        const data = await getDocs(msgCollectionRef);
        const filteredData = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setMsgList(filteredData.reverse());
      } catch (err) {
        console.log(err);
      }
    };

    getMsgList();
  }, []);

  const onPostMsg = async () => {
    try {
      const user = auth.currentUser; // Get the currently signed-in user
      if (user && user.email) {
        // Existing code for authenticated user
        const username = user.displayName || user.email.split('@')[0];
        const uid = user.uid;
        await addDoc(msgCollectionRef, {
          content: newContent,
          user: username,
          uid: uid,
        });
  
        // Update msgList and reset the input tag
        setMsgList((prevMsgList) => [
          {
            content: newContent,
            user: username,
          },
          ...prevMsgList,
        ]);
        setNewContent('');
      } else {
        // Display alert message if user is not logged in
        alert('You must log in to chat.');
      }
    } catch (err) {
      console.log(err);
    }
  };
  

  const onDeleteMsg = async (msgId: string) => {
    console.log(msgId)
    try {
      await deleteDoc(doc(db, 'messages', msgId));
      setMsgList((prevMsgList) => prevMsgList.filter((msg) => msg.id !== msgId));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="App" style={{ position: 'fixed', width: '100%', height: '100%' }}>
      <Navbar />

      <div className="msgsarea">
        <div className="messages-container">
          {msgList.map((msg, index) => {
            const user = userList.find((user) => user.uid === msg.uid);
            console.log(user?.isAdmin)
            // Check if the current message is posted by the logged-in user
            const isCurrentUserMessage = auth.currentUser && auth.currentUser.uid === msg.uid;
            return (
              <div key={index} className="forum-details">
                <h4 style={{ color: user?.isAdmin ? 'red' : 'black' }}>posted by - {msg.user}</h4>
                <p className="post-content">{msg.content}</p>


                {isCurrentUserMessage && (
                  <button onClick={() => onDeleteMsg(msg.id)}>Delete</button>
                )}
                {isCurrentUserMessage && (
                  <button>Update</button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <textarea
          style={{ height: '100px', width: '300px', resize: 'vertical' }}
          placeholder="post something here :)"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
        />
        <br />
        <button onClick={onPostMsg}>Post</button>
      </div>

      <footer>
        <p>&copy; 2023 WebDevs forum. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
