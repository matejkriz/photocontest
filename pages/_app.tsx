import React from 'react';
import App, { Container } from 'next/app';
import Link from 'next/link';
import { withRouter, SingletonRouter } from 'next/router';
import { StateProvider, StateContext } from '../components/StateProvider';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { breakpoints } from '../theme/breakpoints';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { Menu } from 'semantic-ui-react';

import { firebaseConfig } from '../config/default';

interface MyAppProps {
  Component: any;
  pageProps: any;
  router: SingletonRouter;
}

class MyApp extends App<MyAppProps> {
  firebase: any;

  componentDidMount() {
    this.firebase = require('firebase/app');
    this.firebase.initializeApp(firebaseConfig);

    // firebaseui needs it on global window object
    (window as any).firebase = this.firebase;
  }
  render() {
    const { Component, pageProps, router } = this.props;

    return (
      <Container>
        <ErrorBoundary>
          <StateProvider>
            <Menu pointing secondary inverted>
              <Link href="/" passHref>
                <Menu.Item active={router.pathname === '/'}>Pravidla</Menu.Item>
              </Link>
              <Link href="/vote" passHref>
                <Menu.Item active={router.pathname.startsWith('/vote')}>
                  Hlasovat
                </Menu.Item>
              </Link>
              <Link href="/upload" passHref>
                <Menu.Item active={router.pathname.startsWith('/upload')}>
                  Nahrát fotky
                </Menu.Item>
              </Link>
              <Menu.Menu position="right">
                <StateContext.Consumer>
                  {([{ user }]) =>
                    user.isSignedIn ? (
                      <Menu.Item onClick={() => this.firebase.auth().signOut()}>
                        Odhlásit
                      </Menu.Item>
                    ) : (
                      <Link href="/login" passHref>
                        <Menu.Item
                          active={router.pathname.startsWith('/login')}
                        >
                          Přihlásit
                        </Menu.Item>
                      </Link>
                    )
                  }
                </StateContext.Consumer>
              </Menu.Menu>
            </Menu>
            <Component {...pageProps} />
          </StateProvider>
        </ErrorBoundary>

        <style jsx global>
          {`
            html {
              font-size: 55%;
            }

            body {
              font-family: ${typography.fontFamily};
              font-size: ${typography.fontSize}rem;
              background-color: ${colors.black};
              color: ${colors.whiteDirty};
            }

            p,
            a,
            div {
              font-size: ${typography.fontSize}rem;
            }

            @media screen and (min-width: ${breakpoints.sm}) {
              html {
                font-size: 59%;
              }
            }
            @media screen and (min-width: ${breakpoints.md}) {
              html {
                font-size: 62.5%;
              }
            }
          `}
        </style>
      </Container>
    );
  }
}

export default withRouter(MyApp);
