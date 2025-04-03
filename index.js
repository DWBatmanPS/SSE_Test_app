import express from "express";

const app = express();
const port = 80;

// Serve static files (e.g., client HTML)
app.use(express.static("public"));

// SSE endpoint
app.get("/time", (req, res) => {
    // Set headers for SSE
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    console.log("Client connected to /time");

    // Send an initial message to keep the connection alive
    res.write(`data: Connection established\n\n`);

    // Send the current time every 15 seconds
    const intervalId = setInterval(() => {
        const currentTime = new Date().toISOString();
        res.write(`data: ${currentTime}\n\n`); // SSE format
    }, 15000);

    // Handle client disconnect
    req.on("close", () => {
        console.log("Client disconnected from /time");
        clearInterval(intervalId);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`SSE server running at http://localhost:${port}`);
});