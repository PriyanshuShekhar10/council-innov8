import { BrowserRouter, Route, Routes } from "react-router-dom";
import Cinema from "./pages/Cinema";
import Advertisement from "./pages/Advertisement";
import Dashboard from "./pages/Dashboard";
import Reservations from "./pages/Reservations";
import Users from "./pages/Users";
import Movies from "./pages/Movies";
import SidebarComponent from "./components/SidebarComponent";
import "./App.css";
import Login from "./pages/Login/Login";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <SidebarComponent>
          <Routes>
            <Route path="/advertisement" element={<Advertisement />} />
            <Route path="/cinema" element={<Cinema />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/users" element={<Users />} />
          </Routes>
        </SidebarComponent>
        <Routes>
          {/* Login Route without Sidebar */}
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
