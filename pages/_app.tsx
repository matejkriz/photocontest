import React from 'react';
import App from 'next/app';
import { Firebase } from '../components/Firebase';
import { Menu } from '../components/Menu';
import { StateProvider } from '../components/StateProvider';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { colors } from '../theme/colors';

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <ErrorBoundary>
        <Firebase>
          {firebase => (
            <StateProvider firebase={firebase}>
              <Menu firebase={firebase} />
              <Component firebase={firebase} {...pageProps} />
              <style jsx global>
                {`
                  body {
                    background-color: ${colors.grayBright};
                    color: ${colors.black};
                  }
                `}
              </style>
            </StateProvider>
          )}
        </Firebase>
      </ErrorBoundary>
    );
  }
}

export default MyApp;
