import React, { useEffect, useState } from 'react';
import './app.css';
import { BrowserRouter, Link } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db, storage } from '../config/firebase'; // Import the storage object from your Firebase configuration file
import Navbar from '../Navbar/Navbar';


import {
  getDocs,
  collection,
  DocumentData,
  addDoc,
  doc,
  getDoc,
  deleteDoc,
  updateDoc // Import updateDoc from 'firebase/firestore'
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { display } from '@mui/system';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          '&.MuiButton-contained': {
            backgroundColor: '#333333',
            '&:hover': {
              backgroundColor: '#555555',
            },
          },
        },
      },
    },
  },
});

function App() {
  const msgCollectionRef = collection(db, 'messages');
  const usersCollectionRef = collection(db, 'users');
  const [msgList, setMsgList] = useState<DocumentData[]>([]);
  const [userList, setUserList] = useState<DocumentData[]>([]);
  const [newContent, setNewContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [likedMessages, setLikedMessages] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userCollection = collection(db, 'users');
        const userDocs = await getDocs(userCollection);
        const users = userDocs.docs.map((doc) => doc.data());
        setUserList(users);
        console.log(users);

        // Fetch the isAdmin field for each user
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

        // Upload the image file to Firebase Storage
        let imageUrl: string | null = null;
        if (selectedImage) {
          const storageRef = ref(storage, `images/${selectedImage.name}`);
          await uploadBytes(storageRef, selectedImage);
          imageUrl = await getDownloadURL(storageRef);
        }

        await addDoc(msgCollectionRef, {
          content: newContent,
          user: username,
          uid: uid,
          image: imageUrl, // Add the image URL to the document
          numberOfLikes: 0, // Initialize numberOfLikes field with 0
        });

        // Update msgList and reset the input fields
        setMsgList((prevMsgList) => [
          {
            content: newContent,
            user: username,
            image: imageUrl,
            numberOfLikes: 0,
          },
          ...prevMsgList,
        ]);
        setNewContent('');
        setSelectedImage(null);
      } else {
        // Display alert message if user is not logged in
        alert('You must log in to chat.');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onDeleteMsg = async (msgId: string) => {
    console.log(msgId);
    try {
      await deleteDoc(doc(db, 'messages', msgId));
      setMsgList((prevMsgList) => prevMsgList.filter((msg) => msg.id !== msgId));
    } catch (err) {
      console.log(err);
    }
  };

  const handleLike = async (msgId: string) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const messageRef = doc(db, 'messages', msgId);
        const messageDoc = await getDoc(messageRef);
        const messageData = messageDoc.data();

        if (messageData) {
          const likedByCollectionRef = collection(messageRef, 'LikedBy');
          const likedBySnapshot = await getDocs(likedByCollectionRef);
          const likedByData = likedBySnapshot.docs.map((doc) => doc.data());

          const likedByUser = likedByData.find((likedBy) => likedBy.userId === user.uid);
          if (likedByUser) {
            // If the user has already liked the message, display an alert
            alert("You can't like a message more than once.");
          } else {
            // Update the message's numberOfLikes field and add the user's UID to the LikedBy collection
            await updateDoc(messageRef, {
              numberOfLikes: (messageData.numberOfLikes || 0) + 1,
            });

            await addDoc(likedByCollectionRef, {
              userId: user.uid,
            });

            // Add the liked message to the likedMessages state
            setLikedMessages((prevLikedMessages) => [...prevLikedMessages, msgId]);
          }
        }
      } else {
        // Display alert message if user is not logged in
        alert('You must log in to like a message.');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="App" style={{ position: 'fixed', width: '100%', height: '100%' }}>
        <Navbar />
        <div style={{ display: "flex" }}>
          <div className="msgsarea">
            <div className="messages-container">
              {msgList.map((msg, index) => {
                const user = userList.find((user) => user.uid === msg.uid);
                console.log(user);
                console.log(user?.isAdmin);
                // Check if the current message is posted by the logged-in user
                const isCurrentUserMessage = auth.currentUser && auth.currentUser.uid === msg.uid;
                const isLiked = likedMessages.includes(msg.id);

                return (
                  <div key={index} className="forum-details">
                    <h4 style={{ color: user?.isAdmin ? 'red' : 'black', textDecoration: "underline" }}>posted by - {msg.user}</h4>
                    {msg.image && <img src={msg.image} alt="Uploaded" style={{ maxWidth: '300px' }} />}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <p className="post-content" style={{ minWidth: "px" }}>{msg.content}</p>
                      {isLiked ? (
                        <FavoriteIcon onClick={() => handleLike(msg.id)} style={{ color: '#F1576C' }} />
                      ) : (
                        <FavoriteBorderIcon onClick={() => handleLike(msg.id)} />
                      )}
                      <span>{msg.numberOfLikes}</span>
                    </div>

                    {isCurrentUserMessage && (
                      <Button variant="contained" style={{height:"30px"}} onClick={() => onDeleteMsg(msg.id)}>Delete</Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className='sendingMessage'>
            <input type="file" onChange={(e) => setSelectedImage(e.target.files ? e.target.files[0] : null)} />
            <br />
            <textarea
              style={{ height: '100px', width: '300px', resize: 'vertical' }}
              placeholder="post something here :)"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
            <br />
            <Button variant="contained" onClick={onPostMsg}>Post</Button>
          </div>
        </div>

        <footer>
          <p>&copy; 2023 WebDevs forum. All rights reserved.</p>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
