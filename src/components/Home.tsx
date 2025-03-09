import React, { useRef, useCallback, Suspense } from "react";
import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

const MovieCard = React.lazy(() => import("./MovieCard"));
const MovieCardPlaceholder = React.lazy(() => import("./MovieCardPlaceholder"));

export type Movie = {
  id: string;
  title?: string;
  name?: string;
  poster_path?: string;
  profile_path?: string;
  first_air_date?: string;
  release_date?: string;
  genre_ids: number[];
  vote_average: number;
};

type HomeProps = {
  movies: Movie[];
  loading: boolean;
  loadMore: () => void;
  hasMore: boolean;
  sortBy: string;
  handleSortChange: (event: SelectChangeEvent) => void;
  genres: { id: number; name: string }[];
  genreId: string;
  handleGenreChange: (event: SelectChangeEvent) => void;
};

const Home = ({
  movies,
  loading,
  loadMore,
  hasMore,
  sortBy,
  handleSortChange,
  genres,
  genreId,
  handleGenreChange,
}: HomeProps) => {
  const observer = useRef<IntersectionObserver | null>(null);

  const lastMovieRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMore]
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "center",
          mb: 3,
        }}
      >
        <FormControl
          sx={{
            flex: "1 1 220px",
            minWidth: 200,
          }}
        >
          <InputLabel>Sortuj według</InputLabel>
          <Select value={sortBy} onChange={handleSortChange}>
            <MenuItem value="popularity.desc">Popularność</MenuItem>
            <MenuItem value="vote_average.desc">Ocena</MenuItem>
            <MenuItem value="release_date.desc">Data premiery</MenuItem>
            <MenuItem value="original_title.asc">Tytuł (A-Z)</MenuItem>
          </Select>
        </FormControl>
        <FormControl
          sx={{
            flex: "1 1 220px",
            minWidth: 200,
          }}
        >
          <InputLabel>Gatunek</InputLabel>
          <Select value={genreId} onChange={handleGenreChange}>
            <MenuItem value="">Wszystkie</MenuItem>
            {genres.map((genre) => (
              <MenuItem key={genre.id} value={genre.id.toString()}>
                {genre.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 4,
          py: 6,
        }}
      >
        {loading
          ? [...Array(8)].map((_, index) => (
              <Box key={`loading-${index}`}>
                <Suspense fallback={<MovieCardPlaceholder />}>
                  <MovieCardPlaceholder />
                </Suspense>
              </Box>
            ))
          : movies.map((movie, index) => (
              <Box
                key={movie.id || `placeholder-${index}`}
                ref={index === movies.length - 1 ? lastMovieRef : null}
              >
                <Suspense fallback={<MovieCardPlaceholder />}>
                  <MovieCard
                    id={movie.id}
                    title={movie.title || movie.name || "Movie Title"}
                    image={
                      movie.poster_path || movie.profile_path
                        ? `https://image.tmdb.org/t/p/w500${
                            movie.poster_path || movie.profile_path
                          }`
                        : ""
                    }
                    date={movie.first_air_date || movie.release_date || ""}
                    type={movie.genre_ids.join(", ")}
                    rate={movie.vote_average.toString()}
                  />
                </Suspense>
              </Box>
            ))}
      </Box>
    </Container>
  );
};

export default Home;
