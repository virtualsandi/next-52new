import { io, type Socket } from "socket.io-client";

let socketInstance: Socket | null = null;

export function getSocket() {
  if (!socketInstance) {
    socketInstance = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:9000",
      {
        autoConnect: false,
        transports: ["websocket", "polling"],
      }
    );
  }
  return socketInstance;
}

export function connectSocket() {
  const client = getSocket();
  if (!client.connected) {
    client.connect();
  }
  return client;
}

export function disconnectSocket() {
  if (socketInstance?.connected) {
    socketInstance.disconnect();
  }
}
