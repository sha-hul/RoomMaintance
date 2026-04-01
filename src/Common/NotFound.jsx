import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import HandymanIcon from "@mui/icons-material/Handyman";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f7fa",
        textAlign: "center",
        px: 3,
      }}
    >
      {/* Icon */}
      <Box
        sx={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          bgcolor: "#e3eaf4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
        }}
      >
        <HandymanIcon sx={{ fontSize: 48, color: "#1e3a5f" }} />
      </Box>

      {/* 404 */}
      <Typography
        sx={{ fontSize: 80, fontWeight: 700, color: "#1e3a5f", lineHeight: 1 }}
      >
        404
      </Typography>

      {/* Title */}
      <Typography
        variant="h5"
        sx={{ fontWeight: 600, color: "#1e3a5f", mt: 1, mb: 1 }}
      >
        Page Not Found
      </Typography>

      {/* Subtitle */}
      <Typography
        sx={{ color: "text.secondary", fontSize: 15, maxWidth: 400, mb: 4 }}
      >
        Looks like this page is under maintenance or doesn't exist. Let's get
        you back to the dashboard.
      </Typography>

      {/* Button */}
      <Button
        variant="contained"
        startIcon={<HandymanIcon />}
        onClick={() => navigate("/admindashboard")}
        sx={{
          bgcolor: "#1e3a5f",
          textTransform: "none",
          fontWeight: 600,
          borderRadius: "8px",
          px: 4,
          py: 1.2,
          fontSize: 14,
          "&:hover": { bgcolor: "#16304f" },
        }}
      >
        Back to Dashboard
      </Button>
    </Box>
  );
};

export default NotFound;