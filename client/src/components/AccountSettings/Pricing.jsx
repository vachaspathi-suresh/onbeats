import React from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  CssBaseline,
  GlobalStyles,
  Grid,
  Toolbar,
  Typography,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import Nav from "../UI/Nav";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createSessionRoute } from "../../utils/APIRoutes";
import { useSelector } from "react-redux";
import useHTTP from "../../hooks/use-http";

const tiers = [
  {
    title: "Free",
    price: "0",
    description: ["Access to all songs", "Ad-free experience", "Email support"],
    buttonText: "Sign up for free",
    buttonVariant: "outlined",
  },
  {
    title: "Pro",
    subheader: "Most popular",
    price: "149",
    description: [
      "All Free Features",
      "Custumized Playlists",
      "Lyrics and Share options",
      "Email support",
    ],
    buttonText: "Get started",
    buttonVariant: "contained",
  },
  {
    title: "Premium",
    price: "19",
    description: [
      "All Free Features",
      "Custumized Playlists",
      "Lyrics and Share options",
      "Email support",
    ],
    buttonText: "Get startted",
    buttonVariant: "outlined",
  },
];

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

const Pricing = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const { isLoading, sendRequest } = useHTTP();

  const handleSubmit = async (tire) => {
    if (tire === "Free") {
      navigate("/");
    } else if (tire === "Premium") {
      try {
        const responseData = await sendRequest(
          createSessionRoute,
          "POST",
          JSON.stringify({
            lookup_key: "onbeats_monthly_subsciption",
          }),
          {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        );
        window.location.href = responseData.url;
      } catch (err) {
        toast.error(err.message, toastOptions);
      }
    } else if (tire === "Pro") {
      try {
        const responseData = await sendRequest(
          createSessionRoute,
          "POST",
          JSON.stringify({
            lookup_key: "onbeats_year_subscription",
          }),
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

  return (
    <>
      <GlobalStyles
        styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
      />
      <CssBaseline />
      <Nav />
      <Toolbar />
      <Container
        disableGutters
        maxWidth="sm"
        component="main"
        sx={{ pt: 8, pb: 6 }}
      >
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Onbeats
        </Typography>
        <Typography
          variant="h5"
          align="center"
          color="text.secondary"
          component="p"
        >
          why wait? Join our community of subscribers today and start enjoying
          all of these benefits and more. Subscribe now and experience the best
          that our service has to offer.
        </Typography>
      </Container>

      <Container maxWidth="md" component="main" sx={{ marginBottom: 10 }}>
        <Grid container spacing={5} alignItems="flex-end">
          {tiers.map((tier) => (
            <Grid
              item
              key={tier.title}
              xs={12}
              sm={tier.title === "Premum" ? 12 : 6}
              md={4}
            >
              <Card>
                <CardHeader
                  title={tier.title}
                  subheader={tier.subheader}
                  titleTypographyProps={{ align: "center" }}
                  action={tier.title === "Pro" ? <StarIcon /> : null}
                  subheaderTypographyProps={{
                    align: "center",
                  }}
                  sx={{
                    backgroundColor: (theme) =>
                      theme.palette.mode === "light"
                        ? theme.palette.grey[200]
                        : theme.palette.grey[700],
                  }}
                />
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "baseline",
                      mb: 2,
                    }}
                  >
                    <Typography
                      component="h2"
                      variant="h3"
                      color="text.primary"
                    >
                      ₹{tier.price}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      {tier.title === "Pro" ? "/yr" : "/mo"}
                    </Typography>
                  </Box>
                  <ul>
                    {tier.description.map((line) => (
                      <Typography
                        component="li"
                        variant="subtitle1"
                        align="center"
                        key={line}
                      >
                        {line}
                      </Typography>
                    ))}
                  </ul>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant={tier.buttonVariant}
                    color="secondary"
                    onClick={() => handleSubmit(tier.title)}
                    disabled={isLoading}
                  >
                    {tier.buttonText}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default Pricing;
