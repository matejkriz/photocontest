import React from 'react';
import App, { Container } from 'next/app';
import { Firebase } from '../components/Firebase';
import { Menu } from '../components/Menu';
import { StateProvider } from '../components/StateProvider';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { colors } from '../theme/colors';

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <ErrorBoundary>
          <Firebase>
            {firebase => (
              <StateProvider firebase={firebase}>
                <Menu firebase={firebase} />
                <Component firebase={firebase} {...pageProps} />
              </StateProvider>
            )}
          </Firebase>
        </ErrorBoundary>

        <style jsx global>
          {`
            body {
              background-color: ${colors.grayBright};
              color: ${colors.black};
            }
          `}
        </style>
      </Container>
    );
  }
}

export default MyApp;
