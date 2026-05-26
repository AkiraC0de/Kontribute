import { Outlet } from "react-router";
import Header from "./header";

const PublicLayout = () => {
  return (
    <main className="flex flex-col min-h-screen w-full">
      <Header/>
      <div className="px-10 pt-20">
        <Outlet/>
      </div>
    </main>
  )
}
export default PublicLayout