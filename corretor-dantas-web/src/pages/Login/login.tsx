import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await login(email, password);

      localStorage.setItem("token", data.token);

      navigate("/admin");

    } catch {
      setError(
        "E-mail ou senha inválidos."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">

        <div className="login-header">
          <span className="login-subtitle">
            CORRETOR DANTAS
          </span>

          <h1>Entrar</h1>

          <p>
            Acesse sua conta para continuar.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="login-form"
        >

          <div className="login-field">
            <label htmlFor="email">
              E-mail
            </label>

            <input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">
              Senha
            </label>

            <input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
            />
          </div>

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

        </form>

      </section>
    </main>
  );
}

export default Login;