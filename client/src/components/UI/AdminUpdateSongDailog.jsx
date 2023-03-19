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
  Stack,
} from "@mui/material";
import { Search, Clear } from "@mui/icons-material";
import {
  adminUpdateSongRoute,
  getSongCoverRoute,
  getSongRoute,
  getSongsRoute,
} from "../../utils/APIRoutes";
import { toast } from "react-toastify";
import useHTTP from "../../hooks/use-http";
import useInput from "../../hooks/use-input";
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
const AdminUpdateSongDailog = ({ open, handleClose }) => {
  const token = useSelector((state) => state.auth.token);
  const [allSongs, setAllSongs] = useState([]);
  const [stage, setStage] = useState(1);
  const [updateField, setUpdateField] = useState("songname");
  const [searchInput, setSearchInput] = useState("");
  const {
    value: nameValue,
    isValid: nameIsValid,
    hasError: nameHasError,
    valueChangeHandler: nameChangeHandler,
    onBlurHandler: nameBlurHandler,
  } = useInput((value) => value.trim() !== "");
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

  const handleUpdate = async () => {
    if (stage === 4) {
      if (!nameIsValid) {
        nameBlurHandler();
        return;
      }
      try {
        const responseData = await getSendRequest(
          adminUpdateSongRoute,
          "POST",
          JSON.stringify({
            songId: selectedSong.songId,
            field: updateField,
            newValue: nameValue,
          }),
          {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        );
        if (!!responseData) {
          toast.success("Song Updated Successfully!!", toastOptions);
          handleClose();
        }
      } catch (err) {
        toast.error(err.message, toastOptions);
      }
    } else {
      handleClose();
    }
  };

  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const nameValueChangeHandler = (event) => {
    setStage(4);
    nameChangeHandler(event);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Update Song</DialogTitle>
        <DialogContent>
          {!getLoading&& stage === 1 && (
            <>
              <DialogContentText>Select Song to Update</DialogContentText>
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
                            setStage(2);
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
          {stage === 2 && (
            <Stack spacing={3}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  setUpdateField("songname");
                  setStage(3);
                }}
              >
                Update Song Name
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  setUpdateField("movie");
                  setStage(3);
                }}
              >
                Update Movie Name
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  setUpdateField("artist");
                  setStage(3);
                }}
              >
                Update Artist Name
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  setUpdateField("lyrics");
                  setStage(3);
                }}
              >
                Update Song Lyrics
              </Button>
            </Stack>
          )}
          {(stage === 3 || stage === 4) && (
            <>
              <DialogContentText>
                Enter New{" "}
                {updateField === "songname"
                  ? "Song Name"
                  : updateField === "movie"
                  ? "Movie Name"
                  : updateField === "artist"
                  ? "Artist Name"
                  : "Lyrics"}
              </DialogContentText>
              <TextField
                fullWidth
                required
                variant="outlined"
                autoComplete="given-name"
                id="name"
                name="name"
                margin="dense"
                multiline={updateField === "lyrics"}
                rows={updateField === "lyrics"?3:1}
                value={stage === 3 ? selectedSong[updateField] : nameValue}
                onChange={nameValueChangeHandler}
                onBlur={nameBlurHandler}
                error={nameHasError}
                helperText={nameHasError && "Field can't be empty"}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button color="secondary" variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="secondary" variant="contained" onClick={handleUpdate}>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminUpdateSongDailog;
