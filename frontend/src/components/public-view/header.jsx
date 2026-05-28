import { useState } from "react";
import { Link } from "react-router";
import { LogIn, Menu, PenLine, X } from "lucide-react";
import PrimaryButton from "../ui/PrimaryButton";
import SecondaryButton from "../ui/SecondayButton";
import { motion, AnimatePresence, scale } from "motion/react";
import Nav from "./nav";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  // Dropdown animation variants
  const menuVariants = {
  closed: { 
    height: "0px", 
    transition: { duration: 0.1, ease: "easeInOut" }
  },
  open: { 
    height: "auto", 
    opacity: 1,
    transition: {  opacity: { duration: 0.2 } }
  }
};

  return (
    <>
      <header className="fixed top-0 w-full z-100 px-5 py-5 flex items-center justify-between bg-white h-18 shadow-sm">
        <div className="flex-1 flex">
          <Link to={"/"} onClick={closeMenu}>
            <h1 className="text-primary bg-white text-xl font-extrabold font-poppins tracking-tight">
              Kontribute
            </h1>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          className="lg:hidden text-gray-700 focus:outline-none p-2 z-50"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Navigation"
        >
          {isMenuOpen ? (
            <X className="w-7 h-7" />
          ) : (
            <Menu className="w-7 h-7" />
          )}
        </motion.button>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden lg:flex lg:flex-2 lg:items-center lg:ml-10">
          <div className="flex w-full lg:flex-row lg:justify-end lg:gap-10 lg:items-center">
            <div onClick={closeMenu}>
              <Nav />
            </div>

            <div className="flex lg:flex-row lg:space-x-4">
              <Link to="/auth/login">
                <SecondaryButton>Login</SecondaryButton>
              </Link>
              <Link to="/auth/register">
                <PrimaryButton>Register</PrimaryButton>
              </Link>
            </div>
          </div>
        </div>

        {/* MOBILE NAVIGATION DROPDOWN */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="absolute top-18 overflow-hidden left-0 w-full bg-white flex flex-col p-5 pt-1 border-b shadow-md rounded-b-2xl lg:hidden"
            >
              <div className="flex flex-col w-full">
                <div onClick={closeMenu}>
                  <Nav />
                </div>

                <div className="flex flex-col mt-4 text-sm">
                  <Link to="/auth/login" className="flex gap-2 text-black py-3 group" onClick={closeMenu}>
                    <LogIn className="group-hover:scale-120 transition-all duration-200" size={22}/>
                    <span>Login</span>
                  </Link>
                  <Link to="/auth/register" className="flex gap-2 text-black py-3" onClick={closeMenu}>
                    <PenLine size={22}/>
                    <span>Register</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* MOBILE BACKDROP OVERLAY WITH FADE */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMenu}
            className="lg:hidden fixed inset-0 z-99 bg-black/40"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;