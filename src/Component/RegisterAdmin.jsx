import { useState } from "react";
import {
  Box, Typography, TextField, Button, MenuItem,
  InputAdornment, IconButton, Alert, Snackbar, Divider,Paper
} from "@mui/material";
import {
  Person, Lock, Mail, Badge, AdminPanelSettings,
  Visibility, VisibilityOff, CheckCircle, AppRegistration,
} from "@mui/icons-material";
import axios from "axios";
import {registerAdmin} from "../Service/registeradminService"
import {useNavigate} from "react-router-dom"

const ROLES = ["Admin"];

/* ── validation ─────────────────────────────────────── */
const validate = (form) => {
  const errors = {};

  if (!form.empId.trim())
    errors.empId = "Employee ID is required";

  if (!form.empName.trim())
    errors.empName = "Employee Name is required";

  if (!form.mail.trim())
    errors.mail = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.mail))
    errors.mail = "Enter a valid email address";

  if (!form.role)
    errors.role = "Role is required";

  if (!form.password.trim())
    errors.password = "Password is required";
  else if (form.password.length < 6)
    errors.password = "Password must be at least 6 characters";

  if (!form.confirmPassword.trim())
    errors.confirmPassword = "Please confirm your password";
  else if (form.password !== form.confirmPassword)
    errors.confirmPassword = "Passwords do not match";

  return errors;
};

/* ── field style ─────────────────────────────────────── */
const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    fontSize: 14,
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#1e3a5f" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#1e3a5f",
      borderWidth: 2,
    },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#1e3a5f" },
};

/* ══════════════════════════════════════════════════════ */
export default function RegisterAdmin() {
  const [form, setForm] = useState({
    empId: "", empName: "", mail: "", role: "", password: "", confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "error" });
  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async () => {
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        empId:    form.empId.trim(),
        password: form.password,
        role:     form.role,
        empName:  form.empName.trim(),
        mail:     form.mail.trim(),
      };
      const res = await registerAdmin(payload);
      if (!res.data.status) throw new Error(res.data.message || "Registration failed");
      setSuccess(true);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || err.message || "Something went wrong",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ empId: "", empName: "", mail: "", role: "", password: "", confirmPassword: "" });
    setErrors({});
    setSuccess(false);
  };

  const handleLogin = () => {
    setForm({ empId: "", empName: "", mail: "", role: "", password: "", confirmPassword: "" });
    setErrors({});
    navigate("/")
  };

  /* ── Success Screen ─────────────────────────────────── */
  if (success) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa", display: "flex", alignItems: "center", justifyContent: "center", p: 3 }}>
        <Box sx={{ bgcolor: "#fff", borderRadius: 4, p: 5, textAlign: "center", maxWidth: 420, width: "100%", boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}>
          <Box sx={{ width: 80, height: 80, borderRadius: "50%", bgcolor: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 3 }}>
            <CheckCircle sx={{ fontSize: 44, color: "#2e7d32" }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#1e3a5f", mb: 1 }}>
            Admin Registered!
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: 14, mb: 1 }}>
            <strong>{form.empName}</strong> has been successfully registered.
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: 13, mb: 3 }}>
            EmpId: <strong>{form.empId}</strong> &nbsp;|&nbsp; Role: <strong>{form.role}</strong>
          </Typography>
          <Button
            fullWidth variant="contained"
            onClick={handleReset}
            sx={{ bgcolor: "#1e3a5f", borderRadius: "10px", textTransform: "none", fontWeight: 600, py: 1.3, "&:hover": { bgcolor: "#16304f" } }}
          >
            Register Another Admin
          </Button>
          <br/>
          <br/>
          <Button
            fullWidth variant="contained"
            onClick={handleLogin}
            sx={{ bgcolor: "#d4d8dd", borderRadius: "10px", textTransform: "none", fontWeight: 600, py: 1.3, "&:hover": { bgcolor: "#8392a5" } }}
          >
            Back to Login
          </Button>
        </Box>
      </Box>
    );
  }

  /* ── Form ───────────────────────────────────────────── */
  return (
  <Box
    sx={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
    }}
  >
    <Paper
      elevation={6}
      sx={{ p: 4, width: 420, borderRadius: 3, textAlign: "center" }}
    >
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", color: "#0d47a1" }}>
        Register Admin
      </Typography>

      {/* Employee ID */}
      <TextField
        label="Employee ID *" fullWidth variant="outlined"
        sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
        value={form.empId} onChange={handleChange("empId")}
        error={!!errors.empId} helperText={errors.empId}
      />

      {/* Employee Name */}
      <TextField
        label="Employee Name *" fullWidth variant="outlined"
        sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
        value={form.empName} onChange={handleChange("empName")}
        error={!!errors.empName} helperText={errors.empName}
      />

      {/* Email */}
      <TextField
        label="Email *" fullWidth variant="outlined" type="email"
        sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
        value={form.mail} onChange={handleChange("mail")}
        error={!!errors.mail} helperText={errors.mail}
      />

      {/* Role */}
      <TextField
        select label="Role *" fullWidth variant="outlined"
        sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
        value={form.role} onChange={handleChange("role")}
        error={!!errors.role} helperText={errors.role}
      >
        <MenuItem value="">Select Role</MenuItem>
        {ROLES.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
      </TextField>

      {/* Password */}
      <TextField
        label="Password *" fullWidth variant="outlined"
        type={showPassword ? "text" : "password"}
        sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
        value={form.password} onChange={handleChange("password")}
        error={!!errors.password} helperText={errors.password}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => setShowPassword((p) => !p)}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Confirm Password */}
      <TextField
        label="Confirm Password *" fullWidth variant="outlined"
        type={showConfirm ? "text" : "password"}
        sx={{ mb: 3, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
        value={form.confirmPassword} onChange={handleChange("confirmPassword")}
        error={!!errors.confirmPassword} helperText={errors.confirmPassword}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => setShowConfirm((p) => !p)}>
                {showConfirm ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Submit */}
      <Button
        fullWidth variant="contained"
        onClick={handleSubmit} disabled={loading}
        sx={{
          py: 1.2, borderRadius: 2, fontWeight: "bold",
          backgroundColor: "#0d6efd",
          "&:hover": { backgroundColor: "#0b5ed7" },
        }}
      >
        {loading ? "Registering..." : "Register Admin"}
      </Button>
    </Paper>

    {/* Error Snackbar */}
    <Snackbar
      open={snackbar.open} autoHideDuration={4000}
      onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert severity={snackbar.severity}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}>
        {snackbar.message}
      </Alert>
    </Snackbar>
  </Box>
);
}
