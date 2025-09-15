import express from "express";
import { castVote } from "../controllers/voteController.js";

export default (io) => {
  const router = express.Router();

  router.post("/", castVote(io)); // pass io into controller

  return router;
};
