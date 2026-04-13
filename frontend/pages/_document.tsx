import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Font Preload for Nastaliq - Highest Priority */}
        <link
          rel="preload"
          href="/fonts/static/NotoNastaliqUrdu-Regular.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/static/NotoNastaliqUrdu-Bold.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/static/NotoNastaliqUrdu-SemiBold.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        
        {/* Font Fallback Preload */}
        <link
          rel="preload"
          href="/fonts/static/NotoNastaliqUrdu-Medium.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />

        {/* Optimize for RTL text rendering */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="theme-color" content="#1a1a2e" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
