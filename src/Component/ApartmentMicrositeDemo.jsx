import React, { useState, useEffect } from "react";
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

/* ─── palette ─────────────────────────────────────────────── */
const P = {
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

/* ─── mock data ────────────────────────────────────────────── */
const apt = {
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
};

const employee = {
  name: "Rayan Al-Farsi",
  id: "EMP-00487",
  dept: "Engineering",
};

const REQUEST_TYPES = [
  "Maintenance – Plumbing",
  "Maintenance – Electrical",
  "Maintenance – HVAC",
  "Housekeeping",
  "Internet / TV Issue",
  "Furniture / Fixtures",
  "Security Concern",
  "Other",
];

const MOCK_STATUSES = [
  {
    id: "REQ-0041",
    type: "Maintenance – HVAC",
    date: "12 Mar 2026",
    status: "In Progress",
    step: 2,
  },
  {
    id: "REQ-0038",
    type: "Housekeeping",
    date: "05 Mar 2026",
    status: "Resolved",
    step: 3,
  },
  {
    id: "REQ-0029",
    type: "Internet / TV Issue",
    date: "18 Feb 2026",
    status: "Pending",
    step: 1,
  },
];

const STEPS = ["Submitted", "Under Review", "In Progress", "Resolved"];

const statusColor = (s) =>
  s === "Resolved"
    ? P.green
    : s === "In Progress"
      ? P.teal
      : s === "Pending"
        ? P.gold
        : P.muted;

const statusIcon = (s) =>
  s === "Resolved" ? (
    <CheckCircle sx={{ fontSize: 14 }} />
  ) : s === "In Progress" ? (
    <HourglassEmpty sx={{ fontSize: 14 }} />
  ) : (
    <Schedule sx={{ fontSize: 14 }} />
  );

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

const StatusRow = React.memo(({ r, expanded, onToggle }) => {
  return (
    <Box
      sx={{
        borderRadius: "12px",
        overflow: "hidden",
        border: `1px solid ${
          expanded ? statusColor(r.status) + "66" : P.border
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
            : `${P.surface}88`,
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
              color: P.text,
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            {r.type}
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mt: 0.3 }}>
            <Typography sx={{ fontSize: "0.65rem", color: P.muted }}>
              {r.id}
            </Typography>
            <Typography sx={{ fontSize: "0.65rem", color: P.muted }}>
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
              color: P.muted,
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
  useEffect(injectStyles, []);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTab = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [raiseOpen, setRaiseOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [reqType, setReqType] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [submitted, setSubmitted] = useState(false);
  const [snack, setSnack] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const handleSubmit = () => {
    if (!reqType || !desc) return;
    setSubmitted(true);
    setTimeout(() => {
      setRaiseOpen(false);
      setSubmitted(false);
      setReqType("");
      setDesc("");
      setSnack(true);
    }, 1800);
  };

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

      {/* ── HEADER ── */}
      {/* <Box sx={{
        position: "relative", zIndex: 10,
        background: `linear-gradient(180deg, ${P.surface} 0%, transparent 100%)`,
        borderBottom: `1px solid ${P.border}66`,
        px: { xs: 2.5, sm: 4, md: 6 }, py: 2,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: "8px",
            background: `linear-gradient(135deg, ${P.teal}, ${P.cyan})`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Shield sx={{ fontSize: 18, color: P.bg }} />
          </Box>
          <Box>
            <Typography sx={{ fontFamily: "'Syne',sans-serif", fontWeight: 800,
              fontSize: "0.95rem", color: P.text, lineHeight: 1 }}>
              StaffPortal
            </Typography>
            <Typography sx={{ fontSize: "0.6rem", color: P.teal, letterSpacing: "0.1em",
              textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>
              Accommodation Hub
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ textAlign: "right", display: { xs: "none", sm: "block" } }}>
            <Typography sx={{ fontSize: "0.8rem", color: P.text, fontWeight: 600,
              fontFamily: "'Syne',sans-serif" }}>{employee.name}</Typography>
            <Typography sx={{ fontSize: "0.65rem", color: P.muted }}>{employee.id} · {employee.dept}</Typography>
          </Box>
          <Avatar sx={{
            width: 36, height: 36, fontSize: "0.8rem", fontWeight: 700,
            background: `linear-gradient(135deg, ${P.tealDim}, ${P.teal})`,
            fontFamily: "'Syne',sans-serif",
          }}>
            {employee.name.split(" ").map(n => n[0]).join("")}
          </Avatar>
        </Box>
      </Box> */}

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
            {/* <Typography sx={{
              color: P.sub, fontSize: { xs: "0.8rem", sm: "0.9rem" },
              mt: 0.5, fontFamily: "'DM Sans',sans-serif",
            }}>
              Unit assigned under <Box component="span" sx={{ color: P.teal, fontWeight: 600 }}>
                {apt.subscriptionId}
              </Box>
            </Typography> */}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ position: "relative" }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  bgcolor: P.green,
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: -3,
                    borderRadius: "50%",
                    border: `2px solid ${P.green}`,
                    animation: "pulse-ring 1.8s ease-out infinite",
                  },
                }}
              />
            </Box>
            <Typography
              sx={{
                fontSize: "0.75rem",
                color: P.green,
                fontFamily: "'DM Sans',sans-serif",
                fontWeight: 600,
              }}
            >
              Active
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
              label="Verified"
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
                { label: "Total", val: 3, color: P.teal },
                { label: "Active", val: 1, color: P.gold },
                { label: "Resolved", val: 1, color: P.green },
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
              {MOCK_STATUSES.slice(0, 2).map((r) => (
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
                      {r.type}
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
            <Typography
              sx={{
                fontSize: "0.78rem",
                color: P.teal,
                fontWeight: 600,
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              📞 +966 50505050
            </Typography>
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
      <ModalWrap open={raiseOpen} onClose={() => setRaiseOpen(false)}>
        {/* header */}
        <Box
          sx={{
            px: 3,
            py: 2.5,
            borderBottom: `1px solid ${P.border}`,
            background: `linear-gradient(135deg, ${P.teal}22, ${P.surface})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "8px",
                background: `linear-gradient(135deg, ${P.teal}, ${P.cyan})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <NotificationsActive sx={{ fontSize: 18, color: P.bg }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontFamily: "'Syne',sans-serif",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: P.text,
                }}
              >
                Raise a Request
              </Typography>
              <Typography sx={{ fontSize: "0.65rem", color: P.muted }}>
                Apartment {apt.apartment}
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={() => setRaiseOpen(false)}
            sx={{ color: P.muted, "&:hover": { color: P.text } }}
          >
            <Close sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        {!submitted ? (
          <Box
            sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2.5 }}
          >
            {/* type */}
            <TextField
              select
              fullWidth
              label="Request Type"
              value={reqType}
              onChange={(e) => setReqType(e.target.value)}
              size="small"
              sx={fieldSx}
            >
              {REQUEST_TYPES.map((t) => (
                <MenuItem
                  key={t}
                  value={t}
                  sx={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: "0.85rem",
                    color: P.text,
                    bgcolor: P.card,
                    "&:hover": { bgcolor: `${P.teal}18` },
                  }}
                >
                  {t}
                </MenuItem>
              ))}
            </TextField>

            {/* priority */}
            <Box>
              <Typography
                sx={{
                  fontSize: "0.72rem",
                  color: P.muted,
                  mb: 1,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontFamily: "'DM Sans',sans-serif",
                  fontWeight: 600,
                }}
              >
                Priority
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                {["Low", "Normal", "High", "Urgent"].map((p) => (
                  <Box
                    key={p}
                    onClick={() => setPriority(p)}
                    sx={{
                      flex: 1,
                      py: 0.9,
                      borderRadius: "8px",
                      textAlign: "center",
                      cursor: "pointer",
                      border: `1.5px solid`,
                      borderColor: priority === p ? P.teal : P.border,
                      bgcolor: priority === p ? `${P.teal}18` : "transparent",
                      color: priority === p ? P.teal : P.muted,
                      fontSize: "0.75rem",
                      fontFamily: "'DM Sans',sans-serif",
                      fontWeight: priority === p ? 700 : 400,
                      transition: "all .15s",
                    }}
                  >
                    {p}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* description */}
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              placeholder="Describe the issue in detail…"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              sx={fieldSx}
            />

            {/* info row */}
            <Box
              sx={{
                p: 1.5,
                borderRadius: "8px",
                bgcolor: `${P.gold}10`,
                border: `1px solid ${P.gold}33`,
                display: "flex",
                gap: 1.5,
                alignItems: "flex-start",
              }}
            >
              <ErrorOutline sx={{ fontSize: 16, color: P.gold, mt: "1px" }} />
              <Typography
                sx={{
                  fontSize: "0.72rem",
                  color: P.sub,
                  fontFamily: "'DM Sans',sans-serif",
                  lineHeight: 1.5,
                }}
              >
                Requests are processed within 24 hours. Urgent requests are
                escalated immediately.
              </Typography>
            </Box>

            <Button
              fullWidth
              onClick={handleSubmit}
              disabled={!reqType || !desc}
              endIcon={<Send sx={{ fontSize: 16 }} />}
              sx={{
                background:
                  !reqType || !desc
                    ? `${P.border}`
                    : `linear-gradient(135deg, ${P.teal}, ${P.cyan})`,
                color: !reqType || !desc ? P.muted : P.bg,
                fontFamily: "'Syne',sans-serif",
                fontWeight: 700,
                fontSize: "0.9rem",
                textTransform: "none",
                borderRadius: "10px",
                py: 1.5,
                boxShadow:
                  !reqType || !desc ? "none" : `0 8px 24px ${P.teal}44`,
                transition: "all .25s",
              }}
            >
              Submit Request
            </Button>
          </Box>
        ) : (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                mx: "auto",
                mb: 2,
                background: `${P.green}22`,
                border: `2px solid ${P.green}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CheckCircle sx={{ fontSize: 36, color: P.green }} />
            </Box>
            <Typography
              sx={{
                fontFamily: "'Syne',sans-serif",
                fontWeight: 800,
                fontSize: "1.2rem",
                color: P.text,
                mb: 1,
              }}
            >
              Request Submitted!
            </Typography>
            <Typography
              sx={{
                fontSize: "0.82rem",
                color: P.sub,
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              You'll receive a confirmation shortly. Track it under Status.
            </Typography>
          </Box>
        )}
      </ModalWrap>

      {/* ══════════════════════════════════════════ */}
      {/*  STATUS MODAL                              */}
      {/* ══════════════════════════════════════════ */}
      <ModalWrap open={statusOpen} onClose={() => setStatusOpen(false)} wide>
        {/* header */}
        <Box
          sx={{
            px: 3,
            py: 2.5,
            borderBottom: `1px solid ${P.border}`,
            background: `linear-gradient(135deg, ${P.gold}18, ${P.surface})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "8px",
                background: `linear-gradient(135deg, ${P.gold}, ${P.goldDim})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Schedule sx={{ fontSize: 18, color: P.bg }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontFamily: "'Syne',sans-serif",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: P.text,
                }}
              >
                Request Status
              </Typography>
              <Typography sx={{ fontSize: "0.65rem", color: P.muted }}>
                {MOCK_STATUSES.length} requests found
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={() => setStatusOpen(false)}
            sx={{ color: P.muted, "&:hover": { color: P.text } }}
          >
            <Close sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
          {/* {MOCK_STATUSES.map((r) => (
            <Box key={r.id} sx={{
              borderRadius: "12px", overflow: "hidden",
              border: `1px solid ${expanded === r.id ? statusColor(r.status) + "66" : P.border}`,
              transition: "border-color .2s",
            }}> */}
          {/* row header */}
          {/* <Box onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                sx={{
                  p: "12px 16px", cursor: "pointer",
                  background: expanded === r.id
                    ? `${statusColor(r.status)}10`
                    : `${P.surface}88`,
                  display: "flex", alignItems: "center", gap: 1.5,
                  "&:hover": { background: `${statusColor(r.status)}08` },
                  transition: "background .2s",
                }}>
                <Box sx={{
                  width: 32, height: 32, borderRadius: "8px", flexShrink: 0,
                  background: `${statusColor(r.status)}18`,
                  border: `1px solid ${statusColor(r.status)}44`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: statusColor(r.status),
                }}>
                  {statusIcon(r.status)}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: P.text,
                    fontFamily: "'DM Sans',sans-serif" }}>{r.type}</Typography>
                  <Box sx={{ display: "flex", gap: 2, mt: 0.3 }}>
                    <Typography sx={{ fontSize: "0.65rem", color: P.muted }}>{r.id}</Typography>
                    <Typography sx={{ fontSize: "0.65rem", color: P.muted }}>
                      <CalendarMonth sx={{ fontSize: 10, mr: 0.3 }} />{r.date}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip label={r.status} size="small"
                    sx={{ bgcolor: `${statusColor(r.status)}18`, color: statusColor(r.status),
                      border: `1px solid ${statusColor(r.status)}44`,
                      fontSize: "0.65rem", height: 22, fontFamily: "'DM Sans',sans-serif" }} />
                  <KeyboardArrowDown sx={{
                    fontSize: 18, color: P.muted,
                    transform: expanded === r.id ? "rotate(180deg)" : "none",
                    transition: "transform .2s",
                  }} />
                </Box>
              </Box> */}

          {/* expandable stepper */}
          {/* {expanded === r.id && (
                <Fade in>
                  <Box sx={{ px: 2.5, py: 2, borderTop: `1px solid ${P.border}55`,
                    background: `${P.bg}66` }}>
                    <Stepper activeStep={r.step - 1} orientation="horizontal" alternativeLabel
                      sx={{
                        "& .MuiStepLabel-label": {
                          fontFamily: "'DM Sans',sans-serif", fontSize: "0.65rem", color: P.muted,
                          "&.Mui-active": { color: P.teal, fontWeight: 700 },
                          "&.Mui-completed": { color: P.green },
                        },
                        "& .MuiStepIcon-root": { color: P.border, fontSize: "1.1rem" },
                        "& .MuiStepIcon-root.Mui-active": { color: P.teal },
                        "& .MuiStepIcon-root.Mui-completed": { color: P.green },
                        "& .MuiStepConnector-line": { borderColor: P.border },
                      }}>
                      {STEPS.map((s) => (
                        <Step key={s}><StepLabel>{s}</StepLabel></Step>
                      ))}
                    </Stepper>
                    <LinearProgress variant="determinate"
                      value={(r.step / STEPS.length) * 100}
                      sx={{
                        mt: 2, height: 4, borderRadius: 4, bgcolor: P.border,
                        "& .MuiLinearProgress-bar": {
                          background: `linear-gradient(90deg, ${P.teal}, ${P.green})`,
                          borderRadius: 4,
                        },
                      }} />
                    <Typography sx={{ fontSize: "0.65rem", color: P.muted, mt: 0.8,
                      textAlign: "right", fontFamily: "'DM Sans',sans-serif" }}>
                      {Math.round((r.step / STEPS.length) * 100)}% complete
                    </Typography>
                  </Box>
                </Fade>
              )} */}
          {/* </Box>
          ))} */}
          {/* {MOCK_STATUSES.map((r) => (
            <StatusRow
              key={r.id}
              r={r}
              expanded={expanded === r.id}
              onToggle={(id) => setExpanded(expanded === id ? null : id)}
            />
          ))} */}
        </Box>
      </ModalWrap>

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
    </Box>
  );
}

/* ── shared text field styles ── */
const fieldSx = {
  "& .MuiInputBase-root": {
    bgcolor: `#060D1A`,
    borderRadius: "8px",
    fontFamily: "'DM Sans',sans-serif",
    fontSize: "0.88rem",
    color: "#E2EAF4",
  },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#1E3250" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#0EA5E9" },
  "& .Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#0EA5E9" },
  "& .MuiInputLabel-root": {
    color: "#64748B",
    fontFamily: "'DM Sans',sans-serif",
    fontSize: "0.85rem",
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#0EA5E9" },
  "& .MuiSelect-icon": { color: "#64748B" },
};
