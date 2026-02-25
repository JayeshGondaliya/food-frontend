import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const useSocket = (event: string, callback: (data: any) => void) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, { transports: ["websocket"] });

    socketRef.current.on(event, callback);

    return () => {
      socketRef.current?.off(event, callback);
      socketRef.current?.disconnect();
    };
  }, [event, callback]);

  return socketRef;
};
