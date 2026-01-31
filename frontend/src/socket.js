import { io } from "socket.io-client";

const API = "http://localhost:8000";

export const socket = io(API, {
  withCredentials: true,
  transports: ["websocket", "polling"], // allow fallback
});

// ---- DEBUG LOGS (temporary) ----
socket.on("connect", () => {
  console.log("✅ SOCKET CONNECTED:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("❌ SOCKET CONNECT ERROR:", err.message);
});

socket.on("disconnect", (reason) => {
  console.warn("⚠️ SOCKET DISCONNECTED:", reason);
});
