import { useState } from "react";

export const useToast = () => {
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success", // success | error | warning | info
  });

  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  const showSuccess = (message) => showToast(message, "success");
  const showError = (message) => showToast(message, "error");
  const showWarning = (message) => showToast(message, "warning");

  const closeToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  return {
    toast,
    showToast,
    showSuccess,
    showError,
    showWarning,
    closeToast,
  };
};

export default useToast;