import React from 'react';
import { Dropzone } from '../components/Dropzone';
import { Item } from 'semantic-ui-react';

import { useStateValue } from '../components/StateProvider';
import { PhotoDetail } from '../components/PhotoDetail';

const UploadPage = () => {
  const [{ uploadedFiles }] = useStateValue();
  return (
    <div>
      <h1>Nahrávání fotek</h1>
      <Dropzone />
      <Item.Group divided>
        {Object.entries(uploadedFiles).map(([uuid, photo]) => (
          <PhotoDetail uuid={uuid} photo={photo} key={uuid} />
        ))}
      </Item.Group>
    </div>
  );
};

export default UploadPage;
