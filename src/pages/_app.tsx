import { Header } from '../components/Header/HeaderComponet';
import '../styles/global.scss';
import styles from '../styles/app.module.scss';
import React, { useState } from 'react';
import { Player } from '../components/Player/PlayerComponet';
import {  PlayerContextProvider } from '../contexts/PlayerContext';

function MyApp({ Component, pageProps }) {

  return(
    <PlayerContextProvider>
      <div className={styles.wraper}>
        <main>
          <Header/>
          <Component {...pageProps} /> 
        </main>
        <Player/>

      </div>
      </PlayerContextProvider>
  );
}

export default MyApp
