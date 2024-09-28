import { useState } from "react";
import {
  FaBars,
  FaBook,
  FaTh,
  FaThinkPeaks,
  FaTv,
  FaUsers,
} from "react-icons/fa";
import { MdMovieEdit } from "react-icons/md";
import { NavLink } from "react-router-dom";

export default function SidebarComponent({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const menuItem = [
    { path: "/", name: "Dashboard", icon: <FaTh /> },
    { path: "/reservations", name: "Candidates", icon: <FaBook /> },
    { path: "/movies", name: "Shortlisted", icon: <MdMovieEdit /> },
    { path: "/advertisement", name: "Fraudelent", icon: <FaThinkPeaks /> },
    { path: "/cinema", name: "Network Analysis", icon: <FaTv /> },
    
    
    // { path: "/users", name: "Users", icon: <FaUsers /> },
  ];

  return (
    <div className="container">
      <div style={{ width: isOpen ? "300px" : "50px" }} className="sidebar">
        <div className="top_section">
          <h1 style={{ display: isOpen ? "block" : "none" }} className="logo">
            Satya
          </h1>
          <div style={{ marginLeft: isOpen ? "30px" : 0 }} className="bars">
            <FaBars onClick={toggle} />
          </div>
        </div>

        {menuItem.map((item, index) => (
          <NavLink
            to={item.path}
            key={index}
            className="link"
            activeclassname="active"
          >
            <div className="items" style={{ fontSize: "20px" }}>
              {item.icon}
            </div>
            <div className="link_text">{item.name}</div>
          </NavLink>
        ))}
      </div>

      <main>{children}</main>
    </div>
  );
}
