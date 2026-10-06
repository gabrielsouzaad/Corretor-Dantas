import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary";
import Home from "../pages/Home/Home";
import Properties from "../pages/Properties/Properties";
import Login from "../pages/Login/Login";
import Admin from "../pages/Admin/Admin";
import PropertyDetails from "../pages/PropertyDetails/PropertyDetails";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/imoveis" element={<Properties />} />
        <Route path="/imoveis/:id" element={<PropertyDetails />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute adminOnly />}>
          <Route
            path="/admin"
            element={
              <ErrorBoundary>
                <Admin />
              </ErrorBoundary>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;