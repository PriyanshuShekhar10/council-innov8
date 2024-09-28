import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const CandidateDetails = () => {
  const { id } = useParams(); // Extract the id from the URL
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/candidates/${id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setCandidate(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Candidate Details</h1>
      {candidate ? (
        <div>
          <p>
            <strong>Name:</strong> {candidate.name}
          </p>
          <p>
            <strong>Email:</strong> {candidate.email}
          </p>
          <p>
            <strong>Position:</strong> {candidate.position}
          </p>
          {/* Add more fields as necessary */}
        </div>
      ) : (
        <p>No candidate data available</p>
      )}
    </div>
  );
};

export default CandidateDetails;
