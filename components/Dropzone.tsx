import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Button,
  Header,
  Icon,
  Segment,
  Progress,
  Message,
} from 'semantic-ui-react';
import { Action, ActionType, State, useStateValue } from './StateProvider';
import { FirebaseType } from './Firebase';
import { FirebaseError } from 'firebase/app';

interface Props {
  firebase: FirebaseType;
}

enum ProgressStates {
  inactive = 'inactive',
  active = 'active',
  paused = 'paused',
  error = 'error',
}

export const fileReducer = (state: State, action: Action) => {
  switch (action.type) {
    case ActionType.fileUploaded:
      return [...state.uploadedFiles, action.fileUrl];

    default:
      return state.uploadedFiles;
  }
};

export function Dropzone({ firebase }: Props) {
  const [progress, setProgress] = useState(0);
  const [progressState, setProgressState] = useState(ProgressStates.inactive);
  const [error, setError] = useState('');
  const [{}, dispatch] = useStateValue();

  const handleSuccess = async (uploadTask: firebase.storage.UploadTask) => {
    // Upload completed successfully, now we can get the download URL
    const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
    dispatch({
      type: ActionType.fileUploaded,
      fileUrl: downloadURL,
    });
  };

  const handleSnapshot = (snapshot: firebase.storage.UploadTaskSnapshot) => {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    setProgress(
      Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
    );

    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED:
        setProgressState(ProgressStates.paused);
        break;
      case firebase.storage.TaskState.RUNNING:
        setProgressState(ProgressStates.active);
        break;
    }
  };

  const handleError = (error: FirebaseError) => {
    setError(error.message);
    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
      case 'storage/unauthorized':
        // User doesn't have permission to access the object
        break;

      case 'storage/canceled':
        // User canceled the upload
        break;

      case 'storage/unknown':
        // Unknown error occurred, inspect error.serverResponse
        break;
    }
  };

  const onDrop = useCallback(
    (
      acceptedFiles: Array<{
        readonly name: string;
        readonly size: number;
        readonly type: string;
        slice(start?: number, end?: number, contentType?: string): Blob;
      }>,
    ) => {
      if (firebase) {
        var storageRef = firebase.storage().ref();
        const reader = new FileReader();

        reader.onabort = () => console.log('file reading was aborted');
        reader.onerror = () => console.log('file reading has failed');

        acceptedFiles.forEach(file => {
          // Upload file and metadata to the object 'images/mountains.jpg'
          var uploadTask = storageRef.child('photos/' + file.name).put(file);

          // Listen for state changes, errors, and completion of the upload.
          uploadTask.on(
            firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            handleSnapshot,
            // @ts-ignore wrong fireabse typing
            handleError,
            () => handleSuccess(uploadTask),
          );
        });
      }
    },
    [],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Segment placeholder inverted>
        <Header icon>
          <Icon name="images" />
          {isDragActive
            ? 'Přetáhněte soubory sem...'
            : 'Nahrajte fotky do soutěže.'}
        </Header>
        <Button inverted color="yellow" primary size="massive">
          Vybrat soubory
        </Button>
      </Segment>
      {progressState !== ProgressStates.inactive && (
        <Progress
          percent={progress}
          progress
          success={progress === 100}
          disabled={progressState === ProgressStates.paused}
          error={progressState === ProgressStates.error}
        />
      )}
      {error && (
        <Message negative>
          <Message.Header>{error}</Message.Header>
        </Message>
      )}
    </div>
  );
}
