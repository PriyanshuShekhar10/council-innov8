import React, { useState, useEffect } from "react";
import axios from "axios";

const CandidatesTable = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);

  useEffect(() => {
    // Fetch candidates from the API
    const fetchCandidates = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/candidates");
        setCandidates(response.data);
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
  const handleBulkAction = (action) => {
    setCandidates((prevCandidates) =>
      prevCandidates.map((candidate) =>
        selectedCandidates.includes(candidate.id)
          ? { ...candidate, status: action }
          : candidate
      )
    );
    setSelectedCandidates([]); // Clear selections after action
  };

  // Function to generate a random fraud index
  const generateFraudIndex = () => (Math.random() * 100).toFixed(2);

  return (
    <div className="table-container">
      <div className="bulk-action">
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
      <table className="candidates-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={(e) =>
                  setSelectedCandidates(
                    e.target.checked ? candidates.map((c) => c.id) : []
                  )
                }
                checked={
                  selectedCandidates.length === candidates.length &&
                  candidates.length > 0
                }
              />
            </th>
            <th>Id No</th>
            <th>Name</th>
            <th>Latest Job Title</th>
            <th>Status</th>
            <th>Fraud Index</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate) => {
            const status = candidate.status || "Pending"; // Default status is "Pending"
            return (
              <tr key={candidate.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedCandidates.includes(candidate.id)}
                    onChange={(e) => handleCheckboxChange(e, candidate.id)}
                  />
                </td>
                <td>{candidate.id}</td>
                <td>Dummy Name</td> {/* Since the name isn't provided in the JSON */}
                <td>{candidate.work_experience[0]?.job_title || "N/A"}</td>
                <td>{status}</td>
                <td>{generateFraudIndex()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CandidatesTable;
