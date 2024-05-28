const { db } = require("@vercel/postgres");

let client;

const connectToDatabase = async () => {
  if (!client) {
    client = await db.connect();
    await client.sql`SELECT 1`;  // Test the connection
    console.log("Connected to the database");
  }
  return client;
};

module.exports = { connectToDatabase };