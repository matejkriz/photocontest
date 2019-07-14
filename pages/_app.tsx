import React from 'react';
import App, { Container } from 'next/app';
import { Firebase } from '../components/Firebase';
import { Menu } from '../components/Menu';
import { StateProvider } from '../components/StateProvider';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { breakpoints } from '../theme/breakpoints';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface MyAppProps {
  Component: any;
  pageProps: any;
}

class MyApp extends App<MyAppProps> {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <ErrorBoundary>
          <Firebase>
            {firebase => (
              <StateProvider>
                <Menu firebase={firebase} />
                <Component {...pageProps} />
              </StateProvider>
            )}
          </Firebase>
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

export default MyApp;
