
import Image from 'next/image';
import { useContext, useRef, useEffect, useState, } from 'react';
import { PlayerContext } from '../../contexts/PlayerContext';
import styles from './player.module.scss';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player (){

    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0);

    const { 
        episodeList, 
        currentEpisodeIndex, 
        isPlaying, 
        togglePlay,
        setPlayingState, 
        playNext,
        playPrevious,
        hasNext,
        hasPrevious,
        toggleLoop,
        isLooping,
        isShuffling,
        toggleShuffle,
        clearPlayerState,
    } = useContext(PlayerContext);


    useEffect(()=>{

        if (!audioRef.current)
            return;
        if (isPlaying){
            audioRef.current.play();
        }else {
            audioRef.current.pause();

        }
    }, [isPlaying])

    function setupProgressListener() {
        audioRef.current.currentTime = 0;
    
        audioRef.current.addEventListener('timeupdate', () => {
          setProgress(Math.floor(audioRef.current.currentTime))
        })
      }
    
      function handleSeek(amount: number) {
        audioRef.current.currentTime = amount;
    
        setProgress(amount)
      }
    
      function handleEpisodeEnded() {
        if (hasNext) {
          playNext()
        } else {
          clearPlayerState()
        }
      }

    const episode = episodeList[currentEpisodeIndex];
    return(
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="playing"/>
                <strong>
                    Tocando agora 
                    { episode?.title }
                </strong>
            </header>
            {
                !episode ? (
                    <div className={styles.emptyPlayer}>
                        <strong>Selecione um podcast para ouvir</strong>
                    </div>
                ): (
                    <div className={styles.currentEpisode}>
                        <Image 
                        width={592} 
                        height={592} 
                        src={episode.thumbnail} 
                        objectFit="cover"
                        />
                        <strong>
                            {episode.title}
                        </strong>
                        <span>{ episode.members }</span>
                    </div>
                )
            }
            <footer className={ !episode? styles.empty : ''}>
                <div className={styles.progress}>
                <span>{convertDurationToTimeString(progress)}</span>

                    {episode? 
                    <Slider
                        trackStyle = {{backgroundColor: '#04d361'}}
                        railStyle = {{backgroundColor: '#9f75ff'}}
                        handleStyle = {{ borderColor: '#9f75ff', borderWidth: 4}}
                        // onEnded = { () => handleEpisodeEnded ()}
                        onChange={handleSeek}
                        max={episode.duration}
                        value={progress}
                    /> :(
                        <div className={styles.slider}>
                            <div className={styles.emptySlider}/>
                        </div>
                    )}
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>

                {episode && (
                    <audio 
                        src={episode.url} 
                        autoPlay
                        ref = {audioRef}
                        onPlay={() => setPlayingState(true)}
                        onPause = { () => setPlayingState(false)}
                        loop = {isLooping}
                        onLoadedMetadata={setupProgressListener}
                    />
                )}
                <div className={styles.buttons}>
                    <button 
                    disabled = { !episode || episodeList.length <=1}
                    onClick={ () => toggleShuffle() }
                    >
                        <img src="/shuffle.svg" alt=""/>
                    </button>
                    <button 
                    disabled = { !episode || !hasPrevious} 
                    onClick={ () => playPrevious() }
                    >
                        <img src="/play-previous.svg" alt=""/>
                    </button >
                   
                    <button 
                    className={styles.playButton} 
                    disabled = { !episode }
                    onClick = {togglePlay}
                    >
                        {
                            isPlaying ? 
                            <img src="/pause.svg" alt=""/>
                             : (
                            <img src="/play.svg" alt=""/>
                            )
                        }
                        
                    </button>

                    <button disabled = { !episode || !hasNext} onClick={ () => playNext() }>
                        <img src="/play-next.svg" alt=""/>
                    </button >
                    <button 
                    onClick={() => toggleLoop()}
                    disabled = { !episode }
                    className = { isLooping ? styles.isActive : ''}
                    >
                        <img src="/repeat.svg" alt=""/>
                    </button>

                </div>
            </footer>
        </div>
    );
}