const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
connectDB();
dotenv.config();
const port = process.env.PORT;

const router = require("./routes/routes");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("backend is working");
});

app.use(cors());
app.use("/", router);

app.listen(port, () => {
  console.log(`backend is working on port ${port}`);
});
