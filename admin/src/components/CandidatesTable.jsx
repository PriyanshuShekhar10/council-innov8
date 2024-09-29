import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import skills from "../data/unique_skills.json"; // Import the skills from the JSON file

const CandidatesTable = () => {
  const [candidates, setCandidates] = useState([]);
  const [allCandidates, setAllCandidates] = useState([]); // To store all candidates before filtering
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [candidatesPerPage] = useState(10); // Number of candidates per page
  const [searchId, setSearchId] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]); // Store selected skills
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
  const [skillsList, setSkillsList] = useState(skills); // Set skills from the JSON file

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch candidates from the API
    const fetchCandidates = async () => {
      try {
        const candidatesResponse = await axios.get("http://localhost:3000/api/candidates");
        const shortlistedResponse = await axios.get("http://localhost:3000/api/shortlist");
        const fraudulentResponse = await axios.get("http://localhost:3000/api/flag");

        const shortlistedIds = new Set(shortlistedResponse.data.map(item => item.candidateId));
        const fraudulentIds = new Set(fraudulentResponse.data.map(item => item.candidateId));

        const filteredCandidates = candidatesResponse.data
          .filter(candidate => 
            !shortlistedIds.has(candidate.id) && 
            !fraudulentIds.has(candidate.id) &&
            candidate.work_experience[0]?.job_title && 
            candidate.work_experience[0]?.job_title.toLowerCase() !== "n/a" 
          );

        const uniqueCandidates = Array.from(new Set(filteredCandidates.map(c => c.id)))
          .map(id => filteredCandidates.find(c => c.id === id))
          .sort((a, b) => a.id - b.id);

        setCandidates(uniqueCandidates);
        setAllCandidates(uniqueCandidates); // Store all candidates
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };

    fetchCandidates();
  }, []);

  const handleCheckboxChange = (event, candidateId) => {
    if (event.target.checked) {
      setSelectedCandidates((prev) => [...prev, candidateId]);
    } else {
      setSelectedCandidates((prev) =>
        prev.filter((id) => id !== candidateId)
      );
    }
  };

  const handleBulkAction = async (action) => {
    const url = action === "Shortlisted" ? "/api/shortlist" : "/api/flag";
    try {
      for (const candidateId of selectedCandidates) {
        await axios.post(`http://localhost:3000${url}`, {
          candidateId,
        });
      }
      setCandidates((prevCandidates) =>
        prevCandidates.filter((candidate) => !selectedCandidates.includes(candidate.id))
      );
      setSelectedCandidates([]);
    } catch (error) {
      console.error(`Error during ${action}:`, error);
    }
  };

  const generateFraudIndex = () => (Math.random() * 100).toFixed(2);

  const indexOfLastCandidate = currentPage * candidatesPerPage;
  const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
  const currentCandidates = candidates.slice(
    indexOfFirstCandidate,
    indexOfLastCandidate
  );

  const totalPages = Math.ceil(candidates.length / candidatesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearchChange = (event) => {
    setSearchId(event.target.value);
  };

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

    buttons.push(
      <button
        key="first"
        onClick={() => paginate(1)}
        disabled={currentPage === 1}
      >
        First
      </button>
    );

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

    buttons.push(
      <button
        key="current"
        className="active"
      >
        {currentPage}
      </button>
    );

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

  const handleRowClick = (candidateId) => {
    navigate(`/candidates/${candidateId}`);
  };

  const openFilterModal = () => {
    setIsModalOpen(true);
  };

  const closeFilterModal = () => {
    setIsModalOpen(false);
  };

  const handleSkillSelect = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleFilterSubmit = () => {
    const filteredCandidates = allCandidates.filter(candidate =>
      selectedSkills.every(skill =>
        candidate.skills.includes(skill)
      )
    );

    setCandidates(filteredCandidates);
    setIsModalOpen(false);
  };

  const handleClearFilter = () => {
    setCandidates(allCandidates); // Reset to all candidates
    setSelectedSkills([]); // Clear selected skills
    setIsModalOpen(false);
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
          <button onClick={openFilterModal}>
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
                <td>Dummy Name</td>
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

      {/* Filter Modal */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Select Skills to Filter</h3>
            <input
              type="text"
              placeholder="Search skills..."
              onChange={(e) => {
                const searchValue = e.target.value.toLowerCase();
                setSkillsList(skills.filter((skill) =>
                  skill.toLowerCase().includes(searchValue)
                ));
              }}
            />
            <div className="skills-list">
              {skillsList.map((skill) => (
                <div key={skill}>
                  <input
                    type="checkbox"
                    checked={selectedSkills.includes(skill)}
                    onChange={() => handleSkillSelect(skill)}
                  />
                  <label>{skill}</label>
                </div>
              ))}
            </div>
            <button onClick={handleFilterSubmit}>Apply Filter</button>
            <button onClick={handleClearFilter}>Clear Filter</button>
            <button onClick={closeFilterModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidatesTable;
