require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to DataBase"));

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const usersRouter = require("./routes/users");
app.use("/api/users", usersRouter);

const landRouter = require("./routes/lands");
app.use("/api/lands", landRouter);

app.listen(5000, () => {
  console.log(`Server Started at port 5000`);
});
