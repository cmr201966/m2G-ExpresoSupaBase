import Snackbar from "@mui/material/Snackbar";
import { useNotification } from "../../context/NotificationProvider";
const Notification = () => {
const {message, open, setOpen}=useNotification();
  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      autoHideDuration={4000}
      open={open}
      onClose={() => setOpen(!open)}
      message={message}
    />
  );
};

export default Notification;
