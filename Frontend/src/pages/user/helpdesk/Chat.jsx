import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getticketDetail, TicketReply } from "../../../services/User";

function Chat() {
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
        const result = await getticketDetail(token, ticketId);
        if (result.status) setTicketDetail(result.data);
        else alert("Error fetching ticket details: " + result.message);
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
    const isDisabled = ticket?.status === 0 || ticket?.status === 2;
    const getStatusLabel = (status) => {
    switch (status) {
        case 0: return "Pending";
        case 1: return "Open";
        case 2: return "Closed";
        default: return "Unknown";
    }
};


    return (
        <div className="p-6 flex flex-col h-[80vh]">
            <h1 className="text-xl font-bold mb-4">Chat for Ticket #{ticket.ticketnumber}</h1>

            <div className="border rounded p-4 mb-4 bg-white shadow-sm">
                <h2 className="font-semibold">Subject: {ticket.subject}</h2>
                <p>Message: {ticket.message}</p>
               <p>Status: {getStatusLabel(ticket.status)}</p>

                {ticket.attachment && (
                    <p>
                        Attachment:{" "}
                        <a href={ticket.attachment} target="_blank" className="text-blue-500 hover:underline">
                            View
                        </a>
                    </p>
                )}
            </div>


            <div className="flex-1 overflow-y-auto mb-4 border rounded p-3 bg-gray-50">
                {ticketDetail.messages.length === 0 ? (
                    <p className="text-gray-500">No messages found.</p>
                ) : (
                    ticketDetail.messages.map((msg) => (
                        <div
                            key={msg._id}
                            className={`border p-3 rounded mb-3 ${msg.adminname ? "bg-blue-50 self-start" : "bg-green-50 self-end"}`}
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

            {/* Input box and send button */}
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

export default Chat;
