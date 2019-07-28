import React from 'react';
import { Dropzone } from '../components/Dropzone';
import { FirebaseType } from '../components/Firebase';
import { Item } from 'semantic-ui-react';

import { useStateValue } from '../components/StateProvider';
import { PhotoDetail } from '../components/PhotoDetail';

interface Props {
  firebase?: FirebaseType;
}

const UploadPage = ({ firebase }: Props) => {
  const [{ uploadedFiles }] = useStateValue();
  return (
    <div>
      <h1>Nahrávání fotek</h1>
      {firebase && <Dropzone firebase={firebase} />}
      <Item.Group divided>
        {!!uploadedFiles.length &&
          uploadedFiles.map((url, index) => (
            <PhotoDetail url={url} key={index.toString()} />
          ))}
      </Item.Group>
    </div>
  );
};

export default UploadPage;
