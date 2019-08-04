import { useEffect, useState, useRef } from 'react';
import { firebaseConfig } from '../config/default';
import firebase from 'firebase/app';
import 'firebase/storage';

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
      firebase.initializeApp(firebaseConfig);
      firebaseInitialized.current = firebase;
      // firebaseui needs it on global window object
      (window as any).firebase = firebase;
      forceUpdate({}); // rerender children when firebase is initialized
    }
  }, []);

  return children(firebaseInitialized.current);
};
