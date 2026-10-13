import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { isAdmin } from "../../utils/auth";
import "./Navbar.css";

function Navbar() {
  useLocation();

  const logged = isAdmin();

  return (
    <header className="navbar">
      <div className="navbar-container">

        <Link to="/" className="navbar-logo">
          Corretor Dantas
        </Link>

        <nav className="navbar-menu">
          <Link to="/" className="navbar-link">
            Início
          </Link>

          <Link to="/imoveis" className="navbar-link">
            Imóveis
          </Link>

          <ThemeToggle />

          {logged ? (
            <Link to="/admin" className="navbar-login">
              Painel
            </Link>
          ) : (
            <Link to="/login" className="navbar-login">
              Entrar
            </Link>
          )}
        </nav>

      </div>
    </header>
  );
}

export default Navbar;