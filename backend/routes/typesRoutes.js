import express from "express";
import {Types} from "../models/typeOfSplit.js"

const router = express.Router();

//Get all
router.get("/", async (req, res) => {
    try {
      const types = await Types.find({});
  
      return res.status(200).json({
        count: types.length,
        data: types,
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).send({ message: error.message });
    }
  });

  //Create
router.post("/", async (req, res) => {
    try {
      if (!req.body.name) {
        return res.status(400).send({
          message: "Send all required fields: name",
        });
      }
  
      
      const highestID = await Types.findOne({}, {}, { sort: { typeID: -1 } });
      let newID = 1;
      if (highestID) {
        newID = highestID.typeID + 1; 
      }
  
      const newType = {
        typeID: newID,
        name: req.body.name,
      };
  
      const Type = await Types.create(newType);
  
      return res.status(201).send(Type);
    } catch (error) {
      console.log(error.message);
      res.status(500).send({ message: error.message });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const result = await Types.findOneAndDelete({ typeID: id });
      if (!result) {
        return res.status(404).json({ message: "Type not found" });
      }
  
      return res.status(200).json({ message: "Type deleted successfully" });
    } catch (error) {
      console.log(error.message);
      res.status(500).send({ message: error.message });
    }
  });

export default router;