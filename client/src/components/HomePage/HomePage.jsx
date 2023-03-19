import React from "react";
import { Container, Grid } from "@mui/material";
import SongCard from "./SongCard";

const HomePage = ({songsList,handlePlay,currentSong,handlePause,isPlaying}) => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 11 }}>
      <Grid container spacing={3}>
        {songsList.current.map((song, index) => (
          <Grid item xs={12} md={4} lg={3} key={index}>
            <SongCard currentSong={currentSong} songdata={song} handlePlay={handlePlay} handlePause={handlePause} isPlaying={isPlaying}/>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HomePage;
