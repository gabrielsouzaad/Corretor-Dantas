import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <main className="home">

      <section className="home-hero">

        <div className="home-hero-content">

          <span className="home-subtitle">
            CORRETOR DANTAS
          </span>

          <h1>
            Encontre o imóvel
            <br />
            ideal para você
          </h1>

          <p>
            Encontre casas, apartamentos, terrenos e imóveis
            comerciais para comprar ou alugar.
          </p>

          <div className="home-actions">
            <Link to="/imoveis" className="home-primary-button">
              Ver imóveis
            </Link>
          </div>

        </div>

      </section>

    </main>
  );
}

export default Home;