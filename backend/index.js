import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import cors from "cors";
import groupsRoute from './routes/groupRoutes.js';
import usersRoute from './routes/userRoutes.js';
import groupMemberRoutes from './routes/groupMemberRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import typesRoutes from './routes/typesRoutes.js';

const app = express();

//Middleware
app.use(express.json());

//CORS
const corsOptions = {
  origin: ['http://localhost:3000', 'https://masterhasan095.github.io/'], // Allow requests from localhost:3000 and example.com
};

app.use(cors(corsOptions));

//Routes 
app.get("/", (req, res) => {
  return res.status(234).send("Share Wallet");
});


//Diff major routes

app.use('/groups', groupsRoute);
app.use('/users', usersRoute);
app.use('/groupmembers', groupMemberRoutes);
app.use('/types', typesRoutes);
app.use('/groups/expense', expenseRoutes)



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
