import Spinner from "./Spinner"

const FullPageSpinner = () => {
  console.log("FULL PAGE LOADING")
  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <Spinner />
    </div>
  )
}
export default FullPageSpinner