import React, { Suspense, useEffect } from "react";
import { Routes, Route, Navigate} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import { lightBlue } from "@mui/material/colors";
import { useDispatch, useSelector } from "react-redux";

import { useAuth } from "./hooks/use-auth";
import { authActions } from "./store/auth";
import { userActions } from "./store/user";
import Loader from "./components/UI/Loader";
import Auth from "./pages/Auth";
import Dashboard from "./components/HomePage/Dashboard";
import Payment from "./pages/Payment";

const Pricing = React.lazy(() => import("./components/AccountSettings/Pricing"));
const Admin = React.lazy(() => import("./pages/Admin"));
const SetAvatar = React.lazy(() => import("./pages/SetAvatar"));
const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));
const Error = React.lazy(() => import("./pages/Error"));

const theme = createTheme({
  palette: {
    primary: {
      main: lightBlue["200"],
    },
    secondary: {
      main: lightBlue["700"],
    },
  },
});

function App() {
  const dispatch = useDispatch();
  const { token, login, logout, userId } = useAuth();
  const userStatus = useSelector((state) => state.user.userstatus);

  useEffect(() => {
    dispatch(authActions.setIsLoggedIn(!!token));
    dispatch(authActions.setToken(token));
    dispatch(authActions.setUID(userId));
    dispatch(authActions.setLogin(login));
    dispatch(authActions.setLogout(logout));
    if (!!token) {
      const storedData = JSON.parse(localStorage.getItem("onbeats-user-data"));
      if (storedData) {
        dispatch(userActions.setAvatar(storedData.avatar));
        dispatch(userActions.setUsername(storedData.uname));
        dispatch(userActions.setName(storedData.name));
        dispatch(userActions.setStatus(storedData.userstatus));
      }
    }
  }, [dispatch, token, userId, login, logout, userStatus]);

  return (
    <ThemeProvider theme={theme}>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route
            path="/pricing"
            element={
              !!token ? (
                userStatus === "adm" ? (
                  <Navigate to="/admin" />
                ) : (
                  <Pricing />
                )
              ) : (
                <Navigate to="/admin" />
              )
            }
          />
          <Route
            path="/payment"
            element={
              userStatus === "adm" ? <Navigate to="/admin" /> : <Payment />
            }
          />
          <Route
            path="/home/song/:songname"
            element={
              userStatus === "adm" ? <Navigate to="/admin" /> : <Dashboard />
            }
          />
          <Route
            path="/home"
            element={
              !!token ? (
                userStatus === "adm" ? (
                  <Navigate to="/admin" />
                ) : (
                  <Dashboard />
                )
              ) : (
                <Auth />
              )
            }
          />
          <Route
            path="/admin"
            element={userStatus === "adm" ? <Admin /> : <Navigate to="/" />}
          />
          <Route
            path="/playlists/:listname"
            element={
              !!token ? (
                userStatus === "adm" ? (
                  <Navigate to="/admin" />
                ) : (
                  <Dashboard />
                )
              ) : (
                <Auth />
              )
            }
          />
          <Route
            path="/playlists"
            element={
              !!token ? (
                userStatus === "adm" ? (
                  <Navigate to="/admin" />
                ) : (
                  <Dashboard />
                )
              ) : (
                <Auth />
              )
            }
          />
          <Route
            path="/auth"
            element={
              !!token ? (
                userStatus === "adm" ? (
                  <Navigate to="/admin" />
                ) : (
                  <Navigate to="/home" />
                )
              ) : (
                <Auth />
              )
            }
          />
          <Route
            path="/avatar"
            element={
              !!token ? (
                userStatus === "adm" ? (
                  <Navigate to="/admin" />
                ) : (
                  <SetAvatar />
                )
              ) : (
                <Auth />
              )
            }
          />
          <Route
            path="/auth/forget-password"
            element={!!token ? <Navigate to="/" /> : <ForgotPassword />}
          />
          <Route
            path="/auth/reset-password"
            element={!!token ? <Navigate to="/" /> : <ResetPassword />}
          />
          <Route
            path="/"
            element={
              !!token ? (
                userStatus === "adm" ? (
                  <Navigate to="/admin" />
                ) : (
                  <Navigate to="/home" />
                )
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          <Route path="/*" element={<Error />} />
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
