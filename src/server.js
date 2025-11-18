import dotenv from 'dotenv';
import connectDB from './db/index.js';
import app from './app.js';
dotenv.config({
    path: "./.env", // Path to the environment variables file
});

const port = process.env.PORT || 5000;

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`)
        })
    })
    .catch((error) => {
        console.error("Failed to start server:", error.message);
    });
