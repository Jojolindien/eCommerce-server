const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

//app
const app = express();

//db
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cqrrwwd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("db connected");
    const port = process.env.PORT || 5000;
    app.listen(port, () =>
    console.log(`server is running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => {
    console.log("db connection error");
    console.log(err);
  });

//middlewares
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(cors());

//route
app.get("/api", (req, res) => {
  res.json({
    data: "hey you hit node api back end !",
  });
});
