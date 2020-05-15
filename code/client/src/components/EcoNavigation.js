import React from "react";
import { Link } from "@reach/router";
//Show Nav Menu
const EcoNav = ({ links }) => {
  return (
    <nav>
      <ul className="eco-navigation">
        {links.map((link) => (
          <li key={link.name.replace(" ", "")}>
            <Link to={link.url}>{link.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default EcoNav;
