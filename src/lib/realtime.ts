import { Server as IOServer } from "socket.io";
import { Server as HTTPServer } from "http";

let io: IOServer | null = null;

export function getIo(server?: HTTPServer): IOServer {
  if (io) return io;
  if (!server) throw new Error("Socket.io server not initialized");
  io = new IOServer(server, {
    cors: { origin: "*" },
    path: "/api/socket",
  });
  return io;
}

export function publishWorkspaceEvent(workspaceId: string, payload: unknown) {
  if (!io) return;
  io.to(`workspace:${workspaceId}`).emit("event", payload);
}


