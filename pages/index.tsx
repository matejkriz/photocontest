import React, { useEffect } from 'react';
// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from 'firebase/app';
import { firebaseConfig } from '../config/default';

// Add the Firebase products that you want to use
// import 'firebase/auth';
// import 'firebase/firestore';
// import 'firebase/storage';

const Index = () => {
  useEffect(() => {
    firebase.initializeApp(firebaseConfig);
  }, []);

  return (
    <div>
      <h1>init</h1>
      <p>App: {firebase.app.name}</p>
    </div>
  );
};

export default Index;
