import express from 'express';
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";


const app = express();


mongoose.connect(mongoDBURL).then(() => {
    console.log(`App connected to database`);
    app.listen(PORT, () => {
      console.log(`App is running on ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

