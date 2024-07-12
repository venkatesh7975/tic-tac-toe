// Header.js
import React from "react";
import { Link } from "react-router-dom";

const Header = ({ isLoggedIn, onLogout }) => {
  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid bg-dark ">
          <Link className="navbar-brand text-light" to="/">
            TikTakToe
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
