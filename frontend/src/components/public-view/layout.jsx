import { Outlet } from "react-router";
import Header from "./header";

const PublicLayout = () => {
  return (
    <main className="flex flex-col min-h-screen w-full">
      <Header/>
      <Outlet/>
    </main>
  )
}
export default PublicLayout