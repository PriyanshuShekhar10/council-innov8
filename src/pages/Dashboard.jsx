import { Link } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import "./Dashboard.css"; // Import CSS for styling

export default function Dashboard({ adminName = "Admin" }) {
  // Define the new links for the three tiles
  const links = [
    {
      path: "/reservations",
      name: "Candidates",
      description: "View and manage all candidates.",
      bgColor: "#4CAF50", // Green
    },
    {
      path: "/movies",
      name: "Shortlisted",
      description: "View shortlisted candidates.",
      bgColor: "#2196F3", // Blue
    },
    {
      path: "/advertisement",
      name: "Fraudulent",
      description: "Manage and review fraudulent activities.",
      bgColor: "#f44336", // Red
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
