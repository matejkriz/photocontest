import React from 'react';
import Link from 'next/link';
import { Message, Loader } from 'semantic-ui-react';
import { useStateValue } from './StateProvider';

export const AskForAuthorization = () => {
  const [{ user }] = useStateValue();
  return typeof user.isSignedIn === 'undefined' ? (
    <Loader active />
  ) : (
    <Message warning>
      Nejprve se prosím{' '}
      <Link href="/login">
        <a>přihlaš pomocí emailu</a>
      </Link>
      .
    </Message>
  );
};
