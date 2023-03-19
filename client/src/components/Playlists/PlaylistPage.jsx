import React, { useState } from "react";
import {
  Avatar,
  Button,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import EditIcon from "@mui/icons-material/Edit";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import { Box } from "@mui/system";
import {
  changePlaylistNameRoute,
  getSongCoverRoute,
  removeFromPlaylistRoute,
} from "../../utils/APIRoutes";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useHTTP from "../../hooks/use-http";
import { toast } from "react-toastify";
import useInput from "../../hooks/use-input";
import SelectSongsDailog from "./SelectSongsDailog";

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

const PlaylistPage = ({
  playlist,
  setReload,
  namesList,
  playPlayList,
  handlePlay,
  currentSong,
  handlePause,
  isPlaying,
}) => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const [isUpdate, setIsUpdate] = useState(false);
  const {
    value: nameValue,
    isValid: nameIsValid,
    hasError: nameHasError,
    valueChangeHandler: nameChangeHandler,
    onBlurHandler: nameBlurHandler,
  } = useInput((value) => value.trim() !== "");
  const [isNameTaken, setIsNameTaken] = useState(false);
  const { isLoading, clearError, sendRequest } = useHTTP();
  const [selectOpen, setSelectOpen] = useState(false);

  const handleClickSelectOpen = () => {
    setSelectOpen(true);
  };

  const handleSelectClose = () => {
    setSelectOpen(false);
  };
  
  const handlePlayClick =(song)=>{
    if(currentSong?.songname!==song.songname)
      handlePlay(song)
    else
      handlePause();
  }

  const removeFromList = async (songData) => {
    try {
      const responseData = await sendRequest(
        removeFromPlaylistRoute,
        "POST",
        JSON.stringify({
          playlistname: playlist.playlistname,
          songId: songData.songId,
        }),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      );
      if (responseData.playlists.length > 0) {
        toast.success("removed Successfully", toastOptions);
        setReload((prev) => !prev);
      } else {
        toast.error("unable to remove", toastOptions);
      }
    } catch (err) {
      toast.error(err.message, toastOptions);
    }
  };

  const handleNameChange = async (event) => {
    event.preventDefault();
    plnameBlurHandler();
    if (nameIsValid && !isNameTaken) {
      try {
        const dataResponse = await sendRequest(
          changePlaylistNameRoute,
          "POST",
          JSON.stringify({
            playlistname: playlist.playlistname,
            newplaylistname: nameValue,
          }),
          {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        );
        if (dataResponse.playlists.length > 0) {
          toast.success("Title Updated", toastOptions);
          setTimeout(() => {
            setReload((prev) => !prev);
            navigate("/playlists/" + nameValue);
          }, 500);
        }
      } catch (err) {
        toast.error(err.message, {
          ...toastOptions,
          onClose: () => {
            clearError();
          },
        });
      }
      setIsUpdate(false);
    }
  };

  const plnameBlurHandler = () => {
    nameBlurHandler();
    if (namesList.includes(nameValue)) {
      setIsNameTaken(true);
    } else {
      setIsNameTaken(false);
    }
  };

  return (
    <>
      <Tooltip title="Go Back">
        <IconButton onClick={() => navigate("/playlists")}>
          <ArrowBackIcon
            sx={{
              fontSize: 40,
              color: "#427578",
              "&:hover": { color: "#0052a8" },
            }}
          />
        </IconButton>
      </Tooltip>
      <Container maxWidth="xl" sx={{ mb: 11 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              width: "15%",
              alignItems: "end",
            }}
          >
            {!isUpdate ? (
              <>
                <Typography variant="h1" sx={{ color: "#427578", ml: 2 }}>
                  {playlist.playlistname}
                </Typography>
                <Tooltip title="Edit Title">
                  <IconButton onClick={() => setIsUpdate(true)}>
                    <EditIcon
                      sx={{
                        margin: 2.5,
                        fontSize: 30,
                        color: "#427578",
                        "&:hover": { color: "#0052a8" },
                      }}
                    />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <>
                <TextField
                  autoFocus
                  fullWidth
                  required
                  variant="standard"
                  autoComplete="given-name"
                  id="name"
                  name="name"
                  margin="dense"
                  value={nameValue}
                  onChange={nameChangeHandler}
                  onBlur={plnameBlurHandler}
                  error={nameHasError || isNameTaken}
                  helperText={
                    (nameHasError && "Field can't be empty") ||
                    (isNameTaken && "Playlist already exists")
                  }
                  sx={{ minWidth: 250 }}
                />
                <Button
                  variant="text"
                  onClick={() => setIsUpdate(false)}
                  sx={{ marginBottom: 1.5 }}
                >
                  Cancel
                </Button>
                <Button disabled={isLoading} onClick={handleNameChange}>
                  Update
                </Button>
              </>
            )}
          </Stack>
          <Stack
            direction="row"
            spacing={3}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "end",
            }}
          >
            <Tooltip title="Play All">
              <IconButton onClick={() => playPlayList(playlist.playlistsongs)}>
                <PlaylistPlayIcon
                  sx={{
                    fontSize: 50,
                    color: "#427578",
                    "&:hover": { color: "#0052a8" },
                  }}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add Song">
              <IconButton onClick={handleClickSelectOpen}>
                <PlaylistAddIcon
                  sx={{
                    fontSize: 50,
                    color: "#427578",
                    "&:hover": { color: "#0052a8" },
                  }}
                />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
        <Divider
          sx={{ borderBottomWidth: "medium", borderColor: "rgba(0,0,0,0.2)" }}
        />
        <List>
          {playlist.playlistsongs.map((song) => (
            <ListItem
              secondaryAction={
                <Stack direction="row" spacing={3}>
                  <Tooltip title="Play">
                    <IconButton edge="end" aria-label="play" onClick={()=>handlePlayClick(song)}>
                      {currentSong?.songname === song.songname &&
                      isPlaying ? (
                        <PauseCircleIcon sx={{ fontSize: 50 }} />
                      ) : (
                        <PlayCircleOutlineIcon sx={{ fontSize: 45 }} />
                      )}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Remove from Playlist">
                    <IconButton
                      edge="end"
                      aria-label="remove"
                      onClick={() => removeFromList(song)}
                    >
                      <RemoveCircleOutlineIcon sx={{ fontSize: 45 }} />
                    </IconButton>
                  </Tooltip>
                </Stack>
              }
              key={song.songId}
            >
              <ListItemAvatar>
                <Avatar
                  alt={song.cover}
                  src={`${getSongCoverRoute}/${
                    !!song ? song.cover : "def.jpg"
                  }`}
                  sx={{ bgcolor: "#A6E3E9" }}
                />
              </ListItemAvatar>
              <ListItemText primary={song.songname} secondary={song.movie} />
            </ListItem>
          ))}
        </List>
      </Container>
      {selectOpen && (
        <SelectSongsDailog
          open={selectOpen}
          handleClose={handleSelectClose}
          playlistname={playlist.playlistname}
          setReload={setReload}
        />
      )}
    </>
  );
};

export default PlaylistPage;
