import React, { useState, useEffect, PropsWithChildren } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseUIContainerID = 'firebaseui-auth-container';

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

const initialUserState = { isSignedIn: false, email: '', displayName: '' };
export const UserContext = React.createContext(initialUserState);

export function Auth({ children }: PropsWithChildren<{}>) {
  const [user, setUser] = useState(initialUserState);

  useEffect(() => {
    const authUI = window.firebaseui.auth.AuthUI;
    // Initialize the FirebaseUI Widget using Firebase.
    const ui = authUI.getInstance() || new authUI(firebase.auth());

    // The start method will wait until the DOM is loaded.
    ui.start(`#${firebaseUIContainerID}`, uiConfig);
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged(registerUser =>
        setUser(
          registerUser
            ? {
                isSignedIn: true,
                email: `${registerUser.email}`,
                displayName: '',
              }
            : initialUserState,
        ),
      );

    return () => {
      // Clean up the subscription
      unregisterAuthObserver();
    };
  }, []);

  return (
    <UserContext.Provider value={user}>
      <div id={firebaseUIContainerID} />
      {children}
    </UserContext.Provider>
  );
}
