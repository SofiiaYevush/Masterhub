import React from 'react';
import { Link, useLocation } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();

  // Розділити шлях за слешами
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="breadcrumbs">
      <Link to="/">Home</Link>
      {pathnames.map((name, index) => {
        const routeTo = "/" + pathnames.slice(0, index + 1).join("/");
        const isLast = index === pathnames.length - 1;
        return isLast ? (
          <span key={index}> / {decodeURIComponent(name)}</span>
        ) : (
          <span key={index}>
            {" "}
            / <Link to={routeTo}>{decodeURIComponent(name)}</Link>
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
