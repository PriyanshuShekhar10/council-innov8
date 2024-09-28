import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import WorkIcon from "@mui/icons-material/Work"; // Adjust this import based on your icons
import SchoolIcon from "@mui/icons-material/School"; // Adjust this import based on your icons
import StarIcon from "@mui/icons-material/Star"; // Adjust this import based on your icons
import styles from "./CandidateDetails.module.css"; // Assuming you still have your CSS module

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
    <div className={styles.container}>
      {/* Left side - 25% */}
      <div className={styles.leftPanel}>
        <div>
          <img
            src="https://via.placeholder.com/150"
            alt="Avatar"
            className={styles.avatar}
          />
        </div>
        <div className={styles.details}>
          <h2>Candidate Details</h2>
          <p>
            <strong>ID:</strong> {id}
          </p>
          <p>
            <strong>Name:</strong> John Doe
          </p>
          <p>
            <strong>Job Title:</strong> Software Engineer
          </p>
        </div>
        <div className={styles.skills}>
          <h3>Skills</h3>
          {candidate?.skills && candidate.skills.length > 0 ? (
            <ul>
              {candidate.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          ) : (
            <p>No skills listed.</p>
          )}
        </div>
      </div>

      {/* Right side - 75% */}
      <div className={styles.rightPanel}>
        <h2 className={styles.sectionTitle}>Work Experience</h2>
        {candidate?.work_experience && candidate.work_experience.length > 0 ? (
          <VerticalTimeline>
            {candidate.work_experience.map((experience, index) => (
              <VerticalTimelineElement
                key={index}
                className="vertical-timeline-element--work"
                contentStyle={{
                  background: "rgb(33, 150, 243)",
                  color: "#fff",
                }}
                contentArrowStyle={{
                  borderRight: "7px solid  black",
                }}
                date={
                  <span style={{ color: "black" }}>{experience.duration}</span>
                }
                iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
                icon={<WorkIcon />}
              >
                <h3 className="vertical-timeline-element-title">
                  <span>{experience.job_title}</span>
                </h3>
                <h4 className="vertical-timeline-element-subtitle">
                  {experience.location}
                </h4>
                <p>
                  <span style={{ color: "black" }}>
                    {experience.responsibilities}
                  </span>
                </p>
              </VerticalTimelineElement>
            ))}
            <VerticalTimelineElement
              iconStyle={{ background: "rgb(16, 204, 82)", color: "#fff" }}
              icon={<StarIcon />}
            />
          </VerticalTimeline>
        ) : (
          <p>No work experience available.</p>
        )}

        <h2 className={styles.sectionTitle}>Education</h2>
        {candidate?.education && candidate.education.length > 0 ? (
          <VerticalTimeline>
            {candidate.education.map((education, index) => (
              <VerticalTimelineElement
                key={index}
                className="vertical-timeline-element--education"
                contentStyle={{ background: "rgb(233, 30, 99)", color: "#fff" }}
                contentArrowStyle={{
                  borderRight: "7px solid  rgb(233, 30, 99)",
                }}
                date={education.graduation_year}
                iconStyle={{ background: "rgb(233, 30, 99)", color: "#fff" }}
                icon={<SchoolIcon />}
              >
                <h3 className="vertical-timeline-element-title">
                  {education.degree}
                </h3>
                <h4 className="vertical-timeline-element-subtitle">
                  {education.institution}
                </h4>
                <p>{/* Add additional education details if available */}</p>
              </VerticalTimelineElement>
            ))}
          </VerticalTimeline>
        ) : (
          <p>No education details available.</p>
        )}
      </div>
    </div>
  );
};

export default CandidateDetails;
