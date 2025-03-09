import { Skeleton, Card, CardContent } from "@mui/material";

const MovieCardPlaceholder = () => {
  return (
    <Card
      sx={{
        maxWidth: 280,
        borderRadius: 2,
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      <Skeleton
        variant="rectangular"
        sx={{
          width: "100%",
          height: "16rem",
          aspectRatio: "0.8",
        }}
      />
      <CardContent
        sx={{
          height: "8rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Skeleton variant="text" height={30} width="80%" />
        <Skeleton variant="text" height={20} width="50%" />
      </CardContent>
    </Card>
  );
};

export default MovieCardPlaceholder;
