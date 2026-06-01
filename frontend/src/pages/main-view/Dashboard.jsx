import authService from "../../services/api/authService";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { logoutUser } from "../../services/store/authSlice";
import useSnackbarNotification from "../../services/snackbar-notification/hooks/useSnackbarNotification";

const Dashboard = () => {
  const { showNotification } = useSnackbarNotification()
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    dispatch(logoutUser());
  }

  const handleShowNotification = () => {
    showNotification("MESSAGE", "WARNING");
    showNotification("MESSAGE", "INFO");
    showNotification("MESSAGE", "FAILED");
    showNotification("MESSAGE", "SUCCESS");
  }

  return (
    <div>
      <button onClick={handleLogout}>
        Logout
      </button>

      <button className="bg-amber-200 p-4 mt-200" onClick={handleShowNotification}>
        SHOW NOTIF
      </button>

      <button onClick={() => navigate("/")}>
        Landing
      </button>
    </div>
  )
}
export default Dashboard