import React from "react";

import Nav from "../components/UI/Nav";
import Login from "../components/Auth/Login";
import { Toolbar } from "@mui/material";

const Auth = () => {
  return (
    <>
      <Nav />
      <Toolbar/>
      <Login />
    </>
  );
};

export default Auth;
