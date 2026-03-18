import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Button,
  Chip,
  Tooltip,
  Stack,
} from "@mui/material";
import {
  Close,
  Download,
  Share,
  Apartment,
  LocationOn,
  ConfirmationNumber,
  MeetingRoom,
  Spa,
  Business,
} from "@mui/icons-material";

// ── mock QR via Google Charts API (no extra dep) ──────────────────────────────
const QR_URL =
  "https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=ESubscription-APT-2024-XR9K2";

const DETAIL_ROWS = [
  { icon: <Business sx={{ fontSize: 16 }} />, label: "Facility", value: "Skyline Residences" },
  { icon: <LocationOn sx={{ fontSize: 16 }} />, label: "Location", value: "Dubai Marina, UAE" },
  { icon: <Apartment sx={{ fontSize: 16 }} />, label: "Apartment", value: "Unit 4B – Tower A" },
  {
    icon: <ConfirmationNumber sx={{ fontSize: 16 }} />,
    label: "Subscription ID",
    value: "ES-2024-XR9K2",
  },
  { icon: <MeetingRoom sx={{ fontSize: 16 }} />, label: "Room Count", value: "3 Rooms" },
];

const AMENITIES = ["Gym", "Pool", "Spa", "Parking", "Concierge"];

// ── colour tokens ─────────────────────────────────────────────────────────────
const C = {
  navy: "#0D1B2A",
  navyLight: "#16273B",
  gold: "#C9A84C",
  goldLight: "#E2C97E",
  accent: "#4A9EBF",
  surface: "#F4F6F9",
  white: "#FFFFFF",
  text: "#1A2B3C",
  muted: "#5C7A8A",
};

