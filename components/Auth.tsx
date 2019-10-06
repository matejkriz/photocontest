import React, { useEffect } from 'react';
import { FirebaseType } from './Firebase';
import { useStateValue } from './StateProvider';
import { Button } from 'semantic-ui-react';

import firebaseApp from 'firebase/app';
import 'firebase/auth';

const firebaseUIContainerID = 'firebaseui-auth-container';

// Promise that resolves unless the FirebaseUI instance is currently being deleted.
let firebaseUiDeletion = Promise.resolve();

// FirebaseUI config.
const uiConfig = {
  signInSuccessUrl: '/login',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    {
      provider: firebaseApp.auth.EmailAuthProvider.PROVIDER_ID,
      signInMethod:
        firebaseApp.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
    },
    {
      provider: firebaseApp.auth.GoogleAuthProvider.PROVIDER_ID,
    },
    {
      provider: firebaseApp.auth.FacebookAuthProvider.PROVIDER_ID,
    },
  ],
  // tosUrl and privacyPolicyUrl accept either url string or a callback
  // function.
  // Terms of service url/callback.
  tosUrl: '/',
  // Privacy policy url/callback.
  privacyPolicyUrl: '/',
};

interface Props {
  firebase?: FirebaseType;
}

export function Auth({ firebase }: Props) {
  const [{ user }] = useStateValue();

  useEffect(() => {
    if (firebase) {
      let unsubscribe: (() => void) | null = null;
      firebase.auth().onAuthStateChanged(userAuth => {
        // Remove previous listener.
        if (unsubscribe) {
          unsubscribe();
        }
        // On user login add new listener.
        if (userAuth) {
          // Check if refresh is required.
          unsubscribe = firebase
            .firestore()
            .collection('users')
            .doc(userAuth.uid)
            .onSnapshot(function handleUserChange(doc) {
              const data = doc.data();

              const refreshDate = !!data && data.refreshDate;
              if (refreshDate && new Date() >= new Date(refreshDate)) {
                // Force refresh to pick up the latest custom claims changes.
                // Note this is always triggered on first call. Further optimization could be
                // added to avoid the initial trigger when the token is issued and already contains
                // the latest claims.

                userAuth.getIdToken(true);
              }
            });
        }
      });
    }
  }, [firebase]);

  useEffect(() => {
    if (firebase) {
      // Wait in case the firebase UI instance is being deleted.
      // This can happen if you unmount/remount the element quickly.
      firebaseUiDeletion.then(() => {
        const authUI = window.firebaseui.auth.AuthUI;
        // Initialize the FirebaseUI Widget using Firebase.
        const firebaseUiWidget =
          authUI.getInstance() || new authUI(firebase.auth());

        // The start method will wait until the DOM is loaded.
        firebaseUiWidget.start(`#${firebaseUIContainerID}`, uiConfig);

        const unregisterAuthObserver = firebase
          .auth()
          .onAuthStateChanged(userAuth => {
            if (!userAuth && user.isSignedIn) {
              firebaseUiWidget.reset();
            }
          });
        return () => {
          // Clean up the subscription
          firebaseUiDeletion = firebaseUiDeletion.then(() => {
            unregisterAuthObserver();
            return firebaseUiWidget.delete();
          });
        };
      });
    }
  }, []);

  return (
    <div>
      <div id={firebaseUIContainerID} />
      {firebase && user.isSignedIn && (
        <Button onClick={() => firebase.auth().signOut()}>Odhlásit</Button>
      )}
    </div>
  );
}
