import '../styles/globals.css'
import 'react-quill/dist/quill.snow.css'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp

