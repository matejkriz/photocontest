import React from 'react';
import { Container, Header } from 'semantic-ui-react';
import { Auth } from '../components/Auth';
import { AuthForm } from '../components/AuthForm';
import { FirebaseType } from '../components/Firebase';
import { useStateValue } from '../components/StateProvider';

interface Props {
  firebase?: FirebaseType;
}

const LoginPage = ({ firebase }: Props) => {
  const [{ user }] = useStateValue();

  return (
    <Container>
      <Header as="h1">Přihlášení</Header>
      {firebase &&
        (user.isSignedIn ? <AuthForm /> : <Auth firebase={firebase} />)}
    </Container>
  );
};

export default LoginPage;
