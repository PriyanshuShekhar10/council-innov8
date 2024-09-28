import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Cinema() {
  const [screenData, setScreenData] = useState({
    name: "",
    location: "",
    city: "Delhi",
    screenType: "",
  });

  const [scheduleData, setScheduleData] = useState({
    screenId: "",
    movieId: "",
    showTime: "",
    showDate: "",
  });

  const [movies, setMovies] = useState([]);
  const [screens, setScreens] = useState([]);

  // Fetch available movies and screens
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get("http://localhost:8000/movie/movies", {
          withCredentials: true,
        });
        if (response.data.ok) {
          setMovies(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    const fetchScreens = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/movie/screensbycity/Delhi",
          { withCredentials: true }
        );
        if (response.data.ok) {
          setScreens(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching screens:", error);
      }
    };

    fetchMovies();
    fetchScreens();
  }, []);

  const handleScreenChange = (e) => {
    const { name, value } = e.target;
    setScreenData({
      ...screenData,
      [name]: value,
    });
  };

  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setScheduleData({
      ...scheduleData,
      [name]: value,
    });
  };

  const createScreen = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/movie/createscreen",
        screenData,
        { withCredentials: true }
      );
      if (response.data.ok) {
        alert("Screen added successfully!");
      } else {
        alert("Failed to add screen.");
      }
    } catch (error) {
      console.error("Error creating screen:", error);
      alert("An error occurred while creating the screen.");
    }
  };

  const addMovieSchedule = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/movie/addmoviescheduletoscreen",
        scheduleData,
        { withCredentials: true }
      );
      if (response.data.ok) {
        alert("Movie schedule added successfully!");
      } else {
        alert("Failed to add movie schedule.");
      }
    } catch (error) {
      console.error("Error adding movie schedule:", error);
      alert("An error occurred while adding the movie schedule.");
    }
  };

  return (
    <div>
      <h2>Add New Screen</h2>
      <form onSubmit={createScreen}>
        <div>
          <label>Screen Name:</label>
          <input
            type="text"
            name="name"
            value={screenData.name}
            onChange={handleScreenChange}
            required
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={screenData.location}
            onChange={handleScreenChange}
            required
          />
        </div>
        <div>
          <label>Screen Type:</label>
          <input
            type="text"
            name="screenType"
            value={screenData.screenType}
            onChange={handleScreenChange}
            required
          />
        </div>
        <button type="submit">Create Screen</button>
      </form>

      <h2>Add Movie Schedule to Screen</h2>
      <form onSubmit={addMovieSchedule}>
        <div>
          <label>Screen:</label>
          <select
            name="screenId"
            value={scheduleData.screenId}
            onChange={handleScheduleChange}
            required
          >
            <option value="">Select Screen</option>
            {screens.length === 0 ? (
              <option disabled>No screens available</option>
            ) : (
              screens.map((screen) => (
                <option key={screen._id} value={screen._id}>
                  {screen.name} - {screen.location}
                </option>
              ))
            )}
          </select>
        </div>
        <div>
          <label>Movie:</label>
          <select
            name="movieId"
            value={scheduleData.movieId}
            onChange={handleScheduleChange}
            required
          >
            <option value="">Select Movie</option>
            {movies.length === 0 ? (
              <option disabled>No movies available</option>
            ) : (
              movies.map((movie) => (
                <option key={movie._id} value={movie._id}>
                  {movie.title}
                </option>
              ))
            )}
          </select>
        </div>
        <div>
          <label>Show Time:</label>
          <input
            type="time"
            name="showTime"
            value={scheduleData.showTime}
            onChange={handleScheduleChange}
            required
          />
        </div>
        <div>
          <label>Show Date:</label>
          <input
            type="date"
            name="showDate"
            value={scheduleData.showDate}
            onChange={handleScheduleChange}
            required
          />
        </div>
        <button type="submit">Add Schedule</button>
      </form>
    </div>
  );
}
