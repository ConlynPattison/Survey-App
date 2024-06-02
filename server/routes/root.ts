import express from "express";
import { join } from "path";

export const router = express.Router();

router.get("^/$|/index(.html)?", (req, res) => {
	res.sendFile(join(__dirname, "..", "views", "index.html"))
});
