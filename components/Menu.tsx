import React, { useEffect, Dispatch } from 'react';
import { withRouter, SingletonRouter } from 'next/router';
import Link from 'next/link';
import { Menu as MenuUI } from 'semantic-ui-react';
import { useStateValue, Action, User, ActionType } from './StateProvider';
import { FirebaseType } from './Firebase';

interface Props {
  router: SingletonRouter;
  firebase?: FirebaseType;
}

async function fetchUser(
  { uid }: User,
  firebase: FirebaseType,
  dispatch: Dispatch<Action>,
) {
  const db = await firebase.firestore();
  const doc = await db
    .collection('users')
    .doc(uid)
    .get();
  const user = await doc.data();
  dispatch({
    type: ActionType.userFetched,
    payload: {
      user,
    },
  });
}

const MenuComponent = ({ router, firebase }: Props) => {
  const [{ user }, dispatch] = useStateValue();
  useEffect(() => {
    if (firebase && user.isSignedIn) {
      fetchUser(user, firebase, dispatch);
    }
  }, [firebase, user.isSignedIn]);
  return (
    <MenuUI
      pointing
      secondary
      stackable
      inverted={['/vote', '/upload'].includes(router.pathname)}
    >
      <Link href="/" passHref>
        <MenuUI.Item active={router.pathname === '/'}>Pravidla</MenuUI.Item>
      </Link>
      <Link href="/vote" passHref>
        <MenuUI.Item active={router.pathname.startsWith('/vote')}>
          Hlasovat
        </MenuUI.Item>
      </Link>
      <Link href="/upload" passHref>
        <MenuUI.Item active={router.pathname.startsWith('/upload')}>
          Nahrát fotky
        </MenuUI.Item>
      </Link>

      <MenuUI.Menu position="right">
        {user.isSignedIn && user.name && firebase ? (
          <MenuUI.Item onClick={() => firebase.auth().signOut()}>
            Odhlásit
          </MenuUI.Item>
        ) : user.isSignedIn && !user.name ? (
          <Link href="/login" passHref>
            <MenuUI.Item active={router.pathname.startsWith('/login')}>
              Zadat jméno
            </MenuUI.Item>
          </Link>
        ) : (
          <Link href="/login" passHref>
            <MenuUI.Item active={router.pathname.startsWith('/login')}>
              Přihlásit
            </MenuUI.Item>
          </Link>
        )}
      </MenuUI.Menu>
    </MenuUI>
  );
};

export const Menu = withRouter(MenuComponent);
