import React, { useState, useEffect } from "react";
import { Ticket, X, Eye } from "lucide-react";
import { GetTicket, addTicket, getticketDetail } from "../../../services/User";
import { useNavigate } from "react-router-dom";

function HelpDesk() {
     const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [token, setToken] = useState("");
  const [clientId, setClientId] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedClientId = localStorage.getItem("userId"); // make sure you store userId at login
    setToken(storedToken || "");
    setClientId(storedClientId || "");
    if (storedToken && storedClientId) {
      fetchTickets(storedToken, storedClientId);
    }
  }, []);

  const fetchTickets = async (tokenValue = token, clientIdValue = clientId) => {
    if (!tokenValue || !clientIdValue) return;
    const result = await GetTicket(tokenValue, clientIdValue);
    if (result.status) {
      setTickets(result.data);
    } else {
      console.error("Error fetching tickets:", result.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const subject = form.subject.value;
    const message = form.message.value;
    const attachment = form.attachment.files[0] || null;

    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("message", message);
    formData.append("client_id", clientId); // backend expects "client_id" here
    if (attachment) formData.append("attachment", attachment);

    const result = await addTicket(token, formData);

    if (result.status) {
      setTickets((prev) => [result.data, ...prev]);
      closeModal();
    } else {
      alert("Error adding ticket: " + result.message);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const viewTicketDetail = async (ticketId) => {
    const result = await getticketDetail(token, ticketId);
    if (result.status) {
      setSelectedTicket(result.data);
      setIsDetailModalOpen(true);
    } else {
      alert("Error fetching ticket details: " + result.message);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Ticket size={24} /> Help Desk
          </h1>
          <button
            onClick={openModal}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 flex items-center gap-1"
          >
            <span>+</span> New Request
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 min-h-[60vh]">
          {tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="mx-auto w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.75 3.75a7.5 7.5 0 0012.9 12.9z"
                  />
                </svg>
              </div>
              <h2 className="text-gray-600 text-lg">No records found.</h2>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="border rounded p-4 hover:shadow-md transition-shadow flex justify-between items-start"
                >
                  <div>
                    <h3 className="font-semibold text-lg">Subject: {ticket.subject}</h3>
                    <p className="text-gray-600 mt-1">Message: {ticket.message}</p>
                    <p className="text-sm text-gray-500 mt-1">Ticket #: {ticket.ticketnumber}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Status: {ticket.status === 0 ? "Open" : ticket.status === 1 ? "Closed" : "Pending"}
                    </p>
                  </div>
                 <button
                    onClick={() => navigate(`/chat/${ticket._id}`)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Eye size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">New Request</h2>
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input
                  type="text"
                  name="subject"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  name="message"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  rows="4"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Attachment</label>
                <input
                  type="file"
                  name="attachment"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


     
    </div>
  );
}

export default HelpDesk;
