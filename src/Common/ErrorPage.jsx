import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import RefreshIcon from "@mui/icons-material/Refresh";
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";

const ErrorPage = () => {
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
          bgcolor: "#fdecea",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 48, color: "#c62828" }} />
      </Box>

      {/* 500 */}
      <Typography
        sx={{ fontSize: 80, fontWeight: 700, color: "#c62828", lineHeight: 1 }}
      >
        500
      </Typography>

      {/* Title */}
      <Typography
        variant="h5"
        sx={{ fontWeight: 600, color: "#1e3a5f", mt: 1, mb: 1 }}
      >
        Something Went Wrong
      </Typography>

      {/* Subtitle */}
      <Typography
        sx={{ color: "text.secondary", fontSize: 15, maxWidth: 400, mb: 4 }}
      >
        An unexpected error occurred on our end. Please return to the dashboard and try again.
      </Typography>

      {/* Buttons */}
      <Box sx={{ display: "flex", gap: 2 }}>
        {/* <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => window.location.reload()}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            px: 3,
            py: 1.2,
            fontSize: 14,
            color: "#1e3a5f",
            borderColor: "#1e3a5f",
            "&:hover": { bgcolor: "#e3eaf4", borderColor: "#1e3a5f" },
          }}
        >
          Refresh Page
        </Button> */}

        <Button
          variant="contained"
          startIcon={<HomeRepairServiceIcon />}
          onClick={() => navigate("/admindashboard")}
          sx={{
            bgcolor: "#1e3a5f",
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            px: 3,
            py: 1.2,
            fontSize: 14,
            "&:hover": { bgcolor: "#16304f" },
          }}
        >
          Back to Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default ErrorPage;