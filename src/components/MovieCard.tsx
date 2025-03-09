import {
  Paper,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Rating,
} from "@mui/material";
import { Link } from "react-router-dom";

type MovieCardProps = {
  id: number | string;
  title: string;
  image: string;
  date: string;
  type: string;
  rate: string;
};

const MovieCard = ({ id, title, image, rate }: MovieCardProps) => {
  const placeholderImage = "/movie_plug.jpg";

  return (
    <Paper
      elevation={4}
      sx={{
        maxWidth: 345,
        borderRadius: 2,
        overflow: "hidden",
        textAlign: "center",
        transition: "box-shadow 0.3s ease",
        animation: "fadeInUp 0.6s ease-out",
        "@keyframes fadeInUp": {
          from: { opacity: 0, transform: "translateY(20px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "&:hover": { boxShadow: 6 },
      }}
    >
      <CardActionArea
        component={Link}
        to={`/movie/${id}`}
        sx={{
          position: "relative",
          "&:hover .MuiCardMedia-root": {
            transform: "scale(1.1)",
            transition: "transform 0.3s ease",
          },
          "&:hover .movie-title": {
            color: "primary.main",
            transition: "color 0.3s ease",
          },
        }}
      >
        <CardMedia
          component="img"
          image={image.startsWith("http") ? image : placeholderImage}
          alt={title}
          loading="lazy"
          sx={{
            width: "100%",
            height: "24rem",
            objectFit: "fill",
            transition: "transform 0.3s ease",
          }}
          onError={(e) => (e.currentTarget.src = placeholderImage)}
        />
        <CardContent
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "background.paper",
            color: "text.primary",
            p: "1rem",
            height: "8rem",
          }}
        >
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            className="movie-title"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {title}
          </Typography>
          <Rating value={parseFloat(rate) / 2} precision={0.1} readOnly />
        </CardContent>
      </CardActionArea>
    </Paper>
  );
};

export default MovieCard;
