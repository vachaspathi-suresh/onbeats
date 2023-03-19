import React, { useState } from "react";
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
  ListItemText,
  ListItemButton,
  Typography,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import { Search, Clear } from "@mui/icons-material";
import { getSongCoverRoute } from "../../utils/APIRoutes";

const SearchSongDailog = ({ allSongs, open, handleClose, playSong }) => {
  const [searchInput, setSearchInput] = useState("");
  const filteredsongs =
    searchInput.trim().length === 0
      ? null
      : allSongs.current.filter(
          (song) =>
            song.songname.toLowerCase().includes(searchInput.toLowerCase()) ||
            song.movie.toLowerCase().includes(searchInput.toLowerCase())
        );

  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Search Song</DialogTitle>
      <DialogContent>
        <DialogContentText>Please Enter The Song Name:</DialogContentText>
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
        {filteredsongs &&
          (filteredsongs.length === 0 ? (
            <Typography>No Song Found</Typography>
          ) : (
            <List>
              {filteredsongs.map((song) => (
                <ListItem disablePadding key={song.songId}>
                  <ListItemButton onClick={() => playSong(song)}>
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
          ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClose}>Done</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SearchSongDailog;
