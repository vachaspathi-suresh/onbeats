import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { toast } from "react-toastify";
import useHTTP from "../../hooks/use-http";

import {
  createPlaylistRoute,
  getPlaylistNamesRoute,
} from "../../utils/APIRoutes";
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

let namesList = [];

const CreatePlaylistDailog = ({ open, handleClose, islistAdded }) => {
  const token = useSelector((state) => state.auth.token);
  const {
    value: nameValue,
    isValid: nameIsValid,
    hasError: nameHasError,
    valueChangeHandler: nameChangeHandler,
    onBlurHandler: nameBlurHandler,
  } = useInput((value) => value.trim() !== "");
  const [isNameTaken, setIsNameTaken] = useState(false);
  const { isLoading, clearError, sendRequest } = useHTTP();
  const { isLoading: getLoading, sendRequest: getSendRequest } = useHTTP();

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
        namesList = responseData.listnames;
      } catch (err) {
        toast.error(err.message, toastOptions);
      }
    };
    getPlaylistNames();
  }, [getSendRequest]);

  const handleCreate = async (event) => {
    event.preventDefault();
    plnameBlurHandler();
    if (nameIsValid && !isNameTaken) {
      try {
        const dataResponse = await sendRequest(
          createPlaylistRoute,
          "POST",
          JSON.stringify({
            playlistname: nameValue,
          }),
          {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        );
        if (dataResponse.playlistname) {
          toast.success(
            `${dataResponse.playlistname} is created`,
            toastOptions
          );
          islistAdded((prev) => prev + 1);
          handleClose();
        }
      } catch (err) {
        toast.error(err.message, {
          ...toastOptions,
          onClose: () => {
            clearError();
          },
        });
      }
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
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth={true}>
        <DialogTitle>Create Playlist</DialogTitle>
        <DialogContent>
          {!getLoading && (
            <>
              <DialogContentText>Enter Playlist Title</DialogContentText>
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
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button disabled={isLoading} onClick={handleCreate}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreatePlaylistDailog;
