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
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { Search, Clear } from "@mui/icons-material";
import { toast } from "react-toastify";

import {
  addToPlaylistRoute,
  getPlaylistNamesRoute,
} from "../../utils/APIRoutes";
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

const SelectPlaylistDailog = ({ open, handleClose, songId }) => {
  const token = useSelector((state) => state.auth.token);
  const [searchInput, setSearchInput] = useState("");
  const [alllists, setAllLists] = useState([]);
  const { isLoading: getLoading, sendRequest: getSendRequest } = useHTTP();
  const { isLoading, sendRequest } = useHTTP();

  useEffect(() => {
    const getPlaylistNames = async () => {
      try {
        const responseData = await getSendRequest(
          getPlaylistNamesRoute,
          "POST",
          null,
          {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        );
        const lists = responseData.listnames.map((list) => {
          return { name: list, isSelected: false };
        });
        setAllLists(lists);
      } catch (err) {
        if(!err.message.includes("aborted"))
            toast.error(err.message, toastOptions);
      }
    };
    getPlaylistNames();
  }, [getSendRequest]);

  const addToList = () => {
    const addFunction = async (playlistname) => {
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
        if (responseData.playlists.length === alllists.length) {
          return true;
        } else {
          return false;
        }
      } catch (err) {
        toast.error(err.message, toastOptions);
        return false;
      }
    };
    let i=0;
    const promises = alllists.map((list) => {
      if (list.isSelected) {
        i+=1;
        return new Promise((resolve) =>
          setTimeout(() => {
            if (addFunction(list.name)) {
              toast.success(`Added to ${list.name}`, toastOptions);
            } else {
              toast.error(`Unable to Add in ${list.name}`, toastOptions);
            }
            resolve();
          }, 1000 * i)
        );
      }
    });
    Promise.all(promises).then(() =>
      setTimeout(() => {
        handleClose();
      }, 1000)
    );
  };

  const filteredlists =
    searchInput.trim().length === 0
      ? alllists
      : alllists.filter((list) =>
          list.name.toLowerCase().includes(searchInput.toLowerCase())
        );

  const selectList = (name) => {
    const lists = alllists.map((list) => {
      if (list.name === name) list.isSelected = !list.isSelected;
      return list;
    });
    setAllLists(lists);
  };

  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Select Playlist</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Select Playlist(s) to add the Song
        </DialogContentText>
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
        {!getLoading &&
          filteredlists &&
          (filteredlists.length === 0 ? (
            <Typography>No Playlist Found</Typography>
          ) : (
            <List>
              {filteredlists.map((list, index) => (
                <ListItem disablePadding key={index}>
                  <ListItemButton
                    onClick={() => {
                      selectList(list.name);
                    }}
                  >
                    <Checkbox checked={list.isSelected} />
                    <ListItemText>{list.name}</ListItemText>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button disabled={isLoading} onClick={addToList}>Done</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SelectPlaylistDailog;
