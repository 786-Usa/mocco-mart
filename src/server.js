import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/index.js';
dotenv.config({
  path: "./.env", // Path to the environment variables file
});

const app = express();

const port = process.env.PORT || 5000;

connectDB()
.then(() => {
    app.listen(port, () =>{
        console.log(`Server is running on port ${port}`)
    })
    })
    .catch((error) => {
        console.error("Failed to start server:", error.message);
    });
