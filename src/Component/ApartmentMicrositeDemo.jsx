import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Chip,
  Button,
  Modal,
  TextField,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Snackbar,
  Alert,
  IconButton,
  Divider,
  LinearProgress,
  Avatar,
  Tooltip,
  useMediaQuery,
  useTheme,
  Fade,
  Slide,
} from "@mui/material";
import {
  Email,
  PauseCircle,
  Cancel,
  LightMode,
  DarkMode,
  Business,
  LocationOn,
  Apartment,
  ConfirmationNumber,
  MeetingRoom,
  Spa,
  FitnessCenter,
  Pool,
  LocalParking,
  Wifi,
  AcUnit,
  Close,
  CheckCircle,
  Schedule,
  HourglassEmpty,
  Send,
  ArrowForward,
  KeyboardArrowDown,
  Star,
  Shield,
  NotificationsActive,
  Person,
  CalendarMonth,
  ErrorOutline,
} from "@mui/icons-material";
import RaiseRequestModal from "./RaiseRequestModal";
import StatusModal from "./StatusModal";
import {
  decryptParams,
  getApartmentDetails,
} from "../Service/apartmentmicrosite";
import CircularProgress from "@mui/material/CircularProgress";
import { DARK, LIGHT } from "../Common/palette";

/* ─── palette ─────────────────────────────────────────────── */
const Pl = {
  //changed from P to Pl
  bg: "#060D1A",
  surface: "#0C1829",
  card: "#111F33",
  border: "#1E3250",
  teal: "#0EA5E9",
  tealDim: "#0369A1",
  cyan: "#22D3EE",
  gold: "#F59E0B",
  goldDim: "#B45309",
  green: "#10B981",
  red: "#F43F5E",
  muted: "#64748B",
  text: "#E2EAF4",
  sub: "#94A3B8",
};

const statusColor = (s) => {
  switch (s) {
    case "Pending":
      return Pl.gold;
    case "InProgress":
      return Pl.teal;
    case "OnHold":
      return Pl.cyan;
    case "Rejected":
      return "#ef4444";
    case "Closed":
      return Pl.green;
    default:
      return Pl.muted;
  }
};

const statusIcon = (s) => {
  switch (s) {
    case "Pending":
      return <Schedule sx={{ fontSize: 14 }} />;
    case "InProgress":
      return <HourglassEmpty sx={{ fontSize: 14 }} />;
    case "OnHold":
      return <PauseCircle sx={{ fontSize: 14 }} />;
    case "Rejected":
      return <Cancel sx={{ fontSize: 14 }} />;
    case "Closed":
      return <CheckCircle sx={{ fontSize: 14 }} />;
    default:
      return <Schedule sx={{ fontSize: 14 }} />;
  }
};

