import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Home from "../pages/Home/Home";
import Properties from "../pages/Properties/Properties";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/imoveis" element={<Properties />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;