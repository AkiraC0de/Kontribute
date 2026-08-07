import { useLocation } from "react-router"

const ResetPasswordVerification = () => {
  const location = useLocation();

  const email = location.state?.email;


  return (
    <div>code has sent to {email}</div>
  )
}
export default ResetPasswordVerification