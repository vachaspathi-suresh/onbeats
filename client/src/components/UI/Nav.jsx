import React from "react";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import { Button, Link, Toolbar } from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";

import ProfileMenu from "../HomePage/ProfileMenu";
import { useNavigate } from "react-router-dom";

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const mdTheme = createTheme();

const Nav = () => {
  const navigate = useNavigate();
  return (
    <ThemeProvider theme={mdTheme}>
      <AppBar position="absolute">
        <Toolbar
          sx={{
            pr: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexGrow: 1,
              alignItems: "center",
            }}
          >
            <Button onClick={() => navigate("/")}>
              <img
                src="./logo.png"
                alt="Onbeats"
                height="3rem"
                style={{ height: "3rem" }}
              />
            </Button>
            <ProfileMenu />
          </div>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

export default Nav;
