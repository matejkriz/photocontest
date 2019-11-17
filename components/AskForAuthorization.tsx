import React from 'react';
import Link from 'next/link';
import { Message, Loader } from 'semantic-ui-react';
import { useStateValue } from './StateProvider';

export const AskForAuthorization = () => {
  const [{ user }] = useStateValue();
  return typeof user.isSignedIn === 'undefined' ? (
    <Loader active />
  ) : user.isSignedIn ? (
    <Message warning>
      Nejprve prosím{' '}
      <Link href="/login">
        <a>zadej své jméno</a>
      </Link>
      .
    </Message>
  ) : (
    <Message warning>
      Nejprve se prosím{' '}
      <Link href="/login">
        <a>přihlaš</a>
      </Link>
      .
    </Message>
  );
};
