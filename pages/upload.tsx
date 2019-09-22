import React from 'react';
import { Container } from 'semantic-ui-react';
import { AskForAuthorization } from '../components/AskForAuthorization';
import { PhotoForm } from '../components/PhotoForm';
import { Dropzone } from '../components/Dropzone';
import { useStateValue } from '../components/StateProvider';

const UploadPage = () => {
  const [{ user }] = useStateValue();

  return user.isSignedIn ? (
    <Container>
      <Dropzone />
      <PhotoForm />
    </Container>
  ) : (
    <AskForAuthorization />
  );
};

export default UploadPage;
