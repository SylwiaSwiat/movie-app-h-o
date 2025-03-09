import { Box, Container, Typography, IconButton } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <Container
      maxWidth="lg"
      sx={{
        textAlign: "center",
        m: 1,
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Box
        component="img"
        src="/oops.jpg"
        alt="Oops! Coś poszło nie tak."
        loading="lazy"
        sx={{ width: "100%", maxWidth: 400, mb: 3, borderRadius: "8px" }}
      />
      <Typography variant="h4" color="error">
        Strona nie znaleziona
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Przepraszamy, ale podana strona nie istnieje.
      </Typography>
      <Link to="/" style={{ marginTop: 20 }}>
        <IconButton color="primary">
          <HomeIcon fontSize="large" />
        </IconButton>
      </Link>
    </Container>
  );
};

export default ErrorPage;
