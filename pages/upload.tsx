import React from 'react';
import { Dropzone } from '../components/Dropzone';
import { FirebaseType } from '../components/Firebase';

interface Props {
  firebase?: FirebaseType;
}

const UploadPage = ({ firebase }: Props) => {
  return (
    <div>
      <h1>Nahrávání fotek</h1>
      {firebase && <Dropzone firebase={firebase} />}
    </div>
  );
};

export default UploadPage;
