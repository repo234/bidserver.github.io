var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var app = express();

const env = require("dotenv");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/api/users");
var categoriesRouter = require("./routes/api/categories");
var productsRouter = require("./routes/api/products");
var auctionRouter = require("./routes/api/auction");
var historyRouter = require("./routes/api/history");
env.config();

const DB = `mongodb+srv://parsa123:${process.env.DB_PASSWORD}@cluster0.mcthebl.mongodb.net/${process.env.DB_DATABASE}?retryWrites=true&w=majority`;

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));

app.use("/", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/products", productsRouter);
app.use("/api/auction", auctionRouter);
app.use("/api/history", historyRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

mongoose
  .connect(DB, {
    useNewUrlParser: true,

    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to Mongo...."))
  .catch((error) => console.log(error.message));
console.log(new Date());
module.exports = app;
