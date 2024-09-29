import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CandidatesTable = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [candidatesPerPage] = useState(10); // Number of candidates per page
  const [searchId, setSearchId] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch candidates from the API
    const fetchCandidates = async () => {
      try {
        // Fetch all candidates
        const candidatesResponse = await axios.get("http://localhost:3000/api/candidates");

        // Fetch all shortlisted candidates
        const shortlistedResponse = await axios.get("http://localhost:3000/api/shortlist");
        const shortlistedIds = new Set(shortlistedResponse.data.map(item => item.candidateId));

        // Fetch all fraudulent candidates
        const fraudulentResponse = await axios.get("http://localhost:3000/api/flag");
        const fraudulentIds = new Set(fraudulentResponse.data.map(item => item.candidateId));

        // Filter out candidates who are shortlisted or marked as fraudulent
        const filteredCandidates = candidatesResponse.data
          .filter(candidate => 
            !shortlistedIds.has(candidate.id) && 
            !fraudulentIds.has(candidate.id) &&
            candidate.work_experience[0]?.job_title && // Exclude candidates with no job title
            candidate.work_experience[0]?.job_title.toLowerCase() !== "n/a" // Exclude "N/A" job titles
          );

        // Remove duplicates by ID and sort by ID
        const uniqueCandidates = Array.from(new Set(filteredCandidates.map(c => c.id)))
          .map(id => filteredCandidates.find(c => c.id === id))
          .sort((a, b) => a.id - b.id);

        setCandidates(uniqueCandidates);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };

    fetchCandidates();
  }, []);

  // Handle checkbox selection
  const handleCheckboxChange = (event, candidateId) => {
    if (event.target.checked) {
      setSelectedCandidates((prev) => [...prev, candidateId]);
    } else {
      setSelectedCandidates((prev) =>
        prev.filter((id) => id !== candidateId)
      );
    }
  };

  // Handle bulk action
  const handleBulkAction = async (action) => {
    const url = action === "Shortlisted" ? "/api/shortlist" : "/api/flag";
    try {
      for (const candidateId of selectedCandidates) {
        await axios.post(`http://localhost:3000${url}`, {
          candidateId,
        });
      }
      // Remove marked candidates from the current list
      setCandidates((prevCandidates) =>
        prevCandidates.filter((candidate) => !selectedCandidates.includes(candidate.id))
      );
      setSelectedCandidates([]); // Clear selections after action
    } catch (error) {
      console.error(`Error during ${action}:`, error);
    }
  };

  // Function to generate a random fraud index
  const generateFraudIndex = () => (Math.random() * 100).toFixed(2);

  // Calculate pagination variables
  const indexOfLastCandidate = currentPage * candidatesPerPage;
  const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
  const currentCandidates = candidates.slice(
    indexOfFirstCandidate,
    indexOfLastCandidate
  );

  const totalPages = Math.ceil(candidates.length / candidatesPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchId(event.target.value);
  };

  // Handle search submit
  const handleSearchSubmit = () => {
    const candidateIndex = candidates.findIndex(
      (candidate) => candidate.id.toString() === searchId
    );

    if (candidateIndex !== -1) {
      const page = Math.ceil((candidateIndex + 1) / candidatesPerPage);
      setCurrentPage(page);
    } else {
      alert("ID not found");
    }
  };

  const getPaginationButtons = () => {
    const buttons = [];

    // First Page Button
    buttons.push(
      <button
        key="first"
        onClick={() => paginate(1)}
        disabled={currentPage === 1}
      >
        First
      </button>
    );

    // Previous Page Index
    if (currentPage > 1) {
      buttons.push(
        <button
          key="prev-page"
          onClick={() => paginate(currentPage - 1)}
        >
          {currentPage - 1}
        </button>
      );
    }

    // Current Page Index
    buttons.push(
      <button
        key="current"
        className="active"
      >
        {currentPage}
      </button>
    );

    // Next Page Index
    if (currentPage < totalPages) {
      buttons.push(
        <button
          key="next-page"
          onClick={() => paginate(currentPage + 1)}
        >
          {currentPage + 1}
        </button>
      );
    }

    // Last Page Button
    buttons.push(
      <button
        key="last"
        onClick={() => paginate(totalPages)}
        disabled={currentPage === totalPages}
      >
        Last
      </button>
    );

    return buttons;
  };

  // Handle row click to navigate to candidate detail page
  const handleRowClick = (candidateId) => {
    navigate(`/candidates/${candidateId}`);
  };

  return (
    <div className="table-container">
      <div className="bulk-action">
        <div className="left-buttons">
          <button
            onClick={() => handleBulkAction("Shortlisted")}
            disabled={selectedCandidates.length === 0}
          >
            Mark as Shortlisted
          </button>
          <button
            onClick={() => handleBulkAction("Fraud")}
            disabled={selectedCandidates.length === 0}
          >
            Mark as Fraud
          </button>
        </div>
        <div className="search-sort-filter">
          <button onClick={() => alert("Sort functionality coming soon!")}>
            Sort
          </button>
          <button onClick={() => alert("Filter functionality coming soon!")}>
            Filter
          </button>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by ID"
              value={searchId}
              onChange={handleSearchChange}
            />
            <button onClick={handleSearchSubmit}>Search</button>
          </div>
        </div>
      </div>
      <table className="candidates-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={(e) =>
                  setSelectedCandidates(
                    e.target.checked ? currentCandidates.map((c) => c.id) : []
                  )
                }
                checked={
                  selectedCandidates.length === currentCandidates.length &&
                  currentCandidates.length > 0
                }
              />
            </th>
            <th>Id No</th>
            <th>Name</th>
            <th>Latest Job Title</th>
            <th>Fraud Index</th>
          </tr>
        </thead>
        <tbody>
          {currentCandidates.map((candidate) => {
            const fraudIndex = generateFraudIndex();
            const isHighFraud = fraudIndex > 60;

            return (
              <tr
                key={candidate.id}
                className={isHighFraud ? "high-fraud" : ""}
                onClick={() => handleRowClick(candidate.id)} // Navigate on row click
                style={{ cursor: "pointer" }} // Add pointer cursor for better UX
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedCandidates.includes(candidate.id)}
                    onChange={(e) => handleCheckboxChange(e, candidate.id)}
                    onClick={(e) => e.stopPropagation()} // Prevent row click when checkbox is clicked
                  />
                </td>
                <td>{candidate.id}</td>
                <td>Dummy Name</td> {/* Since the name isn't provided in the JSON */}
                <td>{candidate.work_experience[0]?.job_title || "N/A"}</td>
                <td>{fraudIndex}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination">
        {getPaginationButtons()}
      </div>
    </div>
  );
};

export default CandidatesTable;
