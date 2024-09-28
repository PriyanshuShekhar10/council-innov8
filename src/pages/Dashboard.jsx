/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import "./Dashboard.css"; // Import CSS for styling

export default function Dashboard({ adminName = "Admin" }) {
  // Assuming the admin's name is passed as a prop
  const links = [
    {
      path: "/",
      name: "Dashboard",
      description: "View your control panel.",
      bgColor: "#4CAF50",
    },
    {
      path: "/advertisement",
      name: "Advertisement",
      description: "Manage advertisements.",
      bgColor: "#2196F3",
    },
    {
      path: "/cinema",
      name: "Cinema",
      description: "Cinema configurations and settings.",
      bgColor: "#f44336",
    },
    {
      path: "/movies",
      name: "Movies",
      description: "Edit and update movie listings.",
      bgColor: "#FF9800",
    },
    {
      path: "/reservations",
      name: "Reservations",
      description: "View and manage all reservations.",
      bgColor: "#9C27B0",
    },
    {
      path: "/users",
      name: "Users",
      description: "Manage user accounts and permissions.",
      bgColor: "#3F51B5",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <h1>Welcome, {adminName}!</h1>
        <p style={{ textAlign: "center", margin: "10px", fontSize: "16px" }}>
          Explore the Admin Panel to manage your tasks efficiently.
        </p>
        <div className="dashboard-grid">
          {links.map((link, index) => (
            <Link to={link.path} key={index} style={{ textDecoration: "none" }}>
              <div
                className="dashboard-tile"
                style={{ backgroundColor: link.bgColor }}
              >
                <h2 className="link-description">{link.name}</h2>
                <p className="link-description">{link.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
