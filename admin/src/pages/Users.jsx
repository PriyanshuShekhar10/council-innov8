import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Assuming you're using react-router-dom for routing
import axios from "axios";
import Navbar from "../components/Navbar/Navbar";

export default function Candidate() {
  const { id } = useParams(); // Get the ID from the route
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCandidate();
  }, [id]);

  const fetchCandidate = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/candidate/${id}`,
        { withCredentials: true }
      );
      if (response.data.ok) {
        setCandidate(response.data.data);
      } else {
        setError("Failed to load candidate data.");
      }
    } catch (error) {
      console.error("Error fetching candidate:", error);
      setError("An error occurred while fetching candidate data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!candidate) {
    return <div>No candidate found.</div>;
  }

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h1>Candidate Details</h1>
        <div className={styles.detailSection}>
          <p>
            <strong>Name:</strong> {candidate.name}
          </p>
          <p>
            <strong>Email:</strong> {candidate.email}
          </p>
          <p>
            <strong>Position:</strong> {candidate.position}
          </p>
          {/* Add other relevant details here */}
        </div>
      </div>
    </>
  );
}
