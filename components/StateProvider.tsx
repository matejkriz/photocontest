import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  Dispatch,
} from 'react';
import { FirebaseType } from './Firebase';
import 'firebase/auth';
import 'firebase/firestore';

export interface User {
  isSignedIn?: boolean;
  email: string;
  name: string;
  uid: string;
}

export interface State {
  user: User;
  uploadedFiles: {
    [uuid: string]: File;
  };
  photos: {
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
  photosFetched = 'photosFetched',
  userUpdated = 'userUpdated',
}

export enum ProgressStates {
  inactive = 'inactive',
  active = 'active',
  paused = 'paused',
  error = 'error',
}

export interface File {
  uid?: string;
  url: string;
  name: string;
  progress?: number;
  progressState?: ProgressStates;
}

export interface Photo {
  uid?: string;
  url: string;
  viewFilePath: string;
  thumbFilePath: string;
  name: string;
  category: string;
  description?: string;
  author?: string;
}

export const initialUserState = {
  isSignedIn: undefined,
  email: '',
  name: '',
  uid: '',
};

export const initialFileState: File = {
  uid: '',
  url: '',
  name: '',
  progress: 0,
  progressState: ProgressStates.inactive,
};

export const initialPhotoState: Photo = {
  uid: '',
  url: '',
  viewFilePath: '',
  thumbFilePath: '',
  name: '',
  category: '',
  description: '',
  author: '',
};

export const initialState = {
  user: { ...initialUserState },
  uploadedFiles: {},
  photos: {},
};

export const userReducer = (state: State, action: Action) => {
  switch (action.type) {
    case ActionType.authStateChanged: {
      const { user } = action.payload;
      return {
        ...state.user,
        ...user,
      };
    }
    case ActionType.userUpdated: {
      const { user } = action.payload;
      return {
        ...state.user,
        ...user,
      };
    }
    default: {
      return state.user;
    }
  }
};

export const fileReducer = (state: State, action: Action) => {
  switch (action.type) {
    case ActionType.fileUploaded: {
      const { uuid, name, url } = action.payload;
      return {
        ...state.uploadedFiles,
        [uuid]: {
          ...initialFileState,
          ...state.uploadedFiles[uuid],
          url,
          name,
        },
      };
    }
    case ActionType.progressUpdate: {
      const { uuid, progress } = action.payload;
      return {
        ...state.uploadedFiles,
        [uuid]: {
          ...initialFileState,
          ...state.uploadedFiles[uuid],
          progress,
        },
      };
    }
    case ActionType.progressStateUpdate: {
      const { uuid, progressState } = action.payload;
      return {
        ...state.uploadedFiles,
        [uuid]: { ...state.uploadedFiles[uuid], progressState },
      };
    }
    default:
      return state.uploadedFiles;
  }
};

export const photoReducer = (state: State, action: Action) => {
  switch (action.type) {
    case ActionType.photosFetched: {
      const { fetchedPhotos } = action.payload;
      return {
        ...state.photos,
        ...fetchedPhotos,
      };
    }

    default:
      return state.photos;
  }
};

const reducer = (state: State, action: Action) => ({
  user: userReducer(state, action),
  uploadedFiles: fileReducer(state, action),
  photos: photoReducer(state, action),
});

export const StateContext = createContext((undefined as unknown) as [
  State,
  Dispatch<Action>
]);

interface Props {
  firebase?: FirebaseType;
}

function subscribeForUserUpdate(
  firebase: FirebaseType,
  dispatch: Dispatch<Action>,
  user: User,
) {
  const db = firebase.firestore();
  const ref = db.collection('users').doc(user.uid);

  const unsubscribe = ref.onSnapshot(snapshot => {
    dispatch({
      type: ActionType.userUpdated,
      payload: {
        user: snapshot.data(),
      },
    });
  });

  return unsubscribe;
}

export const StateProvider: React.FunctionComponent<Props> = ({
  children,
  firebase,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const isSignedIn = !!state.user.isSignedIn;

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
                    uid: userAuth.uid,
                  }
                : { initialUserState, isSignedIn: false },
            },
          });
        });
      return () => {
        unregisterAuthObserver();
      };
    }
  }, [firebase]);

  useEffect(() => {
    const { user } = state;
    if (firebase && isSignedIn) {
      return subscribeForUserUpdate(firebase, dispatch, user);
    }
  }, [firebase, isSignedIn, state]);

  return (
    <StateContext.Provider value={[state, dispatch]}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateValue = () => useContext(StateContext);
