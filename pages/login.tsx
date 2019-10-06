import React from 'react';
import { Auth } from '../components/Auth';
import { AuthForm } from '../components/AuthForm';
import { FirebaseType } from '../components/Firebase';
import { useStateValue } from '../components/StateProvider';

interface Props {
  firebase?: FirebaseType;
}

const LoginPage = ({ firebase }: Props) => {
  const [{ user }] = useStateValue();
  console.log('user: ', user);

  return (
    <div>
      <h1>Přihlášení</h1>
      <Auth firebase={firebase} />
      {user.isSignedIn && <AuthForm />}
    </div>
  );
};

export default LoginPage;
