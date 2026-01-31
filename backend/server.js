// backend/server.js
const http = require("http");
const app = require("./app"); // <-- your file you pasted
const { Server } = require("socket.io");

const PORT = process.env.PORT || 8000;

// ✅ Create raw HTTP server from Express app
const server = http.createServer(app);

// ✅ CORS for sockets (match your setup)
const isProduction = process.env.NODE_ENV === "production";

// If you serve frontend from SAME service (your app.js serves ../frontend/dist in prod),
// then origin can be same-origin and you can keep this simple.
// If frontend is a different domain (separate Render service), add it to allowedOrigins.
const allowedOrigins = isProduction
  ? ["https://franks-world.onrender.com"]
  : ["http://localhost:5173"];

const io = new Server(server, {
  cors: {
    origin: isProduction ? allowedOrigins : allowedOrigins,
    credentials: true,
  },
});

// ✅ Basic socket events
io.on("connection", (socket) => {
  console.log("✅ socket connected:", socket.id);

  socket.on("chatMessage", (payload) => {
    // broadcast to everyone
    io.emit("chatMessage", payload);
  });

  socket.on("disconnect", () => {
    console.log("❌ socket disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});
