import React from "react";
import { Toolbar } from "@mui/material";

import ForgetPasswordForm from "../components/Auth/ForgetPasswordForm";
import Nav from "../components/UI/Nav";

const ForgotPassword = ()=>{
  return (
    <>
      <Nav />
      <Toolbar/>
      <ForgetPasswordForm />
    </>
  );
}

export default ForgotPassword;
