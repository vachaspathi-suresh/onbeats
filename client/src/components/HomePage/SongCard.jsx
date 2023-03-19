import React, { useState } from "react";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import ShareIcon from "@mui/icons-material/Share";
import { useSelector } from "react-redux";

import { getSongCoverRoute, ownRoute } from "../../utils/APIRoutes";
import DotMenu from "./DotMenu";
import ShareDailog from "./ShareDailog";

const SongCard = ({ songdata, handlePlay,currentSong,handlePause,isPlaying }) => {
  const userStatus = useSelector((state) => state.user.userstatus);

  const [openShare, setOpenShare] = useState(false);
  const handleShareClick = () => {
    setOpenShare(true);
  };

  const handleShareClose = () => {
      setOpenShare(false);
  };

  const handlePlayClick =()=>{
    if(currentSong?.songname!==songdata.songname)
      handlePlay(songdata)
    else
      handlePause();
  }

  return (
    <>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          height: 250,
          backgroundColor: "#e3f1ef",
          maxWidth: 230,
        }}
      >
        <Typography
          component="h2"
          variant="h5"
          fontWeight={600}
          color="primary"
          gutterBottom
          fontSize={songdata.songname.length>12?20:25}
        >
          {songdata.songname}
        </Typography>
        <Paper sx={{ height: "60%", width: "100%" }}>
          <img
            src={`${getSongCoverRoute}/${songdata.cover}`}
            background-size="conatin"
            height="100%"
            width="100%"
            alt={songdata.songname}
          />
        </Paper>
        <Box
          sx={
            userStatus === "prm" && {
              display: "flex",
              justifyContent: "space-between",
            }
          }
        >
          {userStatus === "prm" && (
            <ShareIcon
              sx={{
                color: "#2b7ddb",
                "&:hover": { color: "#0052a8" },
                display: "flex",
                justifyContent: "flex-start",
                alignSelf: "center",
                cursor: "pointer",
              }}
              onClick={handleShareClick}
            />
          )}
          <IconButton
            color="primary"
            onClick={() => {
              handlePlayClick();
            }}
          >{currentSong?.songname===songdata.songname&&isPlaying?
            <PauseCircleIcon sx={{ fontSize: 50 }} />:
            <PlayCircleIcon sx={{ fontSize: 50 }} />
          }
          </IconButton>
          {userStatus === "prm" && <DotMenu songId={songdata.songId}/>}
        </Box>
      </Paper>
            {openShare&&!!songdata && (
                <ShareDailog
                open={openShare}
                handleClose={handleShareClose}
                url = {new URL(`${ownRoute}/home/song/${songdata.songname}`)}
                />
            )}
    </>
  );
};

export default SongCard;
