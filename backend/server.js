const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB, getDB } = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/allLaureatesBaseInfo", async (req, res) => {
	try {
		const db = getDB();

		const data = await db.collection("noble").find({}).toArray();

		res.json(data);
	} catch (error) {
		res.status(500).json({ error: "Error fetching data" });
	}
});

const startServer = async () => {
	await connectDB();

	app.listen(process.env.PORT, () => {
		console.log(`Server running on port ${process.env.PORT}`);
	});
};

startServer();
