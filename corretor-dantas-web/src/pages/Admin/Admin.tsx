import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { removeToken } from "../../utils/auth";
import PropertyForm from "./PropertyForm";
import PropertyList from "./PropertyList";
import "./Admin.css";

function Admin() {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  function handleLogout() {
    removeToken();
    navigate("/login");
  }

  return (
    <main className="admin-page">
      <section className="admin-container">

        <div className="admin-header">
          <div>
            <span className="admin-subtitle">
              CORRETOR DANTAS
            </span>

            <h1>Painel Administrativo</h1>

            <p>
              Gerencie os imóveis cadastrados no sistema.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="admin-logout"
          >
            Sair
          </button>
        </div>

        <PropertyForm
          onSuccess={() => setRefreshKey((key) => key + 1)}
        />

        <PropertyList refreshKey={refreshKey} />

      </section>
    </main>
  );
}

export default Admin;