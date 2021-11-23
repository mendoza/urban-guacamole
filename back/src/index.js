require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const rfs = require("rotating-file-stream");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const body = require("body-parser");
const path = require("path");
const fs = require("fs");
const middlewares = require("./middlewares");

const app = express();
const PORT = process.env.PORT || 3001;

mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (!err) {
      console.log("Successfull conection with MongoDB");
    } else {
      console.error(err);
    }
  }
);

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(helmet());

const accessLogStream = rfs.createStream("access.log", {
  interval: "1d",
  path: path.join(__dirname, "..", "logs"),
});
if (process.env.ENV === "production") {
  app.use(
    morgan(
      '[:date[clf]] :method :url :status :response-time ms - :res[content-length] ":user-agent"',
      { stream: accessLogStream }
    )
  );
} else {
  app.use(morgan("dev"));
}

app.use("/auth", require("./routers/auth.router"));
app.use("/annotation", require("./routers/annotation.router"));

app.use("/img", express.static("./images"));
app.use(middlewares.defaultError);
app.use(middlewares.NotFound);

app.listen(PORT, () => {
  console.log(`App running at ${PORT}`);
});
