import { toast } from "react-toastify";
export const showSuccessToast = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    pauseOnHover: true,
    closeOnClick: true,
  });
};

// ❌ Error Toast
export const showErrorToast = (message) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 3000,
    pauseOnHover: true,
    closeOnClick: true,
  });
};
