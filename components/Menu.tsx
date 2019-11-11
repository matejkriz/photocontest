import React from 'react';
import { withRouter, SingletonRouter } from 'next/router';
import Link from 'next/link';
import { Menu as MenuUI } from 'semantic-ui-react';
import { useStateValue } from './StateProvider';
import { FirebaseType } from './Firebase';

interface Props {
  router: SingletonRouter;
  firebase?: FirebaseType;
}

const MenuComponent = ({ router, firebase }: Props) => {
  const [{ user }] = useStateValue();
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
        {user.isSignedIn && firebase ? (
          <MenuUI.Item onClick={() => firebase.auth().signOut()}>
            Odhlásit
          </MenuUI.Item>
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
