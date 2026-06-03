import { AlertCircle, ChevronLeft } from "lucide-react"
import Input from "../../../components/ui/Input"
import { useState } from "react"
import { useSelector } from "react-redux"
import { useLocation, Link, useNavigate } from "react-router"
import PrimaryButton from "../../../components/ui/PrimaryButton"
import SecondaryButton from "../../../components/ui/SecondayButton"
import authService from "../../../services/api/authService"
import Spinner from "../../../components/common/Spinner"

const ForgotPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState(location.state?.identifier || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setError("")
    setIdentifier(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      const data = await authService.requestResetPassword(identifier);
      navigate(`/auth/reset-password-verification/${data.sessionToken}`, { state: { message: data.message } })
      console.log(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center my-10">
      <div className="px-8 py-12 flex w-full flex-col gap-10 max-w-110 lg:max-w-none lg:w-110 bg-white rounded-xl overflow-hidden shadow-custom animate-fade-up duration-300">
        <div className="flex items-center w-full flex-col">
          <AlertCircle size={80} className="stroke-primary"/>
          <h1 className="text-black font-medium text-2xl mt-4 mb-2">Forgot Password</h1>
          <p className="text-center">Enter your email or username and we will send you an OTP to reset your password.</p>
        </div>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <Input
            value={identifier}
            onChange={handleChange}
            placeholder="Enter your email or username"
          />
          {error && <p className="text-red-500 text-sm text-center my-4">{error}</p>}
          <PrimaryButton type="submit" className="mt-4">
            {isLoading ? <Spinner color="bg-white"/> : "Submit"}
          </PrimaryButton>
          <Link to="/auth/login">
            <SecondaryButton type="button" className="w-full flex justify-center items-center gap-2">
              <ChevronLeft className="w-5 h-5" />
              <span>Back to login</span>
            </SecondaryButton>
          </Link>
        </form>
      </div>
      {/* Grid background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] mask-[radial-gradient(ellipse_70%_70%_at_50%_50%,#000_40%,transparent_100%)]"></div>  
    </div>
  )
}
export default ForgotPassword