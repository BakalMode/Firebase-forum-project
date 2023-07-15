import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Container,
  Avatar,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  CssBaseline,
  Link as MuiLink,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import './signIn.css';
import { auth, firestore, googleAuth, db } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { getDocs, collection, DocumentData, addDoc, where, query, doc, getDoc } from 'firebase/firestore';

import Navbar from '../Navbar/Navbar';

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

const theme2 = createTheme({
  palette: {
    primary: {
      main: '#333333', // Custom color for buttons and text fields
    },
  },
});

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignIn = async () => {
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      const usersRef = collection(db, 'users');
      const userSnapshot = await getDoc(doc(usersRef, user.uid));
      if (!userSnapshot.exists()) {
        await addDoc(usersRef, {
          uid: user.uid,
          isAdmin: false,
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
          isAdmin: false,
        });
      }
    } catch (error) {
      console.log(error);
      // Handle the error here
    }
    window.location.href = '/';
  };

  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' , backgroundColor:"black" }}>
            <LockOutlinedIcon/>
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in / up
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <ThemeProvider theme={theme2}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                color='primary'
              />
            </ThemeProvider>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSignIn}
            >
              Sign In / Up
            </Button>
            <Button
              fullWidth
              variant="contained"
              sx={{ mb: 2 }}
              onClick={handleSignInWithGoogle}
            >
              Sign in/up with Google
            </Button>
            {errorMessage && (
              <Typography variant="body2" color="error">
                {errorMessage}
              </Typography>
            )}
          </Box>
          <MuiLink href="/forgotpassword" variant="body2">
            Forgot password?
          </MuiLink>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default SignIn;
