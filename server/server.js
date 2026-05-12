const express = require("express");
const app = express();

const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
connectDB();

const router = require("./routes/routes");

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("backend is working");
});

app.use("/", router);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`backend is working on port ${port}`);
});