/* ─── keyframe injection ───────────────────────────────────── */
const injectStyles = () => {
  if (document.getElementById("apt-styles")) return;
  const s = document.createElement("style");
  s.id = "apt-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
    @keyframes pulse-ring { 0%{transform:scale(1);opacity:.6} 70%{transform:scale(1.35);opacity:0} 100%{transform:scale(1.35);opacity:0} }
    @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
    @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
    @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    .fade-up { animation: fadeUp 0.55s ease both; }
    .delay-1 { animation-delay: 0.1s; }
    .delay-2 { animation-delay: 0.2s; }
    .delay-3 { animation-delay: 0.3s; }
    .delay-4 { animation-delay: 0.4s; }
    .delay-5 { animation-delay: 0.5s; }
    .float-icon { animation: float 3s ease-in-out infinite; }
  `;
  document.head.appendChild(s);
};

function GradientCircularProgress() {
  return (
    <>
      <svg width={0} height={0}>
        <defs>
          <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e01cd5" />
            <stop offset="100%" stopColor="#1CB5E0" />
          </linearGradient>
        </defs>
      </svg>

      <CircularProgress
        sx={{ "svg circle": { stroke: "url(#my_gradient)" } }}
      />
    </>
  );
}

const StatusRow = React.memo(({ r, expanded, onToggle }) => {
  return (
    <Box
      sx={{
        borderRadius: "12px",
        overflow: "hidden",
        border: `1px solid ${
          expanded ? statusColor(r.status) + "66" : Pl.border
        }`,
        transition: "border-color .2s",
      }}
    >
      <Box
        onClick={() => onToggle(r.id)}
        sx={{
          p: "12px 16px",
          cursor: "pointer",
          background: expanded
            ? `${statusColor(r.status)}10`
            : `${Pl.surface}88`,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          "&:hover": { background: `${statusColor(r.status)}08` },
          transition: "background .2s",
        }}
      >
        {/* Icon */}
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "8px",
            flexShrink: 0,
            background: `${statusColor(r.status)}18`,
            border: `1px solid ${statusColor(r.status)}44`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: statusColor(r.status),
          }}
        >
          {statusIcon(r.status)}
        </Box>

        {/* Text */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: "0.85rem",
              fontWeight: 700,
              color: Pl.text,
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            {r.type}
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mt: 0.3 }}>
            <Typography sx={{ fontSize: "0.65rem", color: Pl.muted }}>
              {r.id}
            </Typography>
            <Typography sx={{ fontSize: "0.65rem", color: Pl.muted }}>
              <CalendarMonth sx={{ fontSize: 10, mr: 0.3 }} />
              {r.date}
            </Typography>
          </Box>
        </Box>

        {/* Status + Arrow */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip
            label={r.status}
            size="small"
            sx={{
              bgcolor: `${statusColor(r.status)}18`,
              color: statusColor(r.status),
              border: `1px solid ${statusColor(r.status)}44`,
              fontSize: "0.65rem",
              height: 22,
              fontFamily: "'DM Sans',sans-serif",
            }}
          />

          <KeyboardArrowDown
            sx={{
              fontSize: 18,
              color: Pl.muted,
              transform: expanded ? "rotate(180deg)" : "none",
              transition: "transform .2s",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
});

/* ═══════════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                             */
/* ═══════════════════════════════════════════════════════════ */
export default function ApartmentMicrosite() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTab = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const location = useLocation();
  const [data, setData] = useState(null);
  const [statusOpen, setStatusOpen] = useState(false);
  const [reqType, setReqType] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [submitted, setSubmitted] = useState(false);
  const [snack, setSnack] = useState(false);
  const [expanded, setExpanded] = useState(null);
  //Theme
  const [isDark, setIsDark] = useState(true);
  const P = isDark ? DARK : LIGHT;

  //Raise Request
  const [raiseOpen, setRaiseOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  //GetSite Data #Shahul
  const [apt, setApt] = useState({
    facility: "",
    location: "",
    apartment: "",
    subscriptionId: "",
    roomCount: 0,
    isActive: false,
    amenities: [],
  });

  // Get Status Details #Shahul
  const [statuses, setStatuses] = useState([]);

  //pop up
const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "error" });
  // Amenity icon mapper
  const getAmenityIcon = (name) => {
    const map = {
      Gym: <FitnessCenter sx={{ fontSize: 15 }} />,
      Pool: <Pool sx={{ fontSize: 15 }} />,
      Spa: <Spa sx={{ fontSize: 15 }} />,
      Parking: <LocalParking sx={{ fontSize: 15 }} />,
      "Wi-Fi": <Wifi sx={{ fontSize: 15 }} />,
      AC: <AcUnit sx={{ fontSize: 15 }} />,
    };
    return map[name] || null;
  };

  useEffect(() => {
    // const fetchInitialData = async () => {
    const fetchInitialData = () => {
      try {
        injectStyles();
        // const resCat = await getCategories(); #Shahul
        // setCategories(resCat.data);
        setCategories([
          { id: 1, name: "Electrical" },
          { id: 2, name: "Plumbing" },
          { id: 3, name: "Carpendry" },
        ]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchInitialData();
  }, []);

  // Run when URL params change
  useEffect(() => {
    debugger;
    const fetchInitialDataByURL = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const facid = queryParams.get("facid");
        const locid = queryParams.get("locid");
        const apartid = queryParams.get("apartid"); //#Shahul Need to change in Apartment Master

        // if (!facid || !locid || !apartid) return; #Shahul

        // const decrypted = await decryptParams(facid, locid, apartid);#Shahul
        // setData(decrypted);

        // Fetch apartment details by decrypted params //#Shahul
        // const res = await getApartmentDetails(decrypted.facilityId, decrypted.locationId, decrypted.apartment);
        // const data = res.data;
        // setApt({
        //   facility:       data.facilityName,
        //   location:       data.locationName,
        //   apartment:      data.apartment,
        //   subscriptionId: data.subscriptionId,
        //   roomCount:      data.roomCount,
        //   isActive:       data.isActive ?? true,
        //   amenities:      (data.amenities || []).map((name) => ({
        //     label: name,
        //     icon:  getAmenityIcon(name),
        //   })),
        // });

        setApt({
          facility: "Dammam",
          location: "Mukthi Villa",
          apartment: "12",
          subscriptionId: "1001234567",
          roomCount: 2,
          amenities: [
            { label: "Gym", icon: <FitnessCenter sx={{ fontSize: 15 }} /> },
            { label: "Pool", icon: <Pool sx={{ fontSize: 15 }} /> },
            // { label: "Spa",       icon: <Spa sx={{ fontSize: 15 }} /> },
            // { label: "Parking",   icon: <LocalParking sx={{ fontSize: 15 }} /> },
            // { label: "Wi-Fi",     icon: <Wifi sx={{ fontSize: 15 }} /> },
            // { label: "AC",        icon: <AcUnit sx={{ fontSize: 15 }} /> },
          ],
        });

        // Fetch apartment request details
        // const resReq = await getApartmentRequestDetails(decrypted.facilityId, decrypted.locationId, decrypted.apartment);
        // setStatuses(resReq.data); #Shahul
        setStatuses([
          {
            id: "REQ-0041",
            category: "Plumbing",
            subCategory: "Broken Pipe",
            date: "12 Mar 2026",
            status: "InProgress",
            step: 2,
            description: "Water leaking from the kitchen sink pipe.",
            adminRemarks: "Plumber assigned, will visit on 28th March.",
          },
          {
            id: "REQ-0038",
            category: "Electrical",
            subCategory: "Light Fitting",
            date: "05 Mar 2026",
            status: "Closed",
            description: "Bedroom light switch not working.",
            adminRemarks: "Issue fixed closing the request",
            step: 3,
          },
          {
            id: "REQ-0029",
            category: "Electrical",
            subCategory: "Power Outage",
            type: "Internet / TV Issue",
            date: "18 Feb 2026",
            status: "Pending",
            description: "TV not working.",
            adminRemarks: "",
            step: 1,
          },
        ]);
      } catch (error) {
        console.error("Error decrypting params:", error);
      }
    };

    fetchInitialDataByURL();
  }, [location.search]);

  /* shared modal box */
  const ModalWrap = ({ children, open, onClose, wide }) => (
    <Modal
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: {
          sx: { backdropFilter: "blur(8px)", bgcolor: "rgba(0,0,0,0.7)" },
        },
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: { xs: "93vw", sm: wide ? 680 : 480 },
            maxHeight: "92vh",
            overflowY: "auto",
            bgcolor: P.card,
            borderRadius: "12px",
            border: `1px solid ${P.border}`,
            boxShadow: `0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px ${P.teal}22`,
            outline: "none",
          }}
        >
          {children}
        </Box>
      </Fade>
    </Modal>
  );

  /* ── DETAIL ROW ── */
  const DetailRow = ({ icon, label, value, delay = "0" }) => (
    <Box
      className={`fade-up delay-${delay}`}
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
        p: "14px 20px",
        borderRadius: "8px",
        background: `linear-gradient(135deg, ${P.surface}99, ${P.card}99)`,
        border: `1px solid ${P.border}66`,
        transition: "border-color .2s, transform .2s",
        "&:hover": { borderColor: `${P.teal}66`, transform: "translateX(4px)" },
      }}
    >
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: "8px",
          flexShrink: 0,
          background: `linear-gradient(135deg, ${P.teal}22, ${P.cyan}11)`,
          border: `1px solid ${P.teal}33`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: P.teal,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography
          sx={{
            fontSize: "0.62rem",
            letterSpacing: "0.14em",
            color: P.muted,
            textTransform: "uppercase",
            fontFamily: "'DM Sans',sans-serif",
            fontWeight: 600,
            mb: 0.3,
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            fontSize: "0.95rem",
            color: P.text,
            fontFamily: "'Syne',sans-serif",
            fontWeight: 600,
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );

  // if (!data) #Shahul need to uncomment after the URLParam is fixed
  //   return (
  //     <Box
  //       sx={{
  //         height: "100vh",
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         backgroundColor: "#f9f9f9",
  //       }}
  //     >
  //       <GradientCircularProgress />
  //     </Box>
  //   ); // loading state

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: P.bg,
        fontFamily: "'DM Sans',sans-serif",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* ── BG mesh ── */}
      <Box
        sx={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -180,
            left: -180,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${P.teal}18 0%, transparent 70%)`,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -200,
            right: -100,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${P.gold}10 0%, transparent 70%)`,
          }}
        />
        {/* grid lines */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            backgroundImage: `linear-gradient(${P.teal} 1px, transparent 1px), linear-gradient(90deg, ${P.teal} 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </Box>

      {/* ── HERO BANNER ── */}
      <Box
        sx={{
          position: "relative",
          zIndex: 5,
          px: { xs: 2.5, sm: 4, md: 6 },
          pt: { xs: 4, sm: 5 },
          pb: 0,
        }}
      >
        <Box
          className="fade-up"
          sx={{
            borderRadius: "16px",
            background: `linear-gradient(135deg, ${P.tealDim}44 0%, ${P.surface} 60%, ${P.goldDim}22 100%)`,
            border: `1px solid ${P.teal}33`,
            p: { xs: 2.5, sm: 3.5 },
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* decorative circle */}
          <Box
            sx={{
              position: "absolute",
              right: -60,
              top: -60,
              width: 200,
              height: 200,
              borderRadius: "50%",
              border: `1px solid ${P.teal}22`,
              display: { xs: "none", sm: "block" },
            }}
          />
          <Box
            sx={{
              position: "absolute",
              right: -20,
              top: -20,
              width: 120,
              height: 120,
              borderRadius: "50%",
              border: `1px solid ${P.teal}18`,
              display: { xs: "none", sm: "block" },
            }}
          />

          <Box
            className="float-icon"
            sx={{
              width: { xs: 52, sm: 64 },
              height: { xs: 52, sm: 64 },
              borderRadius: "14px",
              flexShrink: 0,
              background: `linear-gradient(135deg, ${P.teal}, ${P.cyan})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 8px 32px ${P.teal}44`,
            }}
          >
            <Apartment sx={{ fontSize: { xs: 28, sm: 34 }, color: P.bg }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontFamily: "'Syne',sans-serif",
                fontWeight: 800,
                fontSize: { xs: "1.3rem", sm: "1.7rem", md: "2rem" },
                color: P.text,
                lineHeight: 1.1,
              }}
            >
              Your Apartment
            </Typography>
          </Box>
          <IconButton
            onClick={() => setIsDark((prev) => !prev)}
            sx={{
              color: P.muted,
              border: `1px solid ${P.border}`,
              borderRadius: "8px",
              p: 0.8,
              "&:hover": { color: P.text, borderColor: P.teal },
            }}
          >
            {isDark ? (
              <LightMode sx={{ fontSize: 18 }} />
            ) : (
              <DarkMode sx={{ fontSize: 18 }} />
            )}
          </IconButton>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ position: "relative" }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  bgcolor: apt.isActive ? P.green : "#ef4444",
                  "&::before": apt.isActive
                    ? {
                        content: '""',
                        position: "absolute",
                        inset: -3,
                        borderRadius: "50%",
                        border: `2px solid ${P.green}`,
                        animation: "pulse-ring 1.8s ease-out infinite",
                      }
                    : {}, // no animation when inactive
                }}
              />
            </Box>
            <Typography
              sx={{
                fontSize: "0.75rem",
                color: apt.isActive ? P.green : "#ef4444",
                fontFamily: "'DM Sans',sans-serif",
                fontWeight: 600,
              }}
            >
              {apt.isActive ? "Active" : "Inactive"}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ── MAIN CONTENT ── */}
      <Box
        sx={{
          position: "relative",
          zIndex: 5,
          px: { xs: 2.5, sm: 4, md: 6 },
          py: 3,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 360px" },
          gap: 3,
        }}
      >
        {/* ── LEFT CARD: apartment details ── */}
        <Box
          sx={{
            bgcolor: P.card,
            borderRadius: "14px",
            border: `1px solid ${P.border}`,
            overflow: "hidden",
          }}
        >
          {/* card header */}
          <Box
            sx={{
              px: 3,
              py: 2,
              borderBottom: `1px solid ${P.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: `linear-gradient(90deg, ${P.surface}, ${P.card})`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 3,
                  height: 20,
                  borderRadius: 4,
                  background: `linear-gradient(${P.teal}, ${P.cyan})`,
                }}
              />
              <Typography
                sx={{
                  fontFamily: "'Syne',sans-serif",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: P.text,
                }}
              >
                Apartment Details
              </Typography>
            </Box>
            <Chip
              label="Verified by Mouwasat"
              size="small"
              icon={
                <Star
                  sx={{
                    fontSize: "12px !important",
                    color: `${P.gold} !important`,
                  }}
                />
              }
              sx={{
                bgcolor: `${P.gold}18`,
                color: P.gold,
                border: `1px solid ${P.gold}44`,
                fontSize: "0.65rem",
                fontFamily: "'DM Sans',sans-serif",
                height: 22,
              }}
            />
          </Box>

          {/* rows */}
          <Box
            sx={{
              p: { xs: 2, sm: 3 },
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            <DetailRow
              icon={<Business sx={{ fontSize: 18 }} />}
              label="Facility"
              value={apt.facility}
              delay="1"
            />
            <DetailRow
              icon={<LocationOn sx={{ fontSize: 18 }} />}
              label="Location"
              value={apt.location}
              delay="2"
            />
            <DetailRow
              icon={<Apartment sx={{ fontSize: 18 }} />}
              label="Apartment"
              value={apt.apartment}
              delay="3"
            />
            <DetailRow
              icon={<ConfirmationNumber sx={{ fontSize: 18 }} />}
              label="ESubscription ID"
              value={apt.subscriptionId}
              delay="4"
            />
            <DetailRow
              icon={<MeetingRoom sx={{ fontSize: 18 }} />}
              label="Room Count"
              value={`${apt.roomCount} BHK`}
              delay="5"
            />

            {/* amenities */}
            <Box
              className="fade-up delay-5"
              sx={{
                p: "14px 20px",
                borderRadius: "8px",
                background: `linear-gradient(135deg, ${P.surface}99, ${P.card}99)`,
                border: `1px solid ${P.border}66`,
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1.5 }}
              >
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: "8px",
                    flexShrink: 0,
                    background: `linear-gradient(135deg, ${P.gold}22, ${P.gold}11)`,
                    border: `1px solid ${P.gold}33`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: P.gold,
                  }}
                >
                  <Spa sx={{ fontSize: 18 }} />
                </Box>
                <Typography
                  sx={{
                    fontSize: "0.62rem",
                    letterSpacing: "0.14em",
                    color: P.muted,
                    textTransform: "uppercase",
                    fontFamily: "'DM Sans',sans-serif",
                    fontWeight: 600,
                  }}
                >
                  Amenities
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", flexWrap: "wrap", gap: 1, pl: "54px" }}
              >
                {apt.amenities.map(({ label, icon }) => (
                  <Chip
                    key={label}
                    label={label}
                    icon={
                      <Box
                        sx={{ color: `${P.teal} !important`, display: "flex" }}
                      >
                        {icon}
                      </Box>
                    }
                    size="small"
                    sx={{
                      bgcolor: `${P.teal}14`,
                      color: P.text,
                      border: `1px solid ${P.teal}33`,
                      borderRadius: "6px",
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      height: 28,
                      "& .MuiChip-icon": { ml: "8px" },
                      "&:hover": {
                        bgcolor: `${P.teal}25`,
                        borderColor: P.teal,
                      },
                      transition: "all .2s",
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>

          {/* ── action buttons ── */}
          <Box
            sx={{
              px: { xs: 2, sm: 3 },
              pb: 3,
              pt: 1,
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Button
              fullWidth
              onClick={() => setRaiseOpen(true)}
              startIcon={<NotificationsActive />}
              sx={{
                background: `linear-gradient(135deg, ${P.teal}, ${P.cyan})`,
                color: P.bg,
                fontFamily: "'Syne',sans-serif",
                fontWeight: 700,
                fontSize: "0.88rem",
                textTransform: "none",
                borderRadius: "10px",
                py: 1.5,
                letterSpacing: "0.02em",
                boxShadow: `0 8px 28px ${P.teal}44`,
                "&:hover": {
                  boxShadow: `0 12px 36px ${P.teal}66`,
                  transform: "translateY(-2px)",
                },
                transition: "all .25s ease",
              }}
            >
              Raise Request
            </Button>
            
            {/* <Button fullWidth onClick={() => setStatusOpen(true)}
              startIcon={<Schedule />}
              sx={{
                background: "transparent", color: P.teal,
                fontFamily: "'Syne',sans-serif", fontWeight: 700,
                fontSize: "0.88rem", textTransform: "none", borderRadius: "10px",
                py: 1.5, letterSpacing: "0.02em",
                border: `1.5px solid ${P.teal}55`,
                "&:hover": { bgcolor: `${P.teal}14`, borderColor: P.teal, transform: "translateY(-2px)" },
                transition: "all .25s ease",
              }}>
              Status
            </Button> */}
          </Box>
        </Box>

        {/* ── RIGHT SIDEBAR ── */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* quick stats */}
          <Box
            sx={{
              bgcolor: P.card,
              borderRadius: "14px",
              border: `1px solid ${P.border}`,
              p: 3,
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Syne',sans-serif",
                fontWeight: 700,
                fontSize: "0.9rem",
                color: P.text,
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: 3,
                  height: 16,
                  borderRadius: 4,
                  background: `linear-gradient(${P.gold}, ${P.gold}88)`,
                }}
              />
              My Requests
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 1.5,
                mb: 2,
              }}
            >
              {[
                { label: "Total", val: 3, color: P.teal }, //#Shahul Need to pass the Dynamic value
                { label: "Active", val: 2, color: P.gold }, //#Shahul Need to pass the Dynamic value
                { label: "Closed", val: 1, color: P.green }, //#Shahul Need to pass the Dynamic value
              ].map(({ label, val, color }) => (
                <Box
                  key={label}
                  sx={{
                    p: 1.5,
                    borderRadius: "10px",
                    textAlign: "center",
                    background: `${color}14`,
                    border: `1px solid ${color}33`,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "'Syne',sans-serif",
                      fontWeight: 800,
                      fontSize: "1.5rem",
                      color,
                      lineHeight: 1,
                    }}
                  >
                    {val}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.65rem",
                      color: P.muted,
                      mt: 0.3,
                      fontFamily: "'DM Sans',sans-serif",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {label}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Button
              fullWidth
              onClick={() => setStatusOpen(true)}
              endIcon={<ArrowForward sx={{ fontSize: 14 }} />}
              sx={{
                color: P.teal,
                fontFamily: "'DM Sans',sans-serif",
                textTransform: "none",
                fontSize: "0.78rem",
                fontWeight: 600,
                borderRadius: "8px",
                border: `1px solid ${P.teal}33`,
                py: 0.8,
                "&:hover": { bgcolor: `${P.teal}10` },
              }}
            >
              View All Requests
            </Button>
          </Box>

          {/* latest activity */}
          <Box
            sx={{
              bgcolor: P.card,
              borderRadius: "14px",
              border: `1px solid ${P.border}`,
              p: 3,
              flex: 1,
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Syne',sans-serif",
                fontWeight: 700,
                fontSize: "0.9rem",
                color: P.text,
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: 3,
                  height: 16,
                  borderRadius: 4,
                  background: `linear-gradient(${P.cyan}, ${P.teal}88)`,
                }}
              />
              Latest Activity
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {statuses.slice(0, 2).map((r) => (
                <Box
                  key={r.id}
                  sx={{
                    p: 1.5,
                    borderRadius: "10px",
                    background: `${P.surface}88`,
                    border: `1px solid ${P.border}66`,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    "&:hover": { borderColor: `${statusColor(r.status)}44` },
                    transition: "border-color .2s",
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "8px",
                      flexShrink: 0,
                      background: `${statusColor(r.status)}18`,
                      border: `1px solid ${statusColor(r.status)}33`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: statusColor(r.status),
                    }}
                  >
                    {statusIcon(r.status)}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: "0.78rem",
                        color: P.text,
                        fontWeight: 600,
                        fontFamily: "'DM Sans',sans-serif",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {`${r.category} - ${r.subCategory}`}
                    </Typography>
                    <Typography sx={{ fontSize: "0.65rem", color: P.muted }}>
                      {r.date}
                    </Typography>
                  </Box>
                  <Chip
                    label={r.status}
                    size="small"
                    sx={{
                      bgcolor: `${statusColor(r.status)}18`,
                      color: statusColor(r.status),
                      border: `1px solid ${statusColor(r.status)}44`,
                      fontSize: "0.6rem",
                      height: 20,
                      fontFamily: "'DM Sans',sans-serif",
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>

          {/* help card */}
          <Box
            sx={{
              borderRadius: "14px",
              p: 2.5,
              position: "relative",
              overflow: "hidden",
              background: `linear-gradient(135deg, ${P.tealDim}55, ${P.surface})`,
              border: `1px solid ${P.teal}33`,
            }}
          >
            {/* Decorative circle */}
            <Box
              sx={{
                position: "absolute",
                right: -20,
                bottom: -20,
                width: 100,
                height: 100,
                borderRadius: "50%",
                border: `1px solid ${P.teal}22`,
              }}
            />

            <Typography
              sx={{
                fontFamily: "'Syne',sans-serif",
                fontWeight: 700,
                fontSize: "0.9rem",
                color: P.text,
                mb: 0.5,
              }}
            >
              Need Help?
            </Typography>

            <Typography
              sx={{
                fontSize: "0.75rem",
                color: P.sub,
                mb: 1.5,
                fontFamily: "'DM Sans',sans-serif",
                lineHeight: 1.5,
              }}
            >
              Support Service Desk for urgent issues.
            </Typography>

            {/* Phone */}
            <Typography
              sx={{
                fontSize: "0.78rem",
                color: P.teal,
                fontWeight: 600,
                fontFamily: "'DM Sans',sans-serif",
                mb: 1,
              }}
            >
              📞 +966 50505050
            </Typography>

            {/* Divider */}
            <Box sx={{ borderTop: `1px solid ${P.teal}22`, my: 1.5 }} />

            {/* Issue note */}
            <Typography
              sx={{
                fontSize: "0.72rem",
                color: P.muted,
                fontFamily: "'DM Sans',sans-serif",
                lineHeight: 1.6,
                mb: 1,
              }}
            >
              Issue while raising the Maintenance Request?
            </Typography>

            {/* Mail link */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
              <Email sx={{ fontSize: 14, color: P.teal }} />
              <Typography
                component="a"
                href="mailto:ITService.mouwasat.com"
                sx={{
                  fontSize: "0.75rem",
                  color: P.teal,
                  fontWeight: 600,
                  fontFamily: "'DM Sans',sans-serif",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                ITService.mouwasat.com
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── footer ── */}
      <Box
        sx={{
          position: "relative",
          zIndex: 5,
          mt: 2,
          borderTop: `1px solid ${P.border}44`,
          px: { xs: 2.5, sm: 4, md: 6 },
          py: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: "0.7rem",
            color: P.muted,
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          © 2026 Room Maintenance. All rights reserved.
        </Typography>
      </Box>

      {/* ══════════════════════════════════════════ */}
      {/*  RAISE REQUEST MODAL                       */}
      {/* ══════════════════════════════════════════ */}
<RaiseRequestModal
              open={raiseOpen}
              onClose={() => setRaiseOpen(false)}
              categories={categories}
              apt={apt}
              P={P}
              ModalWrap={ModalWrap}
              setSnackbar={setSnackbar}
            />
      {/* ══════════════════════════════════════════ */}
      {/*  STATUS MODAL                              */}
      {/* ══════════════════════════════════════════ */}
      <StatusModal
        open={statusOpen}
        onClose={() => setStatusOpen(false)}
        requests={statuses}
        statusColor={statusColor}
        statusIcon={statusIcon}
        ModalWrap={ModalWrap}
        P={P}
      />
      {/* ── snack ── */}
      <Snackbar
        open={snack}
        autoHideDuration={4000}
        onClose={() => setSnack(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          onClose={() => setSnack(false)}
          sx={{
            bgcolor: `${P.green}22`,
            color: P.text,
            border: `1px solid ${P.green}44`,
            fontFamily: "'DM Sans',sans-serif",
            "& .MuiAlert-icon": { color: P.green },
          }}
        >
          Request submitted successfully! We'll be in touch soon.
        </Alert>
      </Snackbar>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: "0.85rem",
            bgcolor:
              snackbar.severity === "success" ? `${P.green}18` : "#ef444418",
            color: snackbar.severity === "success" ? P.green : "#ef4444",
            border: `1px solid ${snackbar.severity === "success" ? P.green : "#ef4444"}44`,
            "& .MuiAlert-icon": {
              color: snackbar.severity === "success" ? P.green : "#ef4444",
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
