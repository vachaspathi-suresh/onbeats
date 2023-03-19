import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box } from '@mui/material';
import SelectPlaylistDailog from '../Playlists/SelectPlaylistDailog';


const DotMenu = ({songId})=>{
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [selectOpen, setSelectOpen] = useState(false);
  
  const handleClickSelectOpen = () => {
    setSelectOpen(true);
  };

  const handleSelectClose = () => {
    handleClose();
    setSelectOpen(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
    <Box sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems:'center',
    }}>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: '20ch',
          },
        }}
      >
          <MenuItem onClick={handleClickSelectOpen}>
            {"Add to Playlist"}
          </MenuItem>
          <MenuItem onClick={handleClose}>
            {"Play Next"}
          </MenuItem>
          <MenuItem onClick={handleClose}>
            {"Add to queue"}
          </MenuItem>
      </Menu>
    </Box>
    {selectOpen && (
      <SelectPlaylistDailog
        open={selectOpen}
        handleClose={handleSelectClose}
        songId = {songId}
      />
    )}
    </>
  );
}

export default DotMenu;