import express from "express";
import cors from "cors";
import { logger } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";

import userRoutes from "./routes/userRoutes.js";
import pollRoutes from "./routes/pollRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/users", userRoutes);
app.use("/polls", pollRoutes);
// votes route is mounted in server.js where `io` exists

app.use(errorHandler);

export default app;
