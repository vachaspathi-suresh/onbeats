import { Box, Button, Grid, Toolbar, Typography } from "@mui/material";
import React, { useRef, useState } from "react";
import AdminAddSongDailog from "../components/UI/AdminAddSongDailog";
import AdminDeleteSongDailog from "../components/UI/AdminDeleteSongDailog";
import AdminUpdateSongDailog from "../components/UI/AdminUpdateSongDailog";

import Nav from "../components/UI/Nav";

const Admin = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const [updateOpen, setupdateOpen] = useState(false);
  const [deleteOpen, setdeleteOpen] = useState(false);
  
  const handleClickCreateOpen = () => {
    setCreateOpen(true);
  };

  const handleCreateClose = () => {
    setCreateOpen(false);
  };

  const handleClickupdateOpen = () => {
    setupdateOpen(true);
  };

  const handleupdateClose = () => {
    setupdateOpen(false);
  };

  const handleClickdeleteOpen = () => {
    setdeleteOpen(true);
  };

  const handledeleteClose = () => {
    setdeleteOpen(false);
  };

  return (
    <>
      <Nav />
      <Toolbar />
      <Box m={10}>
        <Grid container spacing={10}>
          <Grid item>
            <Button size="large" variant="contained" color="success" onClick={handleClickCreateOpen}>
              Add New Song
            </Button>
          </Grid>
          <Grid item>
            <Button size="large" variant="contained" color="warning" onClick={handleClickupdateOpen}>
              Update a Song
            </Button>
          </Grid>
          <Grid item>
            <Button size="large" variant="contained" color="error" onClick={handleClickdeleteOpen}>
              Delete a Song
            </Button>
          </Grid>
        </Grid>
      </Box>
      {createOpen && (
        <AdminAddSongDailog
          open={createOpen}
          handleClose={handleCreateClose}
        />
      )}
      {updateOpen && (
        <AdminUpdateSongDailog
          open={updateOpen}
          handleClose={handleupdateClose}
        />
      )}
      {deleteOpen && (
        <AdminDeleteSongDailog
          open={deleteOpen}
          handleClose={handledeleteClose}
        />
      )}
    </>
  );
};

export default Admin;
