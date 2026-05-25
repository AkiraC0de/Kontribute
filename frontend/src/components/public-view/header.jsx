import PrimaryButton from "../ui/PrimaryButton"
import Nav from "./nav"

const Header = () => {
  return (
    <header className="px-10 py-5 flex justify-between items-center h-20">
      <div>
        <h1 className="text-main text-2xl font-extrabold tracking-tight">Kontribute</h1>
      </div>
      <Nav/>
      <div>
        <PrimaryButton>
          Get Started
        </PrimaryButton>
      </div>
    </header>
  )
}
export default Header