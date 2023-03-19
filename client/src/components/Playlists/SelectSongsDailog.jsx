import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
  InputAdornment,
  List,
  ListItem,
  Typography,
  Checkbox,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@mui/material";
import { Search, Clear } from "@mui/icons-material";
import { toast } from "react-toastify";

import { addToPlaylistRoute, getSongCoverRoute, getSongsRoute } from "../../utils/APIRoutes";
import { useSelector } from "react-redux";
import useHTTP from "../../hooks/use-http";

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

const SelectSongsDailog = ({ open, handleClose, playlistname,setReload }) => {
  const token = useSelector((state) => state.auth.token);
  const [searchInput, setSearchInput] = useState("");
  const [allSongs, setallSongs] = useState([]);
  const { isLoading: getLoading, sendRequest: getSendRequest } = useHTTP();
  const { isLoading, sendRequest } = useHTTP();

  useEffect(() => {
    const getSongNames = async () => {
      try {
        const responseData = await getSendRequest(getSongsRoute, "POST", null, {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        });
        const lists = responseData.songnames.map((song) => {
          return { ...song, isSelected: false };
        });
        setallSongs(lists);
      } catch (err) {
        if (!err.message.includes("aborted"))
          toast.error(err.message, toastOptions);
      }
    };
    getSongNames();
  }, [getSendRequest]);

  const addToList = () => {
    const addFunction = async (songId) => {
      try {
        const responseData = await sendRequest(
          addToPlaylistRoute,
          "POST",
          JSON.stringify({
            playlistname: playlistname,
            songId: songId,
          }),
          {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        );
        if (responseData.playlists.length > 0) {
          return true;
        } else {
          return false;
        }
      } catch (err) {
        toast.error(err.message, toastOptions);
        return false;
      }
    };
    let i = 0;
    const promises = allSongs.map((song) => {
      if (song.isSelected) {
        i += 1;
        return new Promise((resolve) =>
          setTimeout(() => {
            if (addFunction(song.songId)) {
              toast.success(`${song.songname} Added`, toastOptions);
            } else {
              toast.error(`Unable to Add ${song.songname}`, toastOptions);
            }
            resolve();
          }, 1000 * i)
        );
      }
    });
    Promise.all(promises).then(() =>
      setTimeout(() => {
        setReload(prev=>!prev);
        handleClose();
      }, 1000)
    );
  };

  const filteredsongs =
    searchInput.trim().length === 0
      ? allSongs
      : allSongs.filter(
          (song) =>
            song.songname.toLowerCase().includes(searchInput.toLowerCase()) ||
            song.movie.toLowerCase().includes(searchInput.toLowerCase())
        );

  const selectSong = (name) => {
    const songs = allSongs.map((song) => {
      if (song.songname === name) song.isSelected = !song.isSelected;
      return song;
    });
    setallSongs(songs);
  };

  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Select Song</DialogTitle>
      <DialogContent>
        <DialogContentText>Select Song(s) to add in Playlist</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          value={searchInput}
          onChange={handleInputChange}
          type="text"
          autoComplete="off"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: searchInput.trim().length !== 0 && (
              <InputAdornment position="end">
                <Clear
                  onClick={() => {
                    setSearchInput("");
                  }}
                  sx={{ cursor: "pointer" }}
                />
              </InputAdornment>
            ),
          }}
          variant="standard"
        />
        {isLoading ? (
          <></>
        ) : (
          !getLoading &&
          filteredsongs &&
          (filteredsongs.length === 0 ? (
            <Typography>No Song Found</Typography>
          ) : (
            <List>
              {filteredsongs.map((song) => (
                <ListItem disablePadding key={song.songId}>
                  <ListItemButton
                    onClick={() => {
                      selectSong(song.songname);
                    }}
                  >
                    <Checkbox checked={song.isSelected} />
                    <ListItemAvatar>
                      <Avatar
                        alt={song.cover}
                        src={`${getSongCoverRoute}/${
                          !!song ? song.cover : "def.jpg"
                        }`}
                        sx={{ bgcolor: "#A6E3E9" }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={song.songname}
                      secondary={song.movie}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          ))
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={addToList}>Done</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SelectSongsDailog;
