import { Snackbar, Alert } from "@mui/material";

export const Toast = ({ toast, closeToast }) => (
  <Snackbar
    open={toast.open}
    autoHideDuration={2500}
    onClose={closeToast}
    anchorOrigin={{ vertical: "top", horizontal: "center" }}
    sx={{
      "& .MuiSnackbarContent-root": {
        borderRadius: "10px",
        padding: 0,
      }
    }}
  >
    <Alert
      onClose={closeToast}
      severity={toast.severity}
      variant="filled"
      sx={{
        width: "100%",
        fontSize: "1rem",
        padding: "10px 20px",
        borderRadius: "10px",
      }}
    >
      {toast.message}
    </Alert>
  </Snackbar>
);


export default Toast;