"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = require("path");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
app.use("/", express_1.default.static((0, path_1.join)(__dirname, "/public")));
app.use("/", require("./dist/routes/root"));
// app.get("/", (req, res) => {
// 	res.send("Hello World");
// })
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
