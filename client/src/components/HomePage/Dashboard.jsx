import React, { useState, useRef, useEffect } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import {
  CssBaseline,
  Box,
  Toolbar,
  List,
  Divider,
  IconButton,
  Paper,
  Button,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { toast } from "react-toastify";

import HomePage from "./HomePage";
import NavListItems from "./listItems";
import ProfileMenu from "./ProfileMenu";
import Loader from "../UI/Loader";
import useHTTP from "../../hooks/use-http";
import { getSongsRoute, getSongRoute } from "../../utils/APIRoutes";
import Player from "./Player";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PlayLists from "../Playlists/PlayLists";

const toastOptions = {
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
};

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const mdTheme = createTheme();
let queueList = [];
const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation().pathname;
  const songname = useParams().songname;
  const [open, setOpen] = useState(false);
  let songsList = useRef([]);
  const audioPlayer = useRef();
  const [isplaylistadded1, isplaylistadded] = useState(0);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [currentSong, setCurrentSong] = useState(queueList[index]);
  const { isLoading: getLoading, sendRequest: getSendRequest } = useHTTP();
  
  useEffect(() => {
    if (location.includes("/home"))
      window.history.replaceState(null, "", "/home");
    const getSongs = async () => {
      try {
        const responseData = await getSendRequest(getSongsRoute, "POST", null, {
          "Content-Type": "application/json",
        });
        songsList.current = responseData.songnames.map((s) => ({
          ...s,
          song: `${getSongRoute}/${s.song}`,
        }));

        if (!!songname) {
          const urlSong = songsList.current.find((s) => {
            return s.songname === songname;
          });
          if (!!urlSong) {
            // let temp = queueList.push(urlSong)-1;
            // setIndex(temp);
            setCurrentSong(urlSong);
            // setIsPlaying(true);
          }
        }
      } catch (err) {
        toast.error(err.message, toastOptions);
      }
    };
    getSongs();
  }, [getSendRequest]);

  const handlePlay = (sSong) => {
    
    queueList = queueList.filter((s) => s.songname !== sSong.songname);
    let temp = queueList.push(sSong) - 1;
    setIndex(temp);
    setCurrentSong(queueList[temp]);
    setIsPlaying(true);
    audioPlayer.current.src = queueList[temp].song;
    audioPlayer.current.play();
  };

  const playPlayList = (songs)=>{
    handlePlay(songs[0]);
    songs.map((song,i)=>{
      if(i!==0){
      queueList = queueList.filter((s) => s.songname !== song.songname);
      queueList.push(song);
      }
    });
  }

  const handlePause =()=>{
    if(!isPlaying) {
      audioPlayer.current.play()
    }else {
      audioPlayer.current.pause()
    }
    setIsPlaying(prev => !prev)
  }

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px",
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexGrow: 1,
              }}
            >
              <Button onClick={() => navigate("/")}>
                <img
                  src="./logo.png"
                  alt="Onbeats"
                  height="3rem"
                  style={{ height: "3rem" }}
                />
              </Button>
              <ProfileMenu />
            </div>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <NavListItems
              playSong={handlePlay}
              allSongs={songsList}
              islistAdded={isplaylistadded}
            />
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          {/* {location !== "/home"&&<Typography variant="h2" sx={{ color: "#427578", ml: 5 }}>Your Playlists</Typography>} */}
          {/* <Container maxWidth="lg" sx={{ mt: 4, mb: 11 }}> */}
          {getLoading ? (
            <Loader />
          ) : location === "/home" ? (
            <HomePage songsList={songsList} handlePlay={handlePlay} currentSong={currentSong} handlePause={handlePause} isPlaying={isPlaying}/>
          ) : (
            <PlayLists isAdded={isplaylistadded1} playPlayList={playPlayList} handlePlay={handlePlay} currentSong={currentSong} handlePause={handlePause} isPlaying={isPlaying}/>
          )}
          {/* </Container> */}
        </Box>
        <Paper
          sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1300 }}
          elevation={3}
        >
          {getLoading ? (
            <Box height={60} sx={{ backgroundColor: "#b7efff" }}></Box>
          ) : (
            <Player
              index={index}
              setIndex={setIndex}
              setCurrentSong={setCurrentSong}
              currentSong={currentSong}
              queueList={queueList}
              audioPlayer={audioPlayer}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
            />
          )}
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;
