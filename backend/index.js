import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import cors from "cors";
import groupsRoute from './routes/groupRoutes.js';
import usersRoute from './routes/userRoutes.js';
import groupMemberRoutes from './routes/groupMemberRoutes.js';
const app = express();

//Middleware
app.use(express.json());

//CORS
app.use(cors());

//Routes
app.get("/", (req, res) => {
  return res.status(234).send("Big Nigga");
});

//Diff major routes

app.use('/groups', groupsRoute);
app.use('/users', usersRoute);
app.use('/groupmembers', groupMemberRoutes);


mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log(`App connected to database`);
    app.listen(PORT, () => {
      console.log(`App is running on ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });