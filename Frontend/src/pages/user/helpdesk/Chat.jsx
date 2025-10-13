import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getticketDetail, TicketReply } from "../../../services/User";

function Chat() {
    const { ticketId } = useParams();
    const [token, setToken] = useState("");
    const [ticketDetail, setTicketDetail] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);
    const [notification, setNotification] = useState("");

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        setToken(storedToken || "");
    }, []);

    useEffect(() => {
        if (token && ticketId) fetchTicket();
    }, [token, ticketId]);

    const fetchTicket = async () => {
        const result = await getticketDetail(token, ticketId);
        if (result.status) {
            if (ticketDetail && result.data.messages.length > ticketDetail.messages.length) {
                setNotification("New message received!");
                setTimeout(() => setNotification(""), 3000);
            }
            setTicketDetail(result.data);
        } else {
            alert("Error fetching ticket details: " + result.message);
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [ticketDetail]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        const data = {
            ticket_id: ticketId,
            client_id: ticketDetail.ticket.client_id,
            message: newMessage,
        };

        const optimisticMessage = {
            _id: Date.now(),
            message: newMessage,
            adminname: null,
            attachment: null,
            created_at: new Date().toISOString(),
        };

        setTicketDetail(prev => ({
            ...prev,
            messages: [...prev.messages, optimisticMessage],
        }));
        setNewMessage("");

        const res = await TicketReply(token, data);
        if (!res.status) {
            setTicketDetail(prev => ({
                ...prev,
                messages: prev.messages.filter(msg => msg._id !== optimisticMessage._id),
            }));
        } else {
            fetchTicket();
        }
    };

    if (!ticketDetail) return <div className="p-6">Loading ticket details...</div>;

    const ticket = ticketDetail.ticket;
    const showInput = ticket?.status === 1; 

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
        <div className="p-4 flex flex-col h-[80vh] bg-gray-100 relative">
            <h1 className="text-xl font-bold mb-4">Chat for Ticket #{ticket.ticketnumber}</h1>

            <div className="border rounded p-4 mb-4 bg-white shadow-xs">
                <h2 className="font-semibold">Subject: {ticket.subject}</h2>
                <p>Message: {ticket.message}</p>
                <p>Status: {getStatusLabel(ticket.status)}</p>
                {ticket.attachment && (
                    <p>
                        Attachment:{" "}
                        <a href={ticket.attachment} target="_blank" className="text-blue-500 hover:underline" rel="noreferrer">
                            View
                        </a>
                    </p>
                )}
            </div>

            {notification && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-300 text-black px-4 py-2 rounded shadow">
                    {notification}
                </div>
            )}

            <div className="flex-1 overflow-y-auto mb-4 p-3 bg-white rounded shadow-inner flex flex-col space-y-6">
                {Object.keys(groupedMessages).reverse().map((dateLabel) => (
                    <div key={dateLabel}>
                        <div className="text-center text-gray-500 text-xs mb-3">{dateLabel}</div>
                        {groupedMessages[dateLabel].slice().reverse().map((msg) => {
                            const isAdmin = !!msg.adminname;
                            const name = msg.adminname || "You";
                            const initial = name.charAt(0).toUpperCase();

                            return (
                                <div
                                    key={msg._id}
                                    className={`flex ${isAdmin ? "justify-start" : "justify-end"} mb-2`}
                                >
                                    <div className={`flex ${isAdmin ? "flex-row" : "flex-row-reverse"} items-end`}>
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

                                        <div className={`max-w-[80%] px-2 py-1 rounded-lg text-xs shadow ${isAdmin ? "bg-blue-100" : "bg-green-100"} break-words`}>
                                            {/* <p className="text-sm font-semibold mb-1">{name}</p> */}
                                            <p>{msg.message}</p>
                                            <p className="text-xs text-gray-500 text-right ">{formatTime(msg.created_at)}</p>
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

            {showInput && (
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 border rounded p-2"
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <button
                        onClick={handleSendMessage}
                        className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
                    >
                        Send
                    </button>
                </div>
            )}
        </div>
    );
}

export default Chat;
