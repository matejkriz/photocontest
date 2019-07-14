import React, { useEffect } from 'react';
import { Action, ActionType, State, useStateValue } from './StateProvider';
import { Button } from 'semantic-ui-react';

import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseUIContainerID = 'firebaseui-auth-container';

// Promise that resolves unless the FirebaseUI instance is currently being deleted.
let firebaseUiDeletion = Promise.resolve();

// FirebaseUI config.
const uiConfig = {
  signInSuccessUrl: '/',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
    },
  ],
  // tosUrl and privacyPolicyUrl accept either url string or a callback
  // function.
  // Terms of service url/callback.
  tosUrl: '/podminky',
  // Privacy policy url/callback.
  privacyPolicyUrl: '/soukromi',
};

export const userReducer = (state: State, action: Action) => {
  switch (action.type) {
    case ActionType.authStateChanged:
      return {
        ...state.user,
        ...action.user,
      };

    default:
      return state.user;
  }
};

export const initialUserState = {
  isSignedIn: false,
  email: '',
  name: '',
};

export function Auth() {
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
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
  }, []);

  return (
    <div>
      <div id={firebaseUIContainerID} />
      {user.isSignedIn && (
        <Button onClick={() => firebase.auth().signOut()}>Odhlásit</Button>
      )}
    </div>
  );
}
