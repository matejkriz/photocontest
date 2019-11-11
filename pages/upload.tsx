import React from 'react';
import { Container } from 'semantic-ui-react';
import { AskForAuthorization } from '../components/AskForAuthorization';
import { PhotoForm } from '../components/PhotoForm';
import { Dropzone } from '../components/Dropzone';
import { useStateValue } from '../components/StateProvider';
import { colors } from '../theme/colors';

const UploadPage = () => {
  const [{ user }] = useStateValue();

  return (
    <Container>
      {user.isSignedIn ? (
        <>
          <Dropzone />
          <PhotoForm />
        </>
      ) : (
        <AskForAuthorization />
      )}
      <style jsx global>
        {`
          html body {
            background-color: ${colors.black};
            color: ${colors.whiteDirty};
          }
        `}
      </style>
    </Container>
  );
};

export default UploadPage;
