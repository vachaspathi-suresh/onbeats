import React, { useEffect, useRef, useState } from "react";
import { Container, Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import useHTTP from "../../hooks/use-http";
import { getPlaylistsRoute, getSongRoute } from "../../utils/APIRoutes";
import Loader from "../UI/Loader";
import PlayListCard from "./PlayListCard";
import { useParams } from "react-router-dom";
import PlaylistPage from "./PlaylistPage";

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

let namesList = [];

const PlayLists = ({ isAdded,playPlayList,handlePlay,currentSong,handlePause,isPlaying }) => {
  const listname = useParams().listname;
  let playlists = useRef([]);
  const token = useSelector((state) => state.auth.token);
  const currList = useRef([]);
  const [reload,setreload] = useState(true);
  const { isLoading: getLoading, sendRequest: getSendRequest } = useHTTP();

  useEffect(() => {
    const getPlaylistNames = async () => {
      try {
        const responseData = await getSendRequest(
          getPlaylistsRoute,
          "POST",
          null,
          {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        );
        playlists.current = responseData.listnames.map((list)=>{
          return {
            playlistname:list.playlistname,
            playlistsongs:list.playlistsongs.map((s) => ({
              ...s,
              song: `${getSongRoute}/${s.song}`,
            }))
          }
        });
        namesList = responseData.listnames.map((list)=>list.playlistname);
        if (!!listname) {
          currList.current = playlists.current.filter(
            (list) => list.playlistname === listname
          );
          if (currList.current.length === 0)
            window.history.replaceState(null, "", "/playlists");
        } else {
          currList.current = [];
        }
      } catch (err) {
        if (!err.message.includes("aborted"))
          toast.error(err.message, toastOptions);
      }
    };
    getPlaylistNames();
  }, [getSendRequest, isAdded, listname,reload]);



  return (
    <>
      {getLoading ? (
        <Loader />
      ) : currList.current.length === 0 ? (
        <>
          <Typography variant="h2" sx={{ color: "#427578", ml: 5 }}>
            Your Playlists
          </Typography>
          <Container maxWidth="lg" sx={{ mt: 4, mb: 11 }}>
          <Grid container spacing={3}>
            {/* <Grid item xs={12} md={4} lg={3}>
            <AddBoxIcon sx={{width:'100%',height:'100%'}} />
          </Grid> */}
            {playlists.current.length === 0 ? (
              <Typography
                variant="h5"
                sx={{ paddingTop: "15%", paddingLeft: "40%" }}
              >
                No Playlists created yet
              </Typography>
            ) : (
              playlists.current.map((list, index) => (
                <Grid item xs={12} md={4} lg={3} key={index}>
                  <PlayListCard listdata={list} setReload={setreload} playPlayList={playPlayList}/>
                </Grid>
              ))
            )}
          </Grid>
          </Container>
        </>
      ) : (
        <PlaylistPage namesList={namesList} setReload={setreload} playlist={currList.current[0]} playPlayList={playPlayList} handlePlay={handlePlay} currentSong={currentSong} handlePause={handlePause} isPlaying={isPlaying}/>
      )}
    </>
  );
};

export default PlayLists;
