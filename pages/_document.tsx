import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';

declare global {
  interface Window {
    firebaseui: any;
  }
}

export default class MyDocument extends Document {
  render() {
    return (
      <html lang="cs">
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
          />
          <link
            rel="shortcut icon"
            href="/static/favicons/favicon.ico"
            type="image/x-icon"
          />
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/normalize.css@8.0.1/normalize.css"
            type="text/css"
          />
          <script src="https://www.gstatic.com/firebasejs/ui/4.0.0/firebase-ui-auth__cs.js" />
          <link
            type="text/css"
            rel="stylesheet"
            href="https://www.gstatic.com/firebasejs/ui/4.0.0/firebase-ui-auth.css"
          />
          <link
            rel="stylesheet"
            href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
