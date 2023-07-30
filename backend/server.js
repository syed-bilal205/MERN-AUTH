require("dotenv").config();
const express = require("express");
const connectionDB = require("./config/Connectdb");
const userRouter = require("./routes/User");
const { notFound, errorHandler } = require("./middleware/ErrorMiddleware");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 8000;

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// DATABASE
connectionDB();

// ROUTES
app.use("/api/users", userRouter);

app.use(notFound);
app.use(errorHandler);

// SERVER
app.listen(PORT, () => {
  console.log(`server started at the port http://localhost:${PORT}`);
});
