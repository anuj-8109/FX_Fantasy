// src/components/SocketToast.jsx
import React, { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SOCKET_URL = "https://fx.tradestreet.in:1001";

export default function SocketToast() {
  const socketRef = useRef(null);
  const lastPrices = useRef({});

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
      
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      // toast.success("✅ Live Forex Feed Connected", { autoClose: 1500 });
    });

    socket.on("adminnotification", (data) => {
      
      if (!data) return;

      if (typeof data === "string") return toast.info(data);

      const { title, message, type } = data;
      const content = (
        <div>
          <strong>{title}</strong>
          <div>{message}</div>
          <div style={{ marginTop: "4px", fontStyle: "italic", color: "#007bff" }}>
            Type: {type}
          </div>
        </div>
      );

      toast[type?.toLowerCase()]?.(content) || toast.info(content);
    });

   

    socket.on("disconnect", (reason) => {
      console.warn("⚠️ Socket disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  return <ToastContainer position="top-right" autoClose={5000} limit={5} />;
}
