import { useContext } from "react";
import { SnackbarNotificationContext } from "../components/SnackbarNotificationWrapper";

const useSnackbarNotification = () => {
  return useContext(SnackbarNotificationContext);
}

export default useSnackbarNotification