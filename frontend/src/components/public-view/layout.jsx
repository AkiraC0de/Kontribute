import { Outlet } from "react-router";
import Header from "./header";

const PublicLayout = () => {
  return (
    <main className="flex flex-col w-full min-h-screen">
      <Header/>
      <div className="flex flex-col flex-1 px-5 pt-15">
        <Outlet/>
      </div>
    </main>
  )
}
export default PublicLayout