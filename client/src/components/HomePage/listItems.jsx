import React, { useState } from "react";
import {
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import { useSelector } from "react-redux";

import CreatePlaylistDailog from "../Playlists/CreatePlaylistDailog";
import SearchSongDailog from "./SearchSongDailog";
import { useNavigate } from "react-router-dom";

const NavListItems = ({playSong,allSongs,islistAdded}) => {
  const navigate = useNavigate();
  const userStatus = useSelector((state) => state.user.userstatus);
  const [createOpen, setCreateOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleClickCreateOpen = () => {
    setCreateOpen(true);
  };

  const handleCreateClose = () => {
    setCreateOpen(false);
  };

  const handleClickSearchOpen = () => {
    setSearchOpen(true);
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
  };

  const searchSongPlay=(song)=>{
    handleSearchClose();
    playSong(song);
  }

  return (
    <>
      <ListItemButton onClick={()=>{navigate("/home")}}>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItemButton>
      <ListItemButton onClick={handleClickSearchOpen}>
        <ListItemIcon>
          <SearchIcon />
        </ListItemIcon>
        <ListItemText primary="Search" />
      </ListItemButton>
      {userStatus === "prm" && (
        <>
          <ListItemButton  onClick={()=>{
            navigate("/playlists")}}>
            <ListItemIcon>
              <LibraryMusicIcon />
            </ListItemIcon>
            <ListItemText primary="Your Library" />
          </ListItemButton>

          <Divider sx={{ my: 1 }} />

          <ListSubheader component="div" inset>
            Librarys
          </ListSubheader>
          <ListItemButton onClick={handleClickCreateOpen}>
            <ListItemIcon>
              <LibraryAddIcon />
            </ListItemIcon>
            <ListItemText primary="Create Playlist" />
          </ListItemButton>
        </>
      )}
      {createOpen && (
        <CreatePlaylistDailog
          open={createOpen}
          handleClose={handleCreateClose}
          islistAdded={islistAdded}
        />
      )}
      {searchOpen && (
        <SearchSongDailog
          allSongs={allSongs}
          open={searchOpen}
          handleClose={handleSearchClose}
          playSong={searchSongPlay}
        />
      )}
    </>
  );
};
export default NavListItems;
