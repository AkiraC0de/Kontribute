import { ChevronLeft } from "lucide-react"
import PrimaryButton from "../../components/ui/PrimaryButton"

const NotFound = () => {
  const handleBack = () => {
     window.history.back();
  }

  return (
    <div className="flex flex-col pt-50 items-center gap-10 p-6">
      <div className="text-center">
        <h1 className="text-5xl lg:text-6xl font-bold">Opps, <span className="text-primary">nothing</span> here... </h1>
        <p className="mt-5">We can't seem to find the page you are looking for. Try going back to previous page.</p>
      </div>
      <PrimaryButton className="pl-3 flex gap-2 items-center" onClick={handleBack}>
        <ChevronLeft/>
        <span>Previous page</span>
      </PrimaryButton>
    </div>
  )
}
export default NotFound