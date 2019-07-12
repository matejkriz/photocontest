import React from 'react';
import Document, {
  Head,
  Main,
  NextScript,
  NextDocumentContext,
  DefaultDocumentIProps,
} from 'next/document';

export default class MyDocument extends Document {
  static async getInitialProps(
    context: NextDocumentContext,
  ): Promise<DefaultDocumentIProps> {
    const initialProps = await Document.getInitialProps(context);
    return { ...initialProps };
  }
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
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
