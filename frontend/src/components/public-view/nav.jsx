import { Link, useLocation } from "react-router";
import { publicNavControls } from "../../services/utils/config";

const Nav = () => {
  const { pathname } = useLocation();

  return (
    <nav>
      <ul className="flex flex-col lg:flex-row">
        {publicNavControls.map(({ label, destination }) => {
          const isActive = pathname === destination;

          const linkStyle = `
            tracking-wider cursor-pointer transition-all duration-200 lg:hover:scale-105 text-sm
            w-full
            border-t-1 border-gray-300 lg:border-none text-black
            hover:bg-gray-100 lg:px-6 py-3 lg:py-2 lg:rounded-md
            ${isActive ? "font-bold" : "font-normal"}
          `.trim();

          return (
            <Link key={label} to={destination}>
              <li className={linkStyle}>
                {label}
              </li>
            </Link>
          );
        })}
      </ul>
    </nav>
  );
};

export default Nav;
