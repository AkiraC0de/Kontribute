import { Outlet } from "react-router";

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <h1>PUBLIC VIEW</h1>
      <Outlet/>
    </div>
  )
}
export default PublicLayout