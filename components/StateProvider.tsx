import React, { createContext, useContext, useReducer, Dispatch } from 'react';
import { initialUserState, userReducer } from './Auth';

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

export const StateProvider: React.FunctionComponent = ({ children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);

export const useStateValue = () => useContext(StateContext);
