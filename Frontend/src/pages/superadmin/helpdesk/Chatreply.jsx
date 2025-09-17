import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getticketDetailAdmin, TicketReplyadmin, ticketstatus } from "../../../services/SuperAdmin";

function Chatreply() {
  const { ticketId } = useParams();
  const [token, setToken] = useState("");
  const [ticketDetail, setTicketDetail] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken || "");
  }, []);

  useEffect(() => {
    if (token && ticketId) fetchTicket();
  }, [token, ticketId]);

  const fetchTicket = async () => {
    const result = await getticketDetailAdmin(token, ticketId);
    if (result.status) {
      setTicketDetail(result.data);
    } else {
      alert("Error fetching ticket: " + result.message);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticketDetail]);

  const handleCloseTicket = async () => {
    if (!window.confirm("Are you sure you want to close this ticket?")) return;

    const data = {
      id: ticketId,
      status: 2
    };

    const res = await ticketstatus(token, data);

    if (res.status) {
      alert("Ticket closed successfully.");
      fetchTicket();
    } else {
      alert("Failed to close ticket: " + res.message);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const data = {
      ticket_id: ticketId,
      message: newMessage,
      adminname: "Admin",
    };

    const optimisticMessage = {
      _id: Date.now(),
      message: newMessage,
      adminname: "Admin",
      attachment: null,
      created_at: new Date().toISOString(),
    };

    setTicketDetail((prev) => ({
      ...prev,
      messages: [...prev.messages, optimisticMessage],
    }));
    setNewMessage("");

    const res = await TicketReplyadmin(token, data);
    if (!res.status) {
      alert("Failed to send message: " + res.message);
      setTicketDetail((prev) => ({
        ...prev,
        messages: prev.messages.filter((msg) => msg._id !== optimisticMessage._id),
      }));
    } else {
      fetchTicket();
    }
  };

  if (!ticketDetail) {
    return <div className="p-6">Loading ticket details...</div>;
  }

  const ticket = ticketDetail.ticket;
  const isDisabled = ticket?.status === 2;
  const getStatusLabel = (status) => {
    switch (status) {
      case 0: return "Pending";
      case 1: return "Open";
      case 2: return "Closed";
      default: return "Unknown";
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateLabel = (timestamp) => {
    const msgDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (
      msgDate.getFullYear() === today.getFullYear() &&
      msgDate.getMonth() === today.getMonth() &&
      msgDate.getDate() === today.getDate()
    ) {
      return "Today";
    } else if (
      msgDate.getFullYear() === yesterday.getFullYear() &&
      msgDate.getMonth() === yesterday.getMonth() &&
      msgDate.getDate() === yesterday.getDate()
    ) {
      return "Yesterday";
    } else {
      return msgDate.toLocaleDateString();
    }
  };

  const groupedMessages = ticketDetail.messages.reduce((groups, msg) => {
    const dateLabel = formatDateLabel(msg.created_at);
    if (!groups[dateLabel]) {
      groups[dateLabel] = [];
    }
    groups[dateLabel].push(msg);
    return groups;
  }, {});

  return (
    <div className="p-6 flex flex-col h-[80vh] bg-gray-100">
      <h1 className="text-xl font-bold mb-4">Chat for Ticket #{ticket.ticketnumber}</h1>

      <div className="border rounded p-4 mb-4 bg-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1">
          <h2 className="font-semibold text-lg mb-2">Subject: {ticket.subject}</h2>
          <p className="mb-2">Message: {ticket.message}</p>
          {ticket.attachment && (
            <p>
              Attachment:{" "}
              <a href={ticket.attachment} target="_blank" className="text-blue-500 hover:underline" rel="noreferrer">
                View
              </a>
            </p>
          )}
        </div>

        <div className="flex flex-col items-end space-y-2">
          <p className="font-medium">Status: <span className="text-blue-600">{getStatusLabel(ticket.status)}</span></p>
          {!isDisabled && (
            <button
              onClick={handleCloseTicket}
              className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white"
            >
              Close Ticket
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 p-3 bg-white rounded shadow-inner flex flex-col space-y-6">
        {Object.keys(groupedMessages).reverse().map((dateLabel) => (
          <div key={dateLabel}>
            <div className="text-center text-gray-500 text-xs mb-3">{dateLabel}</div>
            {groupedMessages[dateLabel].slice().reverse().map((msg) => {
              const isAdmin = msg.adminname === "Admin"; // admin का message right में
              const name = msg.adminname || "You"; // fallback name
              const initial = name.charAt(0).toUpperCase(); // पहला अक्षर

              return (
                <div
                  key={msg._id}
                  className={`flex ${isAdmin ? "justify-end" : "justify-start"} mb-2`}
                >
                  <div className={`flex ${isAdmin ? "flex-row-reverse" : "flex-row"} items-end`}>
                    {/* Profile Image or Initial */}
                    {msg.profileImage ? (
                      <img
                        src={msg.profileImage}
                        alt="Profile"
                        className="w-8 h-8 rounded-full border border-gray-300"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center border border-gray-300 text-sm font-bold">
                        {initial}
                      </div>
                    )}
                    {/* Message Bubble */}
                    <div className={`max-w-[70%] px-4 py-2 rounded-lg shadow ${isAdmin ? "bg-blue-100" : "bg-green-100"} break-words`}>
                      <p className="text-sm font-semibold mb-1">{name}</p>
                      <p>{msg.message}</p>
                      <p className="text-xs text-gray-500 text-right mt-1">{formatTime(msg.created_at)}</p>
                      {msg.attachment && (
                        <a href={msg.attachment} target="_blank" className="text-blue-500 hover:underline text-xs block mt-1" rel="noreferrer">
                          Attachment
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border rounded p-2"
          disabled={isDisabled}
          onKeyDown={(e) => e.key === "Enter" && !isDisabled && handleSendMessage()}
        />
        <button
          onClick={handleSendMessage}
          className={`px-4 py-2 rounded ${isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
          disabled={isDisabled}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chatreply;
