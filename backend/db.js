const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;

let db;

async function connectDB() {
	try {
		const client = new MongoClient(uri);
		await client.connect();

		db = client.db("laureaciNobla");

		console.log("Connected to MongoDB");
	} catch (error) {
		console.error("MongoDB connection error:", error);
	}
}

function getDB() {
	return db;
}

module.exports = {
	connectDB,
	getDB,
};
