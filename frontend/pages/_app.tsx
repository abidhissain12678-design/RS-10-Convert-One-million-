import '../styles/globals.css'
import 'react-quill/dist/quill.snow.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <style>
          {`
            /* Font preload hints for better mobile performance */
            @font-face {
              font-family: 'Nastaliq';
              font-display: swap;
              src: local('Noto Nastaliq Urdu'), 
                   url('/fonts/static/NotoNastaliqUrdu-Regular.ttf') format('truetype');
              font-weight: 400;
            }
          `}
        </style>
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp

