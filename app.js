var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cors = require("cors");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var offersRouter = require("./routes/offers");
var questionsRouter = require("./routes/questions");
const adminRouter = require("./routes/admin");
const rhRouter = require("./routes/rh");
const port = process.env.PORT || 5000;

require("dotenv").config();

var app = express();
//app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
// view engine setup

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("success");
});
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("public"));
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/offers", offersRouter);
app.use("/questions", questionsRouter);
app.use("/admin", adminRouter);
app.use("/rh", rhRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});

module.exports = app;
