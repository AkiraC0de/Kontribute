import { Outlet } from "react-router";
import Header from "./header";

const PublicLayout = () => {
  return (
    <main className="flex flex-col min-h-screen w-full">
      <Header/>
      <h1>PUBLIC VIEW</h1>
      <Outlet/>
    </main>
  )
}
export default PublicLayout