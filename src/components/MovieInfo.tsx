import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CardMedia,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Button,
} from "@mui/material";
import YouTubeIcon from "@mui/icons-material/YouTube";

const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

type MovieDetails = {
  id: number;
  title?: string;
  poster_path?: string;
  overview?: string;
  release_date?: string;
  runtime?: number;
  production_countries?: Array<{ iso_3166_1: string; name: string }>;
  genres?: Array<{ name: string }>;
  budget?: number;
};

type Video = {
  key: string;
  site: string;
  type: string;
};

const MovieInfo = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `${API_URL}/movie/${id}?api_key=${API_KEY}&language=pl-PL`
        );

        const data = await response.json();
        setMovie(data);
      } catch {
        setError("Nie udało się załadować danych o filmie.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const response = await fetch(
          `${API_URL}/movie/${id}/videos?api_key=${API_KEY}`
        );
        if (!response.ok) return;

        const data = await response.json();
        const trailer = data.results.find(
          (video: Video) => video.type === "Trailer" && video.site === "YouTube"
        );

        if (trailer) {
          setTrailerUrl(`https://www.youtube.com/watch?v=${trailer.key}`);
        }
      } catch {
        console.error("Nie udało się załadować trailera.");
      }
    };

    fetchTrailer();
  }, [id]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress size="6rem" />
      </Box>
    );
  }

  if (error || !movie) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h6">{error || "Film nie znaleziony"}</Typography>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection={isMobile ? "column" : "row"}
      alignItems="center"
      p={isMobile ? 2 : 3}
      gap={isMobile ? 2 : 3}
      height="100vh"
      sx={{
        transition: "box-shadow 0.3s ease",
        animation: "fadeInUp 0.6s ease-out",
        "@keyframes fadeInUp": {
          from: { opacity: 0, transform: "translateY(20px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      {movie.poster_path && (
        <CardMedia
          component="img"
          image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          loading="lazy"
          sx={{
            width: isMobile ? "100%" : "40%",
            maxWidth: 400,
            my: isMobile ? 3 : 0,
            objectFit: "cover",
            borderRadius: "8px",
            boxShadow: "0px 4px 16px rgba(70, 67, 67, 0.2)",
          }}
        />
      )}
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        width={isMobile ? "100%" : "60%"}
        p={isMobile ? 1 : 3}
      >
        {movie.title && (
          <Typography variant="h4" gutterBottom color="primary.main">
            {movie.title}
          </Typography>
        )}
        {movie.overview && (
          <Typography variant="body1" gutterBottom>
            {movie.overview}
          </Typography>
        )}
        {movie.release_date && (
          <Typography variant="body2" color="text.secondary" mb={1}>
            Data wydania:{" "}
            <Typography component="span" fontWeight="bold">
              {movie.release_date}
            </Typography>
          </Typography>
        )}
        {movie.runtime && (
          <Typography variant="body2" color="text.secondary" mb={1}>
            Czas trwania:{" "}
            <Typography component="span" fontWeight="bold">
              {movie.runtime} min
            </Typography>
          </Typography>
        )}
        {movie.production_countries &&
          movie.production_countries.length > 0 && (
            <Typography variant="body2" color="text.secondary" mb={1}>
              Kraj pochodzenia:{" "}
              <Typography component="span" fontWeight="bold">
                {movie.production_countries
                  .map((country) => country.name)
                  .join(", ")}
              </Typography>
            </Typography>
          )}
        {movie.budget !== undefined && movie.budget > 0 && (
          <Typography variant="body2" color="text.secondary" mb={1}>
            Budżet:{" "}
            <Typography component="span" fontWeight="bold">
              {movie.budget.toLocaleString()}$
            </Typography>
          </Typography>
        )}
        {movie.genres && movie.genres.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            Gatunki:{" "}
            <Typography component="span" fontWeight="bold">
              {movie.genres.map((genre) => genre.name).join(", ")}
            </Typography>
          </Typography>
        )}
        {trailerUrl && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<YouTubeIcon />}
            href={trailerUrl}
            target="_blank"
            sx={{ my: 4 }}
          >
            Trailer
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default MovieInfo;
