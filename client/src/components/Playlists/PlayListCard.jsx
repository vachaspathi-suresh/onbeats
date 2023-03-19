import React from "react";
import {
  Box,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";

import { deletePlaylistRoute, getSongCoverRoute } from "../../utils/APIRoutes";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useHTTP from "../../hooks/use-http";
import { toast } from "react-toastify";

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

const PlayListCard = ({ listdata,setReload,playPlayList }) => {
  const token = useSelector((state) => state.auth.token);
  const { isLoading, sendRequest } = useHTTP();
  
  const deletePlayList = async () => {
    try {
      const responseData = await sendRequest(
        deletePlaylistRoute,
        "POST",
        JSON.stringify({
          playlistname: listdata.playlistname,
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

  return (
    <>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          height: 270,
          backgroundColor: "#e3f1ef",
          maxWidth: 230,
          padding: 1,
        }}
      >
        <Link
          to={`./${listdata.playlistname}`}
          style={{ textDecoration: "none" }}
        >
          <Typography
            component="h2"
            variant="h5"
            fontWeight={600}
            color="primary"
          >
            {listdata.playlistname}
          </Typography>
        </Link>
        <Typography
          sx={{ display: "flex", alignSelf: "end" }}
        >
          {listdata.playlistsongs.length} songs
        </Typography>

        <Paper sx={{ height: "60%", width: "100%" }}>
          <Link
            to={`./${listdata.playlistname}`}
            style={{ textDecoration: "none" }}
          >
            <img
              src={`${getSongCoverRoute}/${
                listdata.playlistsongs.length > 0
                  ? listdata.playlistsongs[0].cover
                  : "def.jpg"
              }`}
              background-size="conatin"
              height="100%"
              width="100%"
              alt="dffs"
            />
          </Link>
        </Paper>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <IconButton onClick={() => {playPlayList(listdata.playlistsongs)}}>
            <PlayCircleIcon color="primary" sx={{ fontSize: 42 }} />
          </IconButton>
          <Tooltip title="Delete Playlist">
            <IconButton disabled={isLoading} onClick={deletePlayList}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>
    </>
  );
};

export default PlayListCard;
