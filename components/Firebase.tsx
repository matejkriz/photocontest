import { useEffect, useState, useRef } from 'react';
import firebase from 'firebase/app';
import 'firebase/analytics';

export type FirebaseType = typeof firebase;

export const Firebase = ({
  children,
}: {
  children: (props?: FirebaseType) => JSX.Element;
}) => {
  const [, forceUpdate] = useState();
  const firebaseInitialized = useRef<typeof firebase>();
  useEffect(() => {
    if (!firebaseInitialized.current) {
      firebase.initializeApp({
        apiKey: process.env.API_KEY,
        authDomain: process.env.AUTH_DOMAIN,
        databaseURL: process.env.DATABASE_URL,
        projectId: process.env.PROJECT_ID,
        storageBucket: process.env.STORAGE_BUCKET,
        messagingSenderId: process.env.MESSAGING_SENDER_ID,
        appId: process.env.APP_ID,
        measurementId: process.env.MEASUREMENT_ID,
      });
      firebase.analytics();
      firebaseInitialized.current = firebase;
      // firebaseui needs it on global window object
      window.firebase = firebase;
      forceUpdate({}); // rerender children when firebase is initialized
    }
  }, []);

  return children(firebaseInitialized.current);
};
