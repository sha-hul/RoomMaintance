import { Box, Typography, IconButton, Chip, Fade, Button } from "@mui/material";
import {
  Schedule,
  Close,
  CalendarMonth,
  KeyboardArrowDown,
} from "@mui/icons-material";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import {cancelMaintenanceRequest, getApartmentRequestDetails} from "../Service/apartmentmicrositeService"

export default function StatusModal({
  open,
  onClose,
  requests,
  statusColor,
  statusIcon,
  P,
  ModalWrap,
  setStatuses,
  data
}) {

  const [expanded, setExpanded] = useState(null);
  
  return (
    <ModalWrap open={open} onClose={onClose} wide>
      {/* Header */}
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
              {requests.length} requests found
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{ color: P.muted, "&:hover": { color: P.text } }}
        >
          <Close sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      {/* Body */}
      <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
        {requests.map((r) => (
          <RequestRow
            key={r.id}
            r={r}
            expanded={expanded === r.id}
            onToggle={() => setExpanded(expanded === r.id ? null : r.id)}
            statusColor={statusColor}
            statusIcon={statusIcon}
            P={P}
            setStatuses={setStatuses}
            data={data}
          />
        ))}
      </Box>
    </ModalWrap>
  );
}

// ── Inner Row Component ───────────────────────────────────────────────
function RequestRow({ r, expanded, onToggle, statusColor, statusIcon, P, setStatuses,data }) {

  const handleCancelRequest = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this request?")) return;
    try {
      debugger;
      await cancelMaintenanceRequest(id);
      const resReq = await getApartmentRequestDetails(data.apart);
      setStatuses(resReq.data);
    } catch (error) {
      console.error("Cancel error:", error);
      alert("Failed to cancel request.");
    }
  };

  return (
    <Box
      sx={{
        borderRadius: "12px",
        overflow: "hidden",
        border: `1px solid ${expanded ? statusColor(r.status) + "66" : P.border}`,
        transition: "border-color .2s",
      }}
    >
      {/* Row Header */}
      <Box
        onClick={onToggle}
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

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: "0.85rem",
              fontWeight: 700,
              color: P.text,
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            {`${r.category} - ${r.subCategory}`}
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mt: 0.3 }}>
            <Typography sx={{ fontSize: "0.65rem", color: P.muted }}>
              REQ-{r.id}
            </Typography>
            <Typography sx={{ fontSize: "0.65rem", color: P.muted }}>
              <CalendarMonth sx={{ fontSize: 10, mr: 0.3 }} />
              {new Date(r.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </Typography>
          </Box>
        </Box>

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

      {/* Expandable Content */}
      {expanded && (
        <Fade in>
          <Box
            sx={{
              px: 2.5,
              py: 2,
              borderTop: `1px solid ${P.border}55`,
              background: `${P.bg}66`,
            }}
          >
            {/* Issue Description */}
            <Box sx={{ mb: 2 }}>
              <Typography
                sx={{
                  fontSize: "0.65rem",
                  color: P.muted,
                  mb: 0.5,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontFamily: "'DM Sans',sans-serif",
                  fontWeight: 600,
                }}
              >
                Issue Description
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.8rem",
                  color: P.text,
                  fontFamily: "'DM Sans',sans-serif",
                  lineHeight: 1.6,
                }}
              >
                {r.description || "No description provided."}
              </Typography>
            </Box>

            {/* Divider */}
            <Box sx={{ borderTop: `1px solid ${P.border}55`, mb: 2 }} />

            {/* Admin Remarks */}
            <Box>
              <Typography
                sx={{
                  fontSize: "0.65rem",
                  color: P.muted,
                  mb: 0.5,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontFamily: "'DM Sans',sans-serif",
                  fontWeight: 600,
                }}
              >
                Admin Remarks
              </Typography>
              {r.adminRemark ? (
                <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: P.teal,
                      mt: "6px",
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: "0.8rem",
                      color: P.sub,
                      fontFamily: "'DM Sans',sans-serif",
                      lineHeight: 1.6,
                    }}
                  >
                    {r.adminRemark}
                  </Typography>
                </Box>
              ) : (
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    color: P.muted,
                    fontFamily: "'DM Sans',sans-serif",
                    fontStyle: "italic",
                  }}
                >
                  No remarks yet.
                </Typography>
              )}
            </Box>

            {/* Cancel Button — Pending only */}
            {r.status === "Pending" && (
              <>
                <Box sx={{ borderTop: `1px solid ${P.border}55`, mt: 2, mb: 2 }} />
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<CancelOutlinedIcon />}
                    onClick={() => handleCancelRequest(r.id)}
                    sx={{
                      fontSize: "0.75rem",
                      textTransform: "none",
                      fontFamily: "'DM Sans',sans-serif",
                      fontWeight: 600,
                      color: "#c62828",
                      borderColor: "#ef9a9a",
                      borderRadius: "8px",
                      px: 2,
                      "&:hover": {
                        backgroundColor: "#ffebee",
                        borderColor: "#c62828",
                      },
                    }}
                  >
                    Cancel Request
                  </Button>
                </Box>
              </>
            )}

          </Box>
        </Fade>
      )}
    </Box>
  );
}