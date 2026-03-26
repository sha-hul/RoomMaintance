import React from "react";
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";

import BusinessIcon from "@mui/icons-material/Business";
import ApartmentIcon from "@mui/icons-material/Apartment";
import CategoryIcon from "@mui/icons-material/Category";
import LayersIcon from "@mui/icons-material/Layers";
import LocationOnIcon from "@mui/icons-material/LocationOn";


import MasterCard from "./MasterCard";
import { useNavigate } from "react-router-dom";

// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

const MasterModal = () => {
  const navigate = useNavigate();

  return (
    // <Dialog
    //   open={true}
    //   TransitionComponent={Transition}
    //   fullScreen
    //   PaperProps={{
    //     sx: {
    //       mt: "64px", // keeps your header visible
    //       height: "calc(100vh - 64px)", // dialog fills remaining space
    //       borderRadius: 0,
    //       overflow: "hidden"
    //     }
    //   }}
    // >
    //   <AppBar sx={{ position: "static" }}>
    //     <Toolbar>
    //       {/* CLOSE BUTTON */}
    //       <IconButton edge="start" color="inherit" onClick={() => navigate("/admindashboard")}>
    //         <CloseIcon />
    //       </IconButton>

    //       <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
    //         Masters
    //       </Typography>
    //     </Toolbar>
    //   </AppBar>

    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: 3,
        mt: 5
      }}
    >
      <MasterCard
        icon={<BusinessIcon sx={{ fontSize: 50, color: "#1976d2" }} />}
        label="Facility Master"
        color="#e3f2fd"
        onClick={() => navigate("/facilitymaster")}
      />

      <MasterCard
        icon={<LocationOnIcon sx={{ fontSize: 50, color: "#d81b60" }} />}
        label="Location Master"
        color="#fce4ec"
        onClick={() => navigate("/locationmaster")}
      />

      <MasterCard
        icon={<ApartmentIcon sx={{ fontSize: 50, color: "#ef6c00" }} />}
        label="Apartment Master"
        color="#fff3e0"
        onClick={() => navigate("/apartmentmaster")}
      />

      <MasterCard
        icon={<CategoryIcon sx={{ fontSize: 50, color: "#2e7d32" }} />}
        label="Category Master"
        color="#e8f5e9"
        onClick={() => navigate("/categorymaster")}
      />

      <MasterCard
        icon={<LayersIcon sx={{ fontSize: 50, color: "#8e24aa" }} />}
        label="Sub Category Master"
        color="#f3e5f5"
        onClick={() => navigate("/subcategorymaster")}
      />


    </Box>

    // </Dialog>
  );
};

export default MasterModal;