import React, {useState, useEffect} from 'react'
import {
    styled, Typography, Slider,
    Paper, Stack, Box
} from '@mui/material';

import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';
import PauseIcon from '@mui/icons-material/Pause';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import FastForwardIcon from '@mui/icons-material/FastForward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import LyricsIcon from '@mui/icons-material/Lyrics';
import ShareIcon from '@mui/icons-material/Share';

import LyricsDailog from './LyricsDailog';
import ShareDailog from './ShareDailog';
import { getSongCoverRoute, ownRoute } from '../../utils/APIRoutes';
import styles from './Player.module.css';
import { useSelector } from 'react-redux';

const CustomPaper = styled(Paper)(({theme}) => ({
    backgroundColor: '#b7efff',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    padding: theme.spacing(1),
    width:'100%',
}))

const PSlider = styled(Slider)(({theme, ...props}) => ({
    color: '#2b7ddb',
    height: 2,
    '&:hover': {
        cursor: 'auto',
    },
    '& .MuiSlider-thumb': {
        width: '13px',
        height: '13px',
        display: props.thumbless ? 'none' : 'block',
    }
}))


export default function Player({index,setIndex,setCurrentSong,currentSong,queueList,audioPlayer,isPlaying,setIsPlaying}) {
    
    const userStatus = useSelector((state) => state.user.userstatus);

    const [volume, setVolume] = useState(30);
    const [mute, setMute] = useState(false);

    const [elapsed, setElapsed] = useState(0);
    const [duration, setDuration] = useState(0);

    const [openLyric, setOpenLyric] = useState(false);
    const [openShare, setOpenShare] = useState(false);

    const handleLyricClick = () => {
        setOpenLyric(true);
    };

    const handleLyricClose = () => {
        setOpenLyric(false);
    };

    const handleShareClick = () => {
        setOpenShare(true);
    };

    const handleShareClose = () => {
        setOpenShare(false);
    };

    useEffect(() => {
        if(audioPlayer){
            audioPlayer.current.volume = volume / 100;
        }

        
        if(isPlaying){
            setInterval(() => {
                const _duration = Math.floor(audioPlayer?.current?.duration);
                const _elapsed = Math.floor(audioPlayer?.current?.currentTime);

                setDuration(_duration);
                setElapsed(_elapsed);
                if(audioPlayer?.current?.ended){
                    toggleSkipForward();
                }
            }, 100);
        }
        

    }, [
        volume, isPlaying,audioPlayer,index
    ]);

    useEffect(()=>{
        if(!!currentSong){
            queueList.map((s)=> s.songname !== currentSong.songname);
            let temp = queueList.push(currentSong)-1;
            setIndex(temp);
            // setCurrentSong(queueList[temp]);
            setIsPlaying(true);
            // audioPlayer.current.src = queueList[temp].song;
            // audioPlayer.current.play();
        }
    },[audioPlayer])

      
  useEffect(()=>{
    if(queueList.length>index){
    setCurrentSong(queueList[index]);
    audioPlayer.current.src = queueList[index].song;
    audioPlayer.current.play();
  }

  },[index]);

    function formatTime(time) {
        if(time && !isNaN(time)){
            const minutes = Math.floor(time / 60) < 10 ? `0${Math.floor(time / 60)}` : Math.floor(time / 60);
            const seconds = Math.floor(time % 60) < 10 ? `0${Math.floor(time % 60)}` : Math.floor(time % 60);

            return `${minutes}:${seconds}`;
        }
        return '00:00';
    }

    const togglePlay = () => {
        if(!isPlaying) {
            audioPlayer.current.play()
        }else {
            audioPlayer.current.pause()
        }
        setIsPlaying(prev => !prev)
    }

    const toggleForward = () => {
        audioPlayer.current.currentTime += 10;
    }
    const toggleBackward = () => {
        audioPlayer.current.currentTime -= 10;
    }
    const toggleSkipForward = () => {
        if(index >= queueList.length - 1) {
            setIndex(0);
            // setCurrentSong(queueList[0]);
            // audioPlayer.current.src = queueList[0].song;
            // audioPlayer.current.play();
        } else {
            setIndex(prev => prev + 1);
            // setCurrentSong(queueList[index+1]);
            // audioPlayer.current.src = queueList[index + 1].song;
            // audioPlayer.current.play();
        }
    }

    const toggleSkipBackward = () => {
        if(index > 0) {
            setIndex(prev => prev - 1);
            // setCurrentSong(queueList[index-1]);
            // audioPlayer.current.src = queueList[index - 1].song;
            // audioPlayer.current.play();
        }else{
            setIndex(queueList.length-1);
            // setCurrentSong(queueList[queueList.length-1]);
            // audioPlayer.current.src = queueList[queueList.length-1].song;
            // audioPlayer.current.play();
        }
    }
    
    function VolumeBtns(){
        return mute
            ? <VolumeOffIcon sx={{color: '#2b7ddb', '&:hover': {color: '#0052a8'}}} onClick={() => setMute(!mute)} />
            : volume <= 20 ? <VolumeMuteIcon sx={{color: '#2b7ddb', '&:hover': {color: '#0052a8'}}} onClick={() => setMute(!mute)} />
            : volume <= 75 ? <VolumeDownIcon sx={{color: '#2b7ddb', '&:hover': {color: '#0052a8'}}} onClick={() => setMute(!mute)} />
            : <VolumeUpIcon sx={{color: '#2b7ddb', '&:hover': {color: '#0052a8'}}} onClick={() => setMute(!mute)} />
    }

    return (
        <>
            <audio autoPlay={isPlaying} ref={audioPlayer} muted={mute}>
            <source src={currentSong} type="audio/mpeg" />
            </audio>
            
            <Stack direction='row' spacing={1} sx={{marginLeft:0,marginRight:0,backgroundColor: '#b7efff',}} >
            <Box sx={{padding:"0.2rem", paddingRight:"0"}} bottom={0}>
                <img className={isPlaying?styles.rotate:''} src={`${getSongCoverRoute}/${!!currentSong?currentSong.cover:"def.jpg"}`} height='75rem' width='75rem' background-size='conatin' alt="img" style={{borderRadius:'100%',}}/>
            </Box>
            
            <CustomPaper>
            
                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                    <Stack direction='row' spacing={1} 
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            width: '15%',
                            alignItems: 'center'
                        }}
                    >
                        <VolumeBtns  />

                        <PSlider min={0} max={100} value={volume}
                            onChange={(e, v) => setVolume(v)}
                        />
                    </Stack>

                    <Stack direction='row' spacing={1}
                        sx={{
                            display: 'flex',
                            width: '25%',
                            alignItems: 'center'
                        }}>
                        <SkipPreviousIcon 
                            sx={{
                                color: '#2b7ddb', 
                                '&:hover': {color: '#0052a8'}
                            }} 
                            onClick={toggleSkipBackward} disabled={true}/>
                        <FastRewindIcon sx={{color: '#2b7ddb', '&:hover': {color: '#0052a8'}}} onClick={toggleBackward}/>

                        {!isPlaying
                            ?   <PlayArrowIcon fontSize={'large'} sx={{color: '#2b7ddb', '&:hover': {color: '#0052a8'}}} onClick={togglePlay}/>
                            :   <PauseIcon fontSize={'large'} sx={{color: '#2b7ddb', '&:hover': {color: '#0052a8'}}} onClick={togglePlay}/>
                        }


                        <FastForwardIcon sx={{color: '#2b7ddb', '&:hover': {color: '#0052a8'}}} onClick={toggleForward} />
                        <SkipNextIcon sx={{color: '#2b7ddb', '&:hover': {color: '#0052a8'}}} onClick={toggleSkipForward}/>
                    </Stack>

                    <Stack
                    direction='row'
                    spacing={3}
                     sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }} >
                        {userStatus==='prm'&&
                        <>
                            <LyricsIcon sx={{color: '#2b7ddb', '&:hover': {color: '#0052a8'}}} onClick={handleLyricClick} />
                            <ShareIcon sx={{color: '#2b7ddb', '&:hover': {color: '#0052a8'}}} onClick={handleShareClick}/>
                        </>
                        }                 
                    </Stack>
                </Box>
                <Stack spacing={1} direction='row' sx={{
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <Typography sx={{color: '#2b7ddb'}}>{formatTime(elapsed)}</Typography>
                    <PSlider value={elapsed} max={duration} onChange={(e,v)=>{setElapsed(v);audioPlayer.current.currentTime=v;}}/>
                    <Typography sx={{color: '#2b7ddb'}}>{formatTime(duration - elapsed)}</Typography>
                </Stack>
            </CustomPaper>
            </Stack>
            {openLyric&&!!currentSong && (
                <LyricsDailog
                open={openLyric}
                handleClose={handleLyricClose}
                lyrics = {currentSong}
                />
            )}
            {openShare&&!!currentSong && (
                <ShareDailog
                open={openShare}
                handleClose={handleShareClose}
                url = {new URL(`${ownRoute}/home/song/${currentSong.songname}`)}
                />
            )}
        </>
    )
}