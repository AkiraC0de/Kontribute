import { Outlet } from "react-router";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <h1>MAIN VIEW</h1>
      <Outlet/>
    </div>
  )
}
export default MainLayout