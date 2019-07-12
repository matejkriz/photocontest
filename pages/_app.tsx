import App, { Container } from 'next/app';
import React from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { breakpoints } from '../theme/breakpoints';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface MyAppProps {
  Component: any;
  pageProps: any;
}

export default class MyApp extends App<MyAppProps> {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <ErrorBoundary>
          <Component {...pageProps} />
        </ErrorBoundary>

        <style jsx global>
          {`
            html {
              font-size: 55%;
            }
            body {
              font-family: ${typography.fontFamily};
              background-color: ${colors.black};
              color: ${colors.whiteDirty};
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
