import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
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

          <Link to="/login" className="navbar-login">
            Entrar
          </Link>
        </nav>

      </div>
    </header>
  );
}

export default Navbar;