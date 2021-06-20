import { Header } from '../components/Header/HeaderComponet';
import '../styles/global.scss';
import styles from '../styles/app.module.scss';
import React from 'react';
import { Player } from '../components/Player/PlayerComponet';

function MyApp({ Component, pageProps }) {
  return (
    <div className={styles.wraper}>
      <main>
        <Header/>
        <Component {...pageProps} />
      </main>
      <Player/>

    </div>
  );
}

export default MyApp
