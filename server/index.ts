import express from "express";
import { join } from "path";
import dotenv from "dotenv";
import { root } from "./routes/root";
import { userRoutes } from "./routes/userRoutes";
import { logger, logEvents } from "./middleware/logger";
import { errorHandler } from "./middleware/errorHandler";
import cookieParser from "cookie-parser";
import cors from "cors";
import { corsOptions } from "./config/corsOptions";
import { connectDB } from "./config/dbConn";
import mongoose from "mongoose";
import { teamRoutes } from "./routes/teamRoutes";
import { authRoutes } from "./routes/authRoutes";

// Server config and init
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

// Database initializations
connectDB()

// Middleware initializations
app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/", express.static(join(__dirname, "public")));

// Routes handling
app.use("/", root);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/teams", teamRoutes);
app.all("*", (req, res) => {
	res.status(404);
	if (req.accepts("html")) {
		res.sendFile(join(__dirname, "views", "404.html"));
	} else if (req.accepts("json")) {
		res.json({ message: "404 Not Found" });
	} else {
		res.type("txt").send("404 Not Found");
	}
});

// Error handler
app.use(errorHandler)

mongoose.connection.once("open", () => {
	console.log("Connected to MongoDB");

	// Express server connection init
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on("error", err => {
	console.log(err);
	logEvents(
		`${err.no}\t${err.code}\t${err.syscall}\t${err.hostname}`,
		"mongoErrLog.log"
	);
})


