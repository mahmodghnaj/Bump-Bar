import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  <Head>
    <title>Bump Bar</title>
    <meta name="title" content="Bump Bar"></meta>
    <meta name="description" content="Bump Bar"></meta>
    <link rel="icon" href="/images.jpeg" type="image/icon type" />
  </Head>;
  return <Component {...pageProps} />;
}
