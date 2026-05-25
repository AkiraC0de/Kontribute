import { Link, useLocation } from "react-router";
import { publicNavControls } from "../../services/utils/config";

const Nav = () => {
  const { pathname } = useLocation();

  return (
    <nav>
      <ul className="flex gap-10">
        {publicNavControls.map(({ label, destination }) => {
          const isActive = pathname === destination;

          const linkStyle = `
            tracking-wider cursor-pointer transition-all duration-200 hover:scale-110
            ${isActive ? "font-bold" : "font-normal"}
          `.trim();

          return (
            <li key={label} className={linkStyle}>
              <Link to={destination}>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Nav;