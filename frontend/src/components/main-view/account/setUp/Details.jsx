import { accountSetUpDetailsControls } from "../../../../services/utils/config"
import Input from "../../../ui/Input"

const Details = () => {
  return (
    <div className="w-full h-full flex flex-col items-start">
      <h1 className="text-2xl font-medium text-primary">Enter your details</h1>
      <div className="w-full space-y-4">
        {
          accountSetUpDetailsControls.map(control => (
            <Input
              key={control.name}
              className="w-full"
              label={control.label}
              name={control.name}
              placeholder={control.placeholder}
            />
          ))
        }
      </div>
    </div>
  )
}
export default Details