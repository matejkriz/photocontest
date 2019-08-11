import React from 'react';
import { Container, Item } from 'semantic-ui-react';
import { Categories } from '../components/Categories';
import { Dropzone } from '../components/Dropzone';
import { FirebaseType } from '../components/Firebase';
import { useStateValue } from '../components/StateProvider';
import { PhotoDetail } from '../components/PhotoDetail';

interface Props {
  firebase?: FirebaseType;
}

const UploadPage = ({ firebase }: Props) => {
  const [{ uploadedFiles }] = useStateValue();

  return (
    <Container>
      <Dropzone />
      <Categories firebase={firebase}>
        {categories => (
          <Item.Group divided>
            {Object.entries(uploadedFiles).map(([uuid, photo]) => (
              <PhotoDetail
                uuid={uuid}
                photo={photo}
                categories={categories}
                key={uuid}
              />
            ))}
          </Item.Group>
        )}
      </Categories>
    </Container>
  );
};

export default UploadPage;
