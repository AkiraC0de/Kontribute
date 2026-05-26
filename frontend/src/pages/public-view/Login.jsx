import Form from "../../components/public-view/login/form"
import Hero from "../../components/public-view/login/hero"
import Input from "../../components/ui/Input"

const Login = () => {
  return (
    <div className="grid grid-cols-2 h-full bg-gray-200">
      <div>
        <Form/>
      </div>
      <Hero/>
    </div>
  )
}
export default Login