// ── main component ────────────────────────────────────────────────────────────
export default function ApartmentQRModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* demo trigger */}
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${C.navy} 0%, #1A3A5C 100%)`,
          fontFamily: "'Cormorant Garamond', Georgia, serif",
        }}
      >
        <Button
          onClick={() => setOpen(true)}
          variant="contained"
          sx={{
            background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
            color: C.navy,
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            px: 5,
            py: 1.5,
            borderRadius: "2px",
            boxShadow: `0 8px 32px rgba(201,168,76,0.35)`,
            "&:hover": {
              background: `linear-gradient(135deg, ${C.goldLight}, ${C.gold})`,
              boxShadow: `0 12px 40px rgba(201,168,76,0.5)`,
              transform: "translateY(-1px)",
            },
            transition: "all 0.25s ease",
          }}
        >
          View Details / QR Code
        </Button>
      </Box>

      {/* ── modal ── */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        BackdropProps={{
          sx: { backdropFilter: "blur(6px)", backgroundColor: "rgba(0,0,0,0.55)" },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "92vw", sm: 760 },
            bgcolor: C.white,
            borderRadius: "4px",
            overflow: "hidden",
            boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
            outline: "none",
          }}
        >
          {/* ── header bar ── */}
          <Box
            sx={{
              background: `linear-gradient(135deg, ${C.navy} 0%, #1A3A5C 100%)`,
              px: 4,
              py: 2.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: `linear-gradient(90deg, ${C.gold}, ${C.goldLight}, ${C.gold})`,
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Apartment sx={{ color: C.gold, fontSize: 26 }} />
              <Box>
                <Typography
                  sx={{
                    fontFamily: "'Cormorant Garamond', serif",
                    color: C.white,
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    lineHeight: 1,
                    letterSpacing: "0.04em",
                  }}
                >
                  Apartment Details
                </Typography>
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "0.7rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    fontFamily: "'DM Sans', sans-serif",
                    mt: 0.3,
                  }}
                >
                  Property Overview
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={() => setOpen(false)}
              sx={{
                color: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "2px",
                width: 34,
                height: 34,
                "&:hover": { color: C.white, borderColor: C.gold, background: "rgba(201,168,76,0.15)" },
              }}
            >
              <Close sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>

          {/* ── body ── */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              minHeight: 360,
            }}
          >
            {/* ── LEFT: details ── */}
            <Box sx={{ flex: 1, px: 4, py: 3.5, background: C.white }}>
              <Stack spacing={2.5}>
                {DETAIL_ROWS.map(({ icon, label, value }) => (
                  <Box key={label}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.7, mb: 0.4 }}>
                      <Box sx={{ color: C.gold }}>{icon}</Box>
                      <Typography
                        sx={{
                          fontSize: "0.65rem",
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          color: C.muted,
                          fontFamily: "'DM Sans', sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        {label}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "1.05rem",
                        fontWeight: 600,
                        color: C.text,
                        pl: 2.8,
                        borderLeft: `2px solid ${C.surface}`,
                      }}
                    >
                      {value}
                    </Typography>
                  </Box>
                ))}

                {/* amenities */}
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.7, mb: 0.8 }}>
                    <Spa sx={{ fontSize: 16, color: C.gold }} />
                    <Typography
                      sx={{
                        fontSize: "0.65rem",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: C.muted,
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      Amenities
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, pl: 2.8 }}>
                    {AMENITIES.map((a) => (
                      <Chip
                        key={a}
                        label={a}
                        size="small"
                        sx={{
                          background: `linear-gradient(135deg, ${C.navy}08, ${C.navy}14)`,
                          color: C.navy,
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          border: `1px solid ${C.navy}18`,
                          borderRadius: "2px",
                          height: 24,
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Stack>
            </Box>

            {/* ── vertical divider ── */}
            <Box
              sx={{
                width: "1px",
                background: `linear-gradient(to bottom, transparent, ${C.gold}55, ${C.gold}99, ${C.gold}55, transparent)`,
                flexShrink: 0,
                display: { xs: "none", sm: "block" },
              }}
            />

            {/* ── RIGHT: QR code ── */}
            <Box
              sx={{
                width: { xs: "100%", sm: 240 },
                px: 3.5,
                py: 3.5,
                background: `linear-gradient(160deg, ${C.surface} 0%, #E8EDF2 100%)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                borderLeft: { xs: "none", sm: `1px solid ${C.navy}08` },
                borderTop: { xs: `1px solid ${C.navy}08`, sm: "none" },
              }}
            >
              <Typography
                sx={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: C.navy,
                  letterSpacing: "0.06em",
                  textAlign: "center",
                }}
              >
                QR Code
              </Typography>

              {/* QR frame */}
              <Box
                sx={{
                  position: "relative",
                  p: "10px",
                  background: C.white,
                  borderRadius: "4px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  border: `1px solid rgba(201,168,76,0.2)`,
                  "&::before, &::after": {
                    content: '""',
                    position: "absolute",
                    width: 18,
                    height: 18,
                    borderColor: C.gold,
                    borderStyle: "solid",
                  },
                  "&::before": {
                    top: -1,
                    left: -1,
                    borderWidth: "2px 0 0 2px",
                    borderRadius: "2px 0 0 0",
                  },
                  "&::after": {
                    bottom: -1,
                    right: -1,
                    borderWidth: "0 2px 2px 0",
                    borderRadius: "0 0 2px 0",
                  },
                }}
              >
                <Box
                  component="img"
                  src={QR_URL}
                  alt="QR Code"
                  sx={{ width: 160, height: 160, display: "block" }}
                />
              </Box>

              <Typography
                sx={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  color: C.muted,
                  textAlign: "center",
                  fontFamily: "'DM Sans', sans-serif",
                  textTransform: "uppercase",
                }}
              >
                Scan to access unit info
              </Typography>

              {/* action buttons */}
              <Stack spacing={1} sx={{ width: "100%" }}>
                <Tooltip title="Download QR Code" placement="left">
                  <Button
                    fullWidth
                    startIcon={<Download sx={{ fontSize: 16 }} />}
                    href={QR_URL}
                    download="apartment-qr.png"
                    target="_blank"
                    sx={{
                      background: `linear-gradient(135deg, ${C.navy}, #1A3A5C)`,
                      color: C.white,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      textTransform: "none",
                      borderRadius: "2px",
                      py: 1,
                      "&:hover": {
                        background: `linear-gradient(135deg, #1A3A5C, ${C.navy})`,
                        boxShadow: `0 4px 16px rgba(13,27,42,0.4)`,
                        transform: "translateY(-1px)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    Download QR
                  </Button>
                </Tooltip>

                <Tooltip title="Share QR Code" placement="left">
                  <Button
                    fullWidth
                    startIcon={<Share sx={{ fontSize: 16 }} />}
                    onClick={() =>
                      navigator.share?.({
                        title: "Apartment QR Code",
                        text: "Scan to view apartment details",
                        url: QR_URL,
                      })
                    }
                    sx={{
                      background: "transparent",
                      color: C.navy,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      textTransform: "none",
                      borderRadius: "2px",
                      py: 1,
                      border: `1.5px solid ${C.navy}30`,
                      "&:hover": {
                        background: `${C.navy}08`,
                        borderColor: C.gold,
                        color: C.navy,
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    Share QR
                  </Button>
                </Tooltip>
              </Stack>
            </Box>
          </Box>

          {/* ── footer ── */}
          <Box
            sx={{
              background: C.surface,
              px: 4,
              py: 1.8,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: `1px solid ${C.navy}10`,
            }}
          >
            <Typography
              sx={{
                fontSize: "0.68rem",
                color: C.muted,
                letterSpacing: "0.08em",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Last updated: March 18, 2026
            </Typography>
            <Button
              onClick={() => setOpen(false)}
              size="small"
              sx={{
                color: C.muted,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.75rem",
                textTransform: "none",
                "&:hover": { color: C.navy },
              }}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
