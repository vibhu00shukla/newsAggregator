require("dotenv").config();
const mongoose = require("mongoose");
const { runArticleJob } = require("./services/scheduler");

async function main() {
  try {
    await mongoose.connect(process.env.DB_CONNECT);
    console.log("Connected to DB");

    await runArticleJob();

    console.log("Job completed");
    process.exit(0);
  } catch (err) {
    console.error("Error running job manually:", err.message);
    process.exit(1);
  }
}

main();
