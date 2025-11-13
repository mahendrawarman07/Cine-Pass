// Import the Express framework, which is used to create a web server and handle HTTP requests
const express = require("express");

// Import the database configuration file that contains connection logic for the database
const dbConfig = require("./dbConfig.js");

// Import the dotenv package to load environment variables from a .env file
const dotEnv = require('dotenv')

// Load the environment variables from the .env file into process.env
dotEnv.config()

// Create an instance of an Express application
const app = express();

// Call the connectDb() function from dbConfig.js to establish a connection to the database
dbConfig.connectDb();

// Enable the app to automatically parse incoming JSON request bodies
app.use(express.json())

app.get("/",(req,res)=>{
    res.send("Hello from the Server");
})

// Start the server on port 8001 and run the callback function once the server starts successfully
app.listen("8000",()=>{
    // Print a message to the console indicating that the server is running
    console.log("Server Started");
})