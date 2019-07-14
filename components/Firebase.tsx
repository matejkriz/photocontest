import React, { useEffect } from 'react';
import { firebaseConfig } from '../config/default';
import firebase from 'firebase/app';

export type FirebaseType = typeof firebase;

export const Firebase = ({
  children,
}: {
  children: (props: FirebaseType) => JSX.Element;
}) => {
  useEffect(() => {
    firebase.initializeApp(firebaseConfig);

    // firebaseui needs it on global window object
    (window as any).firebase = firebase;
  }, []);
  return children(firebase);
};
