import React, { useState } from "react";
import {
  Typography,
  Box,
  Tooltip,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import ConfirmDialog from "../UI/ConfirmDialog";
import AccountSettingsDialog from "../AccountSettings/AccountSettingsDialog";
import { manageSubscriptionRoute } from "../../utils/APIRoutes";
import { toast } from "react-toastify";
import useHTTP from "../../hooks/use-http";

const ProfileMenu = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const userStatus = useSelector((state) => state.user.userstatus);
  const currentName = useSelector((state) => state.user.name);
  const currentUserAvatar = useSelector((state) => state.user.avatar);
  const isLogged = useSelector((state) => state.auth.isLoggedIn);
  const logout = useSelector((state) => state.auth.logout);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const { isLoading, sendRequest } = useHTTP();

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

  const subscriptionClick = async () => {
    if (userStatus === "cmn") {
      navigate("/pricing");
    } else {
      try {
        const responseData = await sendRequest(
          manageSubscriptionRoute,
          "POST",
          null,
          {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        );
        window.location.href = responseData.url;
      } catch (err) {
        toast.error(err.message, toastOptions);
      }
    }
  };

  const handleLogoutDialogClose = () => {
    setLogoutDialogOpen(false);
    setAnchorElUser(null);
  };

  const handleSettingsDialogClose = () => {
    setSettingsDialogOpen(false);
    setAnchorElUser(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      {isLogged ? (
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar
                alt={currentName}
                src={`data:image/png;base64,${currentUserAvatar}`}
                sx={{ bgcolor: "#A6E3E9" }}
              />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <MenuItem
              onClick={() => {
                setSettingsDialogOpen(true);
              }}
            >
              <Typography textAlign="center">Account Settings</Typography>
            </MenuItem>
            <MenuItem disabled={isLoading} onClick={subscriptionClick}>
              <Typography textAlign="center">Manage Subscription</Typography>
            </MenuItem>
            <MenuItem
              onClick={() => {
                setLogoutDialogOpen(true);
              }}
            >
              <Typography textAlign="center">Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
      ) : (
        <Box sx={{ flexGrow: 0 }}>
          <Button
            variant="outlined"
            sx={{ color: "whitesmoke", borderColor: "whitesmoke" }}
            onClick={() => navigate("/auth")}
          >
            Login
          </Button>
        </Box>
      )}
      {logoutDialogOpen && (
        <ConfirmDialog
          title="Logout"
          desc="Logout from your Account"
          open={logoutDialogOpen}
          handleClose={handleLogoutDialogClose}
          onConfirm={() => {
            logout();
            handleLogoutDialogClose();
          }}
        />
      )}
      {settingsDialogOpen && (
        <AccountSettingsDialog
          open={settingsDialogOpen}
          handleClose={handleSettingsDialogClose}
        />
      )}
    </>
  );
};

export default ProfileMenu;
