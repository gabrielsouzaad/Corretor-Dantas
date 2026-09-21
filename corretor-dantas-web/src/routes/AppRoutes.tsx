import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Home from "../pages/Home/Home";
import Properties from "../pages/Properties/Properties";
import Login from "../pages/Login/Login";
import Admin from "../pages/Admin/Admin";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/imoveis" element={<Properties />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;