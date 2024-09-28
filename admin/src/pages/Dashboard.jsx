import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import "./Dashboard.css"; // Import CSS for styling
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import CandidatesTable from "../components/CandidatesTable"; // Import the table component

// Register the required components for Chart.js
Chart.register(ArcElement, Tooltip, Legend);

export default function Dashboard({ adminName = "Admin" }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

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

  // Define data for the pie charts
  const pieData1 = {
    labels: ["0-2 Years", "3-5 Years", "6+ Years"],
    datasets: [
      {
        data: [30, 40, 30],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const pieData2 = {
    labels: ["Genuine", "Fraudulent"],
    datasets: [
      {
        data: [90, 10],
        backgroundColor: ["#4BC0C0", "#FF6384"],
      },
    ],
  };

  const pieData3 = {
    labels: ["JavaScript", "Python", "Java", "Others"],
    datasets: [
      {
        data: [40, 25, 20, 15],
        backgroundColor: ["#36A2EB", "#FFCE56", "#4BC0C0", "#FF6384"],
      },
    ],
  };

  return (
    <>
      <Navbar />
      <div className={`dashboard ${isDarkMode ? "dark-mode" : ""}`}>
        <button className="dark-mode-toggle" onClick={toggleDarkMode}>
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
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
        {/* Pie Charts Section */}
        <div className="pie-chart-row">
          <div className="pie-chart">
            <h3>Work Experience</h3>
            <Pie data={pieData1} />
          </div>
          <div className="pie-chart">
            <h3>Fraudulent Percentage</h3>
            <Pie data={pieData2} />
          </div>
          <div className="pie-chart">
            <h3>Top Skills by Count</h3>
            <Pie data={pieData3} />
          </div>
        </div>
        {/* Candidates Table Section */}
        <CandidatesTable />
      </div>
    </>
  );
}
