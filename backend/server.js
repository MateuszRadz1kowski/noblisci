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

		const filter = {};

		if (req.query.category) {
			filter["prizes.category"] = req.query.category.toLowerCase;
		}

		if (req.query.surname) {
			filter["surname"] = {
				$regex: req.query.surname,
				$options: "i",
			};
		}

		if (req.query.yearmin || req.query.yearmax) {
			filter["prizes.year"] = {};

			if (req.query.yearmin) {
				filter["prizes.year"].$gte = req.query.yearmin;
			}

			if (req.query.yearmax) {
				filter["prizes.year"].$lte = req.query.yearmax;
			}
		}

		const data = await db.collection("noble").find(filter).toArray();

		res.json(data);
	} catch (error) {
		res.status(500).json({ error: "Error fetching data" });
	}
});

app.get("/api/LaureateInfo/:id", async (req, res) => {
	try {
		const db = getDB();

		const filter = { id: req.params.id };

		const data = await db.collection("noble").find(filter).toArray();

		res.json(data);
	} catch (error) {
		res.status(500).json({ error: "Error fetching data" });
	}
});

app.get("/api/stats/top-countries", async (req, res) => {
	try {
		const db = getDB();

		const data = await db
			.collection("noble")
			.aggregate([
				{
					$group: {
						_id: "$bornCountryCode",
						iloscLaureatow: { $sum: 1 },
					},
				},
				{
					$sort: { iloscLaureatow: -1 },
				},
				{
					$limit: 10,
				},
				{
					$project: {
						_id: 0,
						country: "$_id",
						iloscLaureatow: 1,
					},
				},
			])
			.toArray();

		res.json(data);
	} catch (error) {
		res.status(500).json({ error: "Error fetching stats" });
	}
});

const startServer = async () => {
	await connectDB();

	app.listen(process.env.PORT, () => {
		console.log(`Server running on port ${process.env.PORT}`);
	});
};

startServer();
