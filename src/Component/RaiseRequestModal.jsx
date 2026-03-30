import React, { useState, useEffect } from "react";
import {
  Snackbar,
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
import {
  getFacilities,
  getLocationsByFacility,
  getApartmentsByLocation,
  getCategories,
  getSubCategoriesByCategory,
  submitMaintenanceRequest,
} from "../Service/maintenanceService";
import {
  decryptParams,
  getApartmentDetails, getApartmentRequestDetails
} from "../Service/apartmentmicrositeService";
export default function RaiseRequestModal({
  open,
  onClose,
  apt,
  categories,
  P,
  data,
  ModalWrap,
  setSnackbar,
  setStatuses
}) {
  const [form, setForm] = useState({
    category: 0,
    subCategory: "",
    description: "",
    attachment: null,
    employeeName: "",
    contactNo: "",
    updatedBy: "user",
    empId: "1111",
  });
  const [submitted, setSubmitted] = useState(false);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    debugger;
    setForm((prev) => ({ ...prev, subCategory: "" }));

    if (!form.category || form.category === 0) {
      setSubCategories([]);
      return;
    }

    const fetchSubCategories = async () => {
      try {
        const res = await getSubCategoriesByCategory(form.category);
        setSubCategories(res.data);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchSubCategories();
    // const subs = mockSubCategories[form.category] || []; //#Shahul
    // setSubCategories(subs);
  }, [form.category]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async () => {
    debugger;
    let res = await confirmSubmit();
    res = true; //#Shahul need to remove
    res ? setSubmitted(true) : setSubmitted(false);
  };

  const confirmSubmit = async () => {
    try {
      const payload = {
        // From form state
        category: Number(form.category),
        subCategory: Number(form.subCategory),
        description: form.description,
        attachment: form.attachment ? form.attachment.name : null,
        employeeName: form.employeeName,
        contactNo: form.contactNo,
        facility: Number(data.facid),
        location: Number(data.locid),
        apartment: Number(data.apart),
        updatedBy: form.updatedBy,
        empId: form.empId
      };

      const response = await submitMaintenanceRequest(payload);

      if (!response.data.status) {
        throw new Error(response.data.message || "Request failed");
      }
      const resReq = await getApartmentRequestDetails(data.apart);
              setStatuses(resReq.data);
      return true;
    } catch (error) {
      console.error("Error submitting request:", error); // error
      setSnackbar({
        open: true,
        message: error.message || "Something went wrong. Please try again.",
        severity: "error",
      });
      return false;
    }
  };

  return (
    <>
      <ModalWrap open={open} onClose={onClose}>
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
                <strong>{apt.location}</strong> : Apartment {apt.apartment}
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

        {!submitted ? ( //#Shahul Doubt
          <Box
            sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2.5 }}
          >
            {/* Category + SubCategory */}
            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}
            >
              <TextField
                select
                fullWidth
                label="Category"
                size="small"
                value={form.category}
                onChange={handleChange}
                name="category"
                sx={fieldSx(P)}
              >
                <MenuItem value={0}>Select Category</MenuItem>
                {categories.map((c) => (
                  <MenuItem
                    key={c.id}
                    value={c.id}
                    sx={{ fontSize: "0.85rem" }}
                  >
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                fullWidth
                label="Sub Category"
                size="small"
                value={form.subCategory}
                onChange={handleChange}
                name="subCategory"
                sx={fieldSx(P)}
              >
                <MenuItem value="">Select Sub Category</MenuItem>
                {subCategories.map((sc) => (
                  <MenuItem
                    key={sc.id}
                    value={sc.id}
                    sx={{ fontSize: "0.85rem" }}
                  >
                    {sc.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {/* Description */}
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Issue Description"
              placeholder="Describe the issue in detail…"
              name="description"
              value={form.description}
              onChange={handleChange}
              sx={fieldSx(P)}
            />

            {/* Attachment */}
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
                Attachment{" "}
                <span style={{ textTransform: "none", fontWeight: 400 }}>
                  (optional)
                </span>
              </Typography>
              <Box
                component="label"
                sx={{
                  border: `1.5px dashed ${P.border}`,
                  borderRadius: "10px",
                  p: 2,
                  textAlign: "center",
                  cursor: "pointer",
                  bgcolor: `${P.surface}`,
                  display: "block",
                  "&:hover": { borderColor: P.teal },
                }}
              >
                <input
                  type="file"
                  name="attachment"
                  hidden
                  onChange={handleChange}
                />
                <Typography sx={{ fontSize: "0.78rem", color: P.muted }}>
                  Click to upload or drag & drop
                </Typography>
                <Typography
                  sx={{ fontSize: "0.7rem", color: P.muted, mt: 0.5 }}
                >
                  PNG, JPG, PDF up to 10MB
                </Typography>
              </Box>
            </Box>

            {/* Employee Name + Contact No */}
            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}
            >
              <TextField
                fullWidth
                size="small"
                label="Employee Name"
                value={form.employeeName}
                name="employeeName"
                onChange={handleChange}
                sx={fieldSx(P)}
              />
              <TextField
                fullWidth
                size="small"
                label="Contact No"
                value={form.contactNo}
                name="contactNo"
                onChange={handleChange}
                sx={fieldSx(P)}
              />
            </Box>

            {/* Submit */}
            <Button
              fullWidth
              onClick={handleSubmit}
              disabled={
                !form.category || !form.subCategory || !form.description
              }
              endIcon={<Send sx={{ fontSize: 16 }} />}
              sx={{
                background:
                  !form.category ||
                    !form.subCategory ||
                    !form.description ||
                    !form.employeeName ||
                    !form.contactNo
                    ? P.border
                    : `linear-gradient(135deg, ${P.teal}, ${P.cyan})`,
                color:
                  !form.category ||
                    !form.subCategory ||
                    !form.description ||
                    !form.employeeName ||
                    !form.contactNo
                    ? P.muted
                    : P.bg,
                fontFamily: "'Syne',sans-serif",
                fontWeight: 700,
                fontSize: "0.9rem",
                textTransform: "none",
                borderRadius: "10px",
                py: 1.5,
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
              {/* You'll receive a confirmation shortly.  */}
              Track it under Status.
            </Typography>
          </Box>
        )}
      </ModalWrap>
    </>
  );
}

/* ── shared text field styles ── */
const fieldSx = (P) => ({
  "& .MuiInputBase-root": {
    bgcolor: P.card,
    borderRadius: "8px",
    fontFamily: "'DM Sans',sans-serif",
    fontSize: "0.88rem",
    color: P.text,
  },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: P.border },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: P.teal },
  "& .Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: P.teal },
  "& .MuiInputLabel-root": {
    color: P.muted,
    fontFamily: "'DM Sans',sans-serif",
    fontSize: "0.85rem",
  },
  "& .MuiInputLabel-root.Mui-focused": { color: P.teal },
  "& .MuiSelect-icon": { color: P.muted },
});