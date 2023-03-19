import {Stack, Typography } from "@mui/material";
import React from "react";

const Error = () => {
  return (
      <Stack spacing={2} sx={{height:"100vh",alignItems:"center"}}>
        <img src="./error.svg" height={"80%"} alt="404 ERROR"></img>
        <Typography variant="h5">
          Page Not Found
        </Typography>
        <Typography>
          Let's Go <a href="/">Home</a> and try from there.
        </Typography>
      </Stack>
  );
};

export default Error;
