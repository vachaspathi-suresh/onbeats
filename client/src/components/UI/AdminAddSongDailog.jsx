import React, { useRef, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { toast } from "react-toastify";
import useHTTP from "../../hooks/use-http";

import { adminAddSongRoute, getImageUploadUrl, getSongUploadUrl } from "../../utils/APIRoutes";
import useInput from "../../hooks/use-input";
import { useSelector } from "react-redux";
import { Stack, Typography } from "@mui/material";

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

const AdminAddSongDailog = ({ open, handleClose }) => {
  const token = useSelector((state) => state.auth.token);
  const coverInputRef = useRef(null);
  const songInputRef = useRef(null);
  const [coverImage, setCoverImage] = useState();
  const [coverImageIsValid, setCoverImageIsValid] = useState(true);
  const [songFile, setSongFile] = useState();
  const [songFileIsValid, setSongFileIsValid] = useState(true);
  const {
    value: nameValue,
    isValid: nameIsValid,
    hasError: nameHasError,
    valueChangeHandler: nameChangeHandler,
    onBlurHandler: nameBlurHandler,
  } = useInput((value) => value.trim() !== "");
  const {
    value: artistValue,
    isValid: artistIsValid,
    hasError: artistHasError,
    valueChangeHandler: artistChangeHandler,
    onBlurHandler: artistBlurHandler,
  } = useInput((value) => value.trim() !== "");
  const {
    value: movieValue,
    isValid: movieIsValid,
    hasError: movieHasError,
    valueChangeHandler: movieChangeHandler,
    onBlurHandler: movieBlurHandler,
  } = useInput((value) => value.trim() !== "");
  const {
    value: lyricsValue,
    isValid: lyricsIsValid,
    hasError: lyricsHasError,
    valueChangeHandler: lyricsChangeHandler,
    onBlurHandler: lyricsBlurHandler,
  } = useInput(() => true);
  const { isLoading, clearError, sendRequest } = useHTTP();

  const handleCreate = async (event) => {
    event.preventDefault();
    if (
      !nameIsValid ||
      !movieIsValid ||
      !artistIsValid ||
      !lyricsIsValid ||
      !coverImage ||
      !songFile
    ) {
      nameBlurHandler();
      movieBlurHandler();
      artistBlurHandler();
      lyricsBlurHandler();
      if (!coverImage) setCoverImageIsValid(false);
      if (!songFile) setSongFileIsValid(false);
      return;
    }

    let formdata = new FormData();
    formdata.append("name", nameValue);
    formdata.append("movie", movieValue);
    formdata.append("artist", artistValue);
    formdata.append("lyrics", lyricsValue);
    formdata.append("cover", coverImage);
    formdata.append("song", songFile);
    let imageName;
    let songName;
    try {
      const imageDataResponse = await sendRequest(
        getImageUploadUrl,
        "POST",
        JSON.stringify({
          extension: coverImage.name.split('.').pop(),
        }),
        {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      );
      if (!!imageDataResponse) {
        await sendRequest(
          imageDataResponse.url,
          "PUT",
          coverImage,
          {
            "Content-Type": "multipart/form-data",
          }
        );
        imageName = imageDataResponse.fileName;
      }
      const songDataResponse = await sendRequest(
        getSongUploadUrl,
        "POST",
        JSON.stringify({
          extension: songFile.name.split('.').pop(),
        }),
        {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      );
      if (!!songDataResponse) {
        await sendRequest(
          songDataResponse.url,
          "PUT",
          songFile,
          {
            "Content-Type": "multipart/form-data",
          }
        );
        songName = songDataResponse.fileName;
      }
      const dataResponse = await sendRequest(
        adminAddSongRoute,
        "POST",
        JSON.stringify({
          "name": nameValue,
          "movie": movieValue,
          "artist": artistValue,
          "lyrics": lyricsValue,
          "cover": imageName,
          "song": songName,
        }),
        {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      );
      if (!!dataResponse) {
        toast.success("Song Added Successfully!!", toastOptions);
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
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth={true}>
        <DialogTitle>Add New Song</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              fullWidth
              required
              label="Song Name"
              variant="outlined"
              autoComplete="given-name"
              id="name"
              name="name"
              margin="dense"
              value={nameValue}
              onChange={nameChangeHandler}
              onBlur={nameBlurHandler}
              error={nameHasError}
              helperText={nameHasError && "Field can't be empty"}
            />
            <TextField
              fullWidth
              required
              label="Movie Name"
              variant="outlined"
              autoComplete="given-name"
              id="movie"
              name="movie"
              margin="dense"
              value={movieValue}
              onChange={movieChangeHandler}
              onBlur={movieBlurHandler}
              error={movieHasError}
              helperText={movieHasError && "Field can't be empty"}
            />
            <TextField
              fullWidth
              required
              label="Artist Name"
              variant="outlined"
              autoComplete="given-name"
              id="artist"
              name="artist"
              margin="dense"
              value={artistValue}
              onChange={artistChangeHandler}
              onBlur={artistBlurHandler}
              error={artistHasError}
              helperText={artistHasError && "Field can't be empty"}
            />
            <Typography color={!coverImageIsValid && "red"}>
              Song Cover Image:
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  setCoverImage(e.target.files[0]);
                  if (!!e.target.files[0]) setCoverImageIsValid(true);
                }}
              />
              <Button
                onClick={() =>
                  coverInputRef.current && coverInputRef.current.click()
                }
                variant="contained"
                size="small"
                sx={{ marginLeft: 2 }}
                color={!coverImageIsValid ? "error" : "primary"}
              >
                Upload
              </Button>
              {coverImageIsValid ? coverImage?.name : "Field can't be empty"}
            </Typography>
            <Typography color={!songFileIsValid && "red"}>
              Song File(.mp3):
              <input
                ref={songInputRef}
                type="file"
                accept=".mp3"
                style={{ display: "none" }}
                onChange={(e) => {
                  setSongFile(e.target.files[0]);
                  console.log(e.target.files[0].name.split('.').pop());
                  if (!!e.target.files[0]) setSongFileIsValid(true);
                }}
              />
              <Button
                onClick={() =>
                  songInputRef.current && songInputRef.current.click()
                }
                variant="contained"
                size="small"
                sx={{ marginLeft: 2 }}
                color={!songFileIsValid ? "error" : "primary"}
              >
                Upload
              </Button>
              {songFileIsValid ? songFile?.name : "Field can't be empty"}
            </Typography>
            <TextField
              fullWidth
              id="lyrics"
              label="Song Lyrics"
              autoComplete="given-name"
              multiline
              rows={3}
              margin="dense"
              value={lyricsValue}
              onChange={lyricsChangeHandler}
              onBlur={lyricsBlurHandler}
              error={lyricsHasError}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="secondary"
            disabled={isLoading}
            onClick={handleCreate}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminAddSongDailog;
