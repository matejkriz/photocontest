import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  Dispatch,
} from 'react';
import { FirebaseType } from './Firebase';
import 'firebase/auth';

export interface User {
  isSignedIn: boolean;
  email: string;
  name: string;
  uid: string;
}

export interface State {
  user: User;
  uploadedFiles: {
    [uuid: string]: Photo;
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Action<P = any> {
  type: ActionType;
  payload?: P;
}

export enum ActionType {
  authStateChanged = 'authStateChanged',
  fileUploaded = 'fileUploaded',
  progressStateUpdate = 'progressStateUpdate',
  progressUpdate = 'progressUpdate',
  uploadedPhotosFetched = 'uploadedPhotosFetched',
}

export enum ProgressStates {
  inactive = 'inactive',
  active = 'active',
  paused = 'paused',
  error = 'error',
}

export interface Photo {
  uid?: string;
  url: string;
  name: string;
  progress?: number;
  progressState?: ProgressStates;
  category: string;
  description?: string;
  author?: string;
}

export const initialUserState = {
  isSignedIn: false,
  email: '',
  name: '',
  uid: '',
};

export const initialState = {
  user: { ...initialUserState },
  uploadedFiles: {},
};

export const userReducer = (state: State, action: Action) => {
  switch (action.type) {
    case ActionType.authStateChanged:
      const { user } = action.payload;
      return {
        ...state.user,
        ...user,
      };

    default:
      return state.user;
  }
};

export const fileReducer = (state: State, action: Action) => {
  switch (action.type) {
    case ActionType.fileUploaded: {
      const { uuid, name, url } = action.payload;
      return {
        ...state.uploadedFiles,
        [uuid]: { ...state.uploadedFiles[uuid], url, name },
      };
    }
    case ActionType.progressUpdate: {
      const { uuid, progress } = action.payload;
      return {
        ...state.uploadedFiles,
        [uuid]: { ...state.uploadedFiles[uuid], progress },
      };
    }
    case ActionType.progressStateUpdate: {
      const { uuid, progressState } = action.payload;
      return {
        ...state.uploadedFiles,
        [uuid]: { ...state.uploadedFiles[uuid], progressState },
      };
    }
    case ActionType.uploadedPhotosFetched: {
      const { fetchedPhotos } = action.payload;
      return {
        ...state.uploadedFiles,
        ...fetchedPhotos,
      };
    }

    default:
      return state.uploadedFiles;
  }
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
            payload: {
              user: userAuth
                ? {
                    isSignedIn: true,
                    email: `${userAuth.email}`,
                    name: '',
                    uid: userAuth.uid,
                  }
                : initialUserState,
            },
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
