import { useState, useEffect } from "react";
import {
  Container,
  createTheme,
  ThemeProvider,
  CssBaseline,
  SelectChangeEvent,
  Typography,
  Box,
} from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home, { Movie } from "./components/Home";
import ErrorPage from "./components/ErrorPage";
import MovieInfo from "./components/MovieInfo";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#0288d1",
    },
    error: {
      main: "#c2224c",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1ed1",
    },
    text: {
      primary: "#e5e5e5",
      secondary: "#b0bec5",
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
  },
});

const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [genreId, setGenreId] = useState<string | "">("");
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          `${API_URL}/genre/movie/list?api_key=${API_KEY}&language=pl-PL`
        );
        if (!response.ok) throw new Error("Nie udało się pobrać gatunków.");
        const data = await response.json();
        setGenres(data.genres);
      } catch {
        setError("Nie udało się pobrać gatunków.");
      }
    };

    fetchGenres();
  }, []);

  const fetchMovies = async (pageNum: number, sort: string, genre: string) => {
    setLoading(true);
    try {
      const genreFilter = genre ? `&with_genres=${genre}` : "";
      const response = await fetch(
        `${API_URL}/discover/movie?api_key=${API_KEY}&language=pl-PL&sort_by=${sort}&page=${pageNum}${genreFilter}`
      );

      const data = await response.json();
      if (data.results.length > 0) {
        setMovies((prevMovies) => {
          const newMovies = data.results.filter(
            (newMovie: { id: string }) =>
              !prevMovies.some((movie) => movie.id === newMovie.id)
          );
          return pageNum === 1 ? newMovies : [...prevMovies, ...newMovies];
        });
      } else {
        setHasMore(false);
      }
      setError(null);
    } catch {
      setError("Nie udało się pobrać danych.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(1, sortBy, genreId);
  }, [sortBy, genreId]);

  const loadMoreMovies = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
      fetchMovies(page + 1, sortBy, genreId);
    }
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as string);
    setPage(1);
    setMovies([]);
    setError(null);
  };

  const handleGenreChange = (event: SelectChangeEvent) => {
    setGenreId(event.target.value);
    setPage(1);
    setMovies([]);
    setError(null);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Container>
          {error ? (
            <Box
              sx={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="h4" color="error">
                {error}
              </Typography>
            </Box>
          ) : (
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    movies={movies}
                    loading={loading}
                    loadMore={loadMoreMovies}
                    hasMore={hasMore}
                    sortBy={sortBy}
                    handleSortChange={handleSortChange}
                    genres={genres}
                    genreId={genreId}
                    handleGenreChange={handleGenreChange}
                  />
                }
              />
              <Route path="/movie/:id" element={<MovieInfo />} />
              <Route path="/*" element={<ErrorPage />} />
            </Routes>
          )}
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
