import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, Header, Icon, Segment, Message } from 'semantic-ui-react';
import { ActionType, useStateValue, ProgressStates } from './StateProvider';
import { getUUID } from '../lib/uuid';
import 'firebase/storage';
import firebase, { FirebaseError } from 'firebase/app';

export function Dropzone() {
  const [error, setError] = useState('');
  const [{}, dispatch] = useStateValue();

  const handleSuccess = async ({
    uuid,
    name,
    uploadTask,
  }: {
    uuid: string;
    name: string;
    uploadTask: firebase.storage.UploadTask;
  }) => {
    // Upload completed successfully, now we can get the download URL
    const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
    dispatch({
      type: ActionType.fileUploaded,
      payload: {
        uuid,
        name,
        url: encodeURIComponent(downloadURL),
      },
    });
  };

  const handleSnapshot = ({
    uuid,
    bytesTransferred,
    totalBytes,
    state,
  }: { uuid: string } & firebase.storage.UploadTaskSnapshot) => {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    dispatch({
      type: ActionType.progressUpdate,
      payload: {
        uuid,
        progress: Math.round((bytesTransferred / totalBytes) * 100),
      },
    });

    switch (state) {
      case firebase.storage.TaskState.PAUSED:
        dispatch({
          type: ActionType.progressStateUpdate,
          payload: {
            uuid,
            progressState: ProgressStates.paused,
          },
        });
        break;
      case firebase.storage.TaskState.RUNNING:
        dispatch({
          type: ActionType.progressStateUpdate,
          payload: {
            uuid,
            progressState: ProgressStates.active,
          },
        });
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
        const storageRef = firebase.storage().ref();
        const reader = new FileReader();

        reader.onabort = () => console.log('file reading was aborted');
        reader.onerror = () => console.log('file reading has failed');

        acceptedFiles.forEach(file => {
          const uuid = getUUID();
          // Upload file and metadata to the object 'images/mountains.jpg'
          const uploadTask = storageRef.child(`photos/${uuid}`).put(file);

          // Listen for state changes, errors, and completion of the upload.
          uploadTask.on(
            firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            ownProps => handleSnapshot({ ...ownProps, uuid }),
            // @ts-ignore wrong fireabse typing
            handleError,
            () => handleSuccess({ uuid, name: file.name, uploadTask }),
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
        <Button inverted color="yellow" size="massive">
          Vybrat soubory
        </Button>
      </Segment>
      {error && (
        <Message negative>
          <Message.Header>{error}</Message.Header>
        </Message>
      )}
    </div>
  );
}
