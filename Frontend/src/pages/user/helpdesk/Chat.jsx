import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getticketDetail, TicketReply } from "../../../services/User";

function Chat() {
    const { ticketId } = useParams();
    const [token, setToken] = useState("");
    const [ticketDetail, setTicketDetail] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);

    // Get token from localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        setToken(storedToken || "");
    }, []);

    // Fetch ticket whenever token or ticketId changes
    useEffect(() => {
        if (token && ticketId) fetchTicket();
    }, [token, ticketId]);

    const fetchTicket = async () => {
        const result = await getticketDetail(token, ticketId);
        if (result.status) setTicketDetail(result.data);
        else alert("Error fetching ticket details: " + result.message);
    };

    // Scroll to bottom whenever messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [ticketDetail]);

    // Handle sending message
    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        const data = {
            ticket_id: ticketId,
            client_id: ticketDetail.ticket.client_id,
            message: newMessage,
            // omit attachment if null
        };


        const optimisticMessage = {
            _id: Date.now(),
            message: newMessage,
            adminname: null,
            attachment: null,
        };

        setTicketDetail(prev => ({
            ...prev,
            messages: [...prev.messages, optimisticMessage],
        }));

        // setNewMessage("");
console.log("data",data)
        const res = await TicketReply(token, data);
console.log("data",data)
console.log("res",res)
        if (!res.status) {
            // alert("Failed to send message: " + res.message);
            setTicketDetail(prev => ({
                ...prev,
                messages: prev.messages.filter(msg => msg._id !== optimisticMessage._id),
            }));
        } else {
            fetchTicket(); // refresh messages
        }
    };


    if (!ticketDetail) return <div className="p-6">Loading ticket details...</div>;

    const ticket = ticketDetail.ticket;

    return (
        <div className="p-6 flex flex-col h-[80vh]">
            <h1 className="text-xl font-bold mb-4">Chat for Ticket #{ticket.ticketnumber}</h1>

            <div className="border rounded p-4 mb-4 bg-white shadow-sm">
                <h2 className="font-semibold">Subject: {ticket.subject}</h2>
                <p>Message: {ticket.message}</p>
                <p>Status: {ticket.status === 0 ? "Open" : ticket.status === 1 ? "Closed" : "Pending"}</p>
                {ticket.attachment && (
                    <p>
                        Attachment:{" "}
                        <a href={ticket.attachment} target="_blank" className="text-blue-500 hover:underline">
                            View
                        </a>
                    </p>
                )}
            </div>

            {/* Chat messages area */}
            <div className="flex-1 overflow-y-auto mb-4 border rounded p-3 bg-gray-50">
                {ticketDetail.messages.length === 0 ? (
                    <p className="text-gray-500">No messages found.</p>
                ) : (
                    ticketDetail.messages.map((msg) => (
                        <div
                            key={msg._id}
                            className={`border p-3 rounded mb-3 ${msg.adminname ? "bg-blue-50 self-start" : "bg-green-50 self-end"
                                }`}
                        >
                            <p>
                                <strong>{msg.adminname || "You"}:</strong> {msg.message}
                            </p>
                            {msg.attachment && (
                                <a href={msg.attachment} target="_blank" className="text-blue-500 hover:underline text-sm">
                                    Attachment
                                </a>
                            )}
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>


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
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default Chat;
