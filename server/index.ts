import express from "express";
import { join } from "path";
import dotenv from "dotenv";
import { router } from "./routes/root";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use("/", express.static(join(__dirname, "/public")));

app.use("/", router);

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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));