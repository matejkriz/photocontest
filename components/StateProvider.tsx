import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  Dispatch,
} from 'react';
import { initialUserState, userReducer } from './Auth';
import { fileReducer } from './Dropzone';
import { FirebaseType } from './Firebase';

export interface State {
  user: {
    isSignedIn: boolean;
    email: string;
    name: string;
    uid: string;
  };
  uploadedFiles: {
    [uuid: string]: Photo;
  };
}

export interface Action {
  type: ActionType;
  [key: string]: any;
}

export enum ActionType {
  authStateChanged = 'authStateChanged',
  fileUploaded = 'fileUploaded',
  progressStateUpdate = 'progressStateUpdate',
  progressUpdate = 'progressUpdate',
}

export enum ProgressStates {
  inactive = 'inactive',
  active = 'active',
  paused = 'paused',
  error = 'error',
}

export interface Photo {
  url: string;
  name: string;
  progress: number;
  progressState: ProgressStates;
  category?: string;
  description?: string;
  author?: string;
}

export const initialState = {
  user: { ...initialUserState },
  uploadedFiles: {},
};

const reducer = (state: State, action: Action) => ({
  user: userReducer(state, action),
  uploadedFiles: fileReducer(state, action),
});

export const StateContext = createContext((undefined as unknown) as [
  State,
  Dispatch<Action>
]);

interface Props {
  firebase?: FirebaseType;
}

export const StateProvider: React.FunctionComponent<Props> = ({
  children,
  firebase,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    if (firebase) {
      const unregisterAuthObserver = firebase
        .auth()
        .onAuthStateChanged(userAuth => {
          dispatch({
            type: ActionType.authStateChanged,
            user: userAuth
              ? {
                  isSignedIn: true,
                  email: `${userAuth.email}`,
                  name: '',
                  uid: userAuth.uid,
                }
              : initialUserState,
          });
        });
      return () => {
        unregisterAuthObserver();
      };
    }
  }, [firebase]);

  return (
    <StateContext.Provider value={[state, dispatch]}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateValue = () => useContext(StateContext);
