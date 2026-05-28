import authService from "../../services/api/authService";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { logoutUser } from "../../services/store/authSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    navigate("/auth/login", { replace: true, state: null });

    setTimeout(() => {
      dispatch(logoutUser());
    }, 100);
  }

  return (
    <div>
      <button onClick={handleLogout}>
        Logout
      </button>

      <button onClick={() => navigate("/")}>
        Landing
      </button>
    </div>
  )
}
export default Dashboard