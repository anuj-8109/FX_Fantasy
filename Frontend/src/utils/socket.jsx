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
      console.log("data",data)
      if (!data) return;
      if (typeof data === "string") {
        toast.info(data);
        return;
      }

      const { title, message, type } = data;

      switch (type) {
        case "success":
          toast.success(message || title);
          break;
        case "error":
          toast.error(message || title);
          break;
        case "warning":
          toast.warn(message || title);
          break;
        default:
          toast.info(message || title);
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      // optional: toast.warn("Disconnected from server");
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connect error:", err);
      // optional: toast.error("Socket connection error");
    });

    // cleanup on unmount
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
