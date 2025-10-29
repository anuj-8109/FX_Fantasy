// src/components/SocketToast.jsx
import React, { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SOCKET_URL = "https://fx.tradestreet.in:1001";

export default function SocketToast() {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("adminnotification", (data) => {
      console.log("Received data:", data);
      if (!data) return;

      // If data is string, show simple toast
      if (typeof data === "string") {
        toast.info(data);
        return;
      }

      const { title, message, type, clientid } = data;

      // Custom formatted toast content
      const toastContent = (
        <div>
          <strong>{title}</strong>
          <div>{message}</div>
          <small style={{ color: "#888" }}>
          </small>
          <div style={{ marginTop: "4px", fontStyle: "italic", color: "#007bff" }}>
            Type: {type}
          </div>
        </div>
      );

      // Show toast based on type
      switch (type?.toLowerCase()) {
        case "success":
          toast.success(toastContent);
          break;
        case "error":
          toast.error(toastContent);
          break;
        case "warning":
          toast.warn(toastContent);
          break;
        default:
          toast.info(toastContent);
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connect error:", err);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
    </>
  );
}
