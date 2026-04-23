const { Server } = require("socket.io");
const http = require("http");

const httpServer = http.createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Adjust for production
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("Client connected to Bus Matrix:", socket.id);

  socket.on("bus-started", (data) => {
    console.log("Trip Broadcaster Activated:", data.tripId);
    socket.broadcast.emit("bus-trip-started", data);
  });

  socket.on("location-update", (data) => {
    // data: { tripId, lat, lng, timestamp, role, name, userId }
    socket.broadcast.emit("bus-location", data);
  });

  socket.on("user-location", (data) => {
    // Shared peer location: { userId, name, role, lat, lng }
    socket.broadcast.emit("peer-location", data);
  });

  socket.on("bus-stopped", (data) => {
    console.log("Trip Broadcaster Deactivated:", data.tripId);
    socket.broadcast.emit("bus-trip-stopped", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`Institutional Socket Gateway [2083 BS] running on port ${PORT}`);
});
