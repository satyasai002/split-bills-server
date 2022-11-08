const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

const app = express();

const userRoutes = require("./routes/user");
const groupRoutes = require("./routes/groups");
const expenseRoutes = require("./routes/expense");
const notificationRoutes = require("./routes/notification");

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());

mongoose
  .connect(process.env.DATABASE_URI)
  .then(console.log("db connected"));
mongoose.Promise = global.Promise;

app.use("/user", userRoutes);
app.use("/group", groupRoutes);
app.use("/expense", expenseRoutes);
app.use("/notification", notificationRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server started on PORT : ${PORT}`);
});
