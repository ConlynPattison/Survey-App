import express from "express";
import { join } from "path";

const router = express.Router();

export const root = router.get("^/$|/index(.html)?", (req, res) => {
	res.sendFile(join(__dirname, "..", "views", "index.html"))
});
