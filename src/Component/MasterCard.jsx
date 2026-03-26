import { Card, CardActionArea, Typography } from "@mui/material";

const MasterCard = ({ icon, label, color, onClick }) => {
  return (
    <Card
      sx={{
        width: { xs: 160, sm: 180, md: 200 },
        height: { xs: 160, sm: 180, md: 200 },
        bgcolor: color,
        borderRadius: 3,
        boxShadow: 2,
        transition: "all 0.25s ease",   // smooth animation
        "&:hover": {
          transform: "translateY(-6px) scale(1.03)",  // lift + slight scale
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",   // soft shadow bloom
        }
      }}
    >
      <CardActionArea
        onClick={onClick}
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 2
        }}
      >
        {icon}
        <Typography sx={{ mt: 1, fontWeight: "bold" }}>
          {label}
        </Typography>
      </CardActionArea>
    </Card>
  );
};

export default MasterCard;