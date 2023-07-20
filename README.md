# Setting up Instructions

### in order for this project to work properly you'll also need to set up a simple backend flask app                                
a fully detailed explanation is aveliable here:                                                                                         
https://github.com/BakalMode/Firebase-forum-project-back                                                                                

### to install all packedges used in this project you'll need to enter                                                                
this command: npm i                                                                                                                 

### afterwards you will need to modify the config file / firebase.tsx                                                                   

const firebaseConfig = {
  apiKey: "AIzaSyCxWqgU4jjyMtLaE7oVERLSxxxxxxxxx",
  authDomain: "proj-xxxxx.firebaseapp.com",
  projectId: "proj-xxxxx",
  storageBucket: "proj-xxxxxxx.appspot.com",
  messagingSenderId: "689xxxxxxx",
  appId: "1:689xxxxxx:web:43xxxxxx",
  measurementId: "G-4xxxxxVSV"
};
                                                                                                                                        
you will need to go to your firebase project and get  yoour firebaseConfig and paste it in firebase.tsx                                  

for the final step do: npm start. and enjoy :) 




