import { Link, useLocation } from "react-router";
import { publicNavControls } from "../../services/utils/config";

const Nav = () => {
  const { pathname } = useLocation();

  return (
    <nav>
      <ul className="flex flex-col lg:flex-row gap-3">
        {publicNavControls.map(({ label, destination }) => {
          const isActive = pathname === destination;

          const linkStyle = `
            tracking-wider cursor-pointer transition-all duration-200 hover:scale-105 text-sm
            text-center lg:text-normal w-full
            border lg:border-0
            hover:bg-gray-100 lg:px-6 py-2 rounded-md
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
