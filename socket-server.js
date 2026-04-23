const { Server } = require("socket.io");
const http = require("http");

// Create a server that can handle both HTTP (for Render health checks) and WebSockets
const httpServer = http.createServer((req, res) => {
  if (req.url === "/health" || req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Socket server is healthy and running!");
  } else {
    res.writeHead(404);
    res.end();
  }
});

const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allows your Vercel site to connect
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("location-update", (data) => {
    socket.broadcast.emit("bus-location", data);
  });

  socket.on("bus-started", (data) => {
    socket.broadcast.emit("bus-trip-started", data);
  });

  socket.on("bus-stopped", (data) => {
    socket.broadcast.emit("bus-trip-stopped", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// IMPORTANT: Use process.env.PORT for Render deployment
const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Institutional Socket Gateway [2083 BS] running on port ${PORT}`);
});
