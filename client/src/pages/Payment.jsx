import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useHTTP from "../hooks/use-http";
import { addSubscriptionRoute } from "../utils/APIRoutes";
import Loader from "../components/UI/Loader";
import { toast } from "react-toastify";
import { userActions } from "../store/user";

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

const Payment = () => {
  const searchParams = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [paymentStatus, setPaymentStatus] = useState("canceled");
  const [expireAt, setexpireAt] = useState();
  const token = useSelector((state) => state.auth.token);
  const uname = useSelector((state) => state.user.username);
  const name = useSelector((state) => state.user.name);
  const avatar = useSelector((state) => state.user.avatar);
  const { isLoading, clearError, sendRequest } = useHTTP();

  useEffect(() => {
    setPaymentStatus(searchParams[0].get("success") ? "success" : "canceled");
    const addSubscription = async (session_id) => {
      try {
        const responseData = await sendRequest(
          addSubscriptionRoute,
          "POST",
          JSON.stringify({
            session_id: session_id,
          }),
          {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        );
        if (responseData.status === "success") {
          setexpireAt(responseData.expiresAt);
          dispatch(userActions.setStatus("prm"));
          localStorage.setItem(
            "onbeats-user-data",
            JSON.stringify({
              name: name,
              uname: uname,
              avatar: avatar,
              userstatus: "prm",
            })
          );
        } else setPaymentStatus("canceled");
      } catch (err) {
        toast.error(err.message, toastOptions);
      }
    };
    if (searchParams[0].get("success") && !!token)
      addSubscription(searchParams[0].get("session_id"));
  }, [token]);
  return isLoading ? (
    <Loader />
  ) : (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          sx={{ height: 250 }}
          image={
            paymentStatus === "success"
              ? "./payment-success.png"
              : "./payment-fail.png"
          }
          title={paymentStatus}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" align="center">
            Payment {paymentStatus === "success" ? "Successful" : "Failed"}
          </Typography>
          {paymentStatus === "success" && (
            <Typography variant="body2" align="center">
              Pack Expires on {new Date(expireAt).toDateString()}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary" align="center">
            {paymentStatus === "success"
              ? "Your payment was Successful! you can now continue using Onbeats!"
              : "Your Payment is failed! please try again later"}
          </Typography>
        </CardContent>
        <CardActions
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            color="success"
            variant="contained"
            onClick={() => navigate("/")}
          >
            Go to Home
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default Payment;
