const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());

// Enable CORS for your frontend URL
app.use(
  cors({
    origin: "http://localhost:5174", // Ensure this matches your frontend's URL
    credentials: true,
  })
);

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://priyanshu:priyanshu@cluster0.qf85m.mongodb.net/Resume",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

// Define Mongoose Schemas and Models
const candidateSchema = new mongoose.Schema({
  objective: String,
  work_experience: Array,
  education: Array,
  skills: Array,
  id: Number,
});

const shortlistedCandidateSchema = new mongoose.Schema({
  candidateId: { type: Number, required: true },
  reason: String, // Optional: Reason for shortlisting
});

const flaggedCandidateSchema = new mongoose.Schema({
  candidateId: { type: Number, required: true },
  reason: String, // Optional: Reason for flagging
});

const Candidate = mongoose.model("Candidate", candidateSchema);
const ShortlistedCandidate = mongoose.model(
  "ShortlistedCandidate",
  shortlistedCandidateSchema
);
const FlaggedCandidate = mongoose.model(
  "FlaggedCandidate",
  flaggedCandidateSchema
);

// Candidate CRUD Operations

// Create a Candidate
app.post("/api/candidates", async (req, res) => {
  const candidate = new Candidate(req.body);
  await candidate.save();
  res.send(candidate);
});

// Get All Candidates
app.get("/api/candidates", async (req, res) => {
  const candidates = await Candidate.find();
  res.send(candidates);
});

// Get Candidate by ID
app.get("/api/candidates/:id", async (req, res) => {
  const candidate = await Candidate.findOne({ id: req.params.id });
  if (!candidate) return res.status(404).send("Candidate not found");
  res.send(candidate);
});

// Update Candidate by ID
app.put("/api/candidates/:id", async (req, res) => {
  const candidate = await Candidate.findOneAndUpdate(
    { id: req.params.id },
    req.body,
    { new: true }
  );
  if (!candidate) return res.status(404).send("Candidate not found");
  res.send(candidate);
});

// Delete Candidate by ID
app.delete("/api/candidates/:id", async (req, res) => {
  const candidate = await Candidate.findOneAndDelete({ id: req.params.id });
  if (!candidate) return res.status(404).send("Candidate not found");
  res.send(candidate);
});

// Shortlisted Candidates CRUD Operations

// Create a Shortlisted Candidate
app.post("/api/shortlist", async (req, res) => {
  const shortlistedCandidate = new ShortlistedCandidate(req.body);
  await shortlistedCandidate.save();
  res.send(shortlistedCandidate);
});

// Get All Shortlisted Candidates
app.get("/api/shortlist", async (req, res) => {
  const shortlistedCandidates = await ShortlistedCandidate.find();
  res.send(shortlistedCandidates);
});

// Get Shortlisted Candidate by ID
app.get("/api/shortlist/:id", async (req, res) => {
  const shortlistedCandidate = await ShortlistedCandidate.findOne({
    candidateId: req.params.id,
  });
  if (!shortlistedCandidate)
    return res.status(404).send("Shortlisted candidate not found");
  res.send(shortlistedCandidate);
});

// Update Shortlisted Candidate by ID
app.put("/api/shortlist/:id", async (req, res) => {
  const shortlistedCandidate = await ShortlistedCandidate.findOneAndUpdate(
    { candidateId: req.params.id },
    req.body,
    { new: true }
  );
  if (!shortlistedCandidate)
    return res.status(404).send("Shortlisted candidate not found");
  res.send(shortlistedCandidate);
});

// Delete Shortlisted Candidate by ID
app.delete("/api/shortlist/:id", async (req, res) => {
  const result = await ShortlistedCandidate.findOneAndDelete({
    candidateId: req.params.id,
  });
  if (!result) return res.status(404).send("Shortlisted candidate not found");
  res.send(result);
});

// Flagged Candidates CRUD Operations

// Create a Flagged Candidate
app.post("/api/flag", async (req, res) => {
  const flaggedCandidate = new FlaggedCandidate(req.body);
  await flaggedCandidate.save();
  res.send(flaggedCandidate);
});

// Get All Flagged Candidates
app.get("/api/flag", async (req, res) => {
  const flaggedCandidates = await FlaggedCandidate.find();
  res.send(flaggedCandidates);
});

// Get Flagged Candidate by ID
app.get("/api/flag/:id", async (req, res) => {
  const flaggedCandidate = await FlaggedCandidate.findOne({
    candidateId: req.params.id,
  });
  if (!flaggedCandidate)
    return res.status(404).send("Flagged candidate not found");
  res.send(flaggedCandidate);
});

// Update Flagged Candidate by ID
app.put("/api/flag/:id", async (req, res) => {
  const flaggedCandidate = await FlaggedCandidate.findOneAndUpdate(
    { candidateId: req.params.id },
    req.body,
    { new: true }
  );
  if (!flaggedCandidate)
    return res.status(404).send("Flagged candidate not found");
  res.send(flaggedCandidate);
});

// Delete Flagged Candidate by ID
app.delete("/api/flag/:id", async (req, res) => {
  const result = await FlaggedCandidate.findOneAndDelete({
    candidateId: req.params.id,
  });
  if (!result) return res.status(404).send("Flagged candidate not found");
  res.send(result);
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
