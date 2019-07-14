import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  Dispatch,
} from 'react';
import { initialUserState, userReducer } from './Auth';
import { FirebaseType } from './Firebase';

export interface State {
  user: {
    isSignedIn: boolean;
    email: string;
    name: string;
  };
}

export interface Action {
  type: ActionType;
  [key: string]: any;
}

export enum ActionType {
  authStateChanged = 'authStateChanged',
}

export const initialState = {
  user: { ...initialUserState },
};

const reducer = (state: State, action: Action) => ({
  user: userReducer(state, action),
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
