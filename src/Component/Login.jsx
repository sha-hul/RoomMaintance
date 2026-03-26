import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { UserLogin } from "../Service/loginService.js"
import useToast from '../Common/useToast.jsx'
import Toast from '../Common/Toast.jsx'
import { useNavigate } from "react-router-dom";
import LoadingButton from '@mui/lab/LoadingButton';

const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const { toast, showError, showWarning, closeToast } = useToast();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    if (!userId.trim() || !password.trim()) {
      showWarning("Please enter UserID and Password");
      setLoading(false)
      return;
    }

    try {
      const response = await UserLogin(userId, password);
      const data = response.data;

      // SUCCESS CASE
      if (data.status) {
        localStorage.setItem("token", data.token);

        if (data.role.toLowerCase() === "admin")
          navigate("/admindashboard");
        else
          navigate("/empdashboard");

        return;
      }

    } catch (error) {
      // ERROR CASE (400, 401, 404)
      if (error.response && error.response.data) {
        const err = error.response.data;

        switch (err.errorcode) {
          case 101:
            showWarning("Please enter UserID and Password");
            break;
          case 102:
            showError("User ID not found");
            break;
          case 103:
            showError("Kindly enter the correct password");
            break;
          default:
            showError("Login failed");
        }
      } else {
        showError("Server not reachable");
      }
    }
    finally {
      setLoading(false)
    }
  };


  return (
    <>
      <Box
        sx={{
          height: "90vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #e3f2fd, #bbdefb)"
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            width: 380,
            borderRadius: 3,
            textAlign: "center"
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <Typography
              variant="h5"
              sx={{
                mb: 3,
                fontWeight: "bold",
                color: "#0d47a1"
              }}
            >
              Admin Login
            </Typography>

            <TextField
              label="UserID"
              variant="outlined"
              fullWidth
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": { borderRadius: 2 }
              }}
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />

            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": { borderRadius: 2 }
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <LoadingButton
              type="submit"
              fullWidth
              loading={loading}
              loadingIndicator="Logging in..."
              variant="contained"
              sx={{
                py: 1.2,
                borderRadius: 2,
                fontWeight: "bold",
                backgroundColor: "#0d6efd",
                "&:hover": { backgroundColor: "#0b5ed7" }
              }}
            >
              Login
            </LoadingButton>

          </form>
        </Paper>
      </Box>

      <Toast toast={toast} closeToast={closeToast} />
    </>
  );

};

export default Login;