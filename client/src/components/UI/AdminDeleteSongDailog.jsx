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
  ListItemText,
  ListItemButton,
  Typography,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import { Search, Clear } from "@mui/icons-material";
import {
  adminDeleteSongRoute,
  getSongCoverRoute,
  getSongRoute,
  getSongsRoute,
} from "../../utils/APIRoutes";
import { toast } from "react-toastify";
import useHTTP from "../../hooks/use-http";
import ConfirmDialog from "./ConfirmDialog";
import { useSelector } from "react-redux";

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
let selectedSong = "";
const AdminDeleteSongDailog = ({ open, handleClose }) => {
  const token = useSelector((state) => state.auth.token);
  const [allSongs, setAllSongs] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [delDialogOpen, setDelDialogOpen] = useState(false);
  const { isLoading: getLoading, sendRequest: getSendRequest } = useHTTP();
  const filteredsongs =
    searchInput.trim().length === 0
      ? allSongs
      : allSongs.filter(
          (song) =>
            song.songname.toLowerCase().includes(searchInput.toLowerCase()) ||
            song.movie.toLowerCase().includes(searchInput.toLowerCase())
        );

  useEffect(() => {
    const getSongs = async () => {
      try {
        const responseData = await getSendRequest(getSongsRoute, "POST", null, {
          "Content-Type": "application/json",
        });
        const list = responseData.songnames.map((s) => ({
          ...s,
          song: `${getSongRoute}/${s.song}`,
        }));

        setAllSongs(list);
      } catch (err) {
        toast.error(err.message, toastOptions);
      }
    };
    getSongs();
  }, [getSendRequest]);

  const deleteSong = async (song) => {
    try {
      const responseData = await getSendRequest(
        adminDeleteSongRoute,
        "POST",
        JSON.stringify({
          songId: song.songId,
        }),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      );
      if (!!responseData) {
        toast.success("Song Deleted Successfully!!", toastOptions);
        handleClose();
      }
    } catch (err) {
      toast.error(err.message, toastOptions);
    }
  };

  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Song</DialogTitle>
        <DialogContent>
          {!getLoading && (
            <>
              <DialogContentText>Enter Song Name:</DialogContentText>
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
                        <ListItemButton
                          onClick={() => {
                            selectedSong = song;
                            setDelDialogOpen(true);
                          }}
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
                          <ListItemText
                            primary={song.songname}
                            secondary={song.movie}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                ))}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button color="secondary" variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="secondary" variant="contained" onClick={handleClose}>
            Done
          </Button>
        </DialogActions>
      </Dialog>
      {delDialogOpen && (
        <ConfirmDialog
          title="Delete Song"
          desc={`Delete song "${selectedSong.songname}"`}
          open={delDialogOpen}
          handleClose={() => setDelDialogOpen(false)}
          onConfirm={() => deleteSong(selectedSong)}
        />
      )}
    </>
  );
};

export default AdminDeleteSongDailog;
