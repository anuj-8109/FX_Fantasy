import React, { useState, useEffect } from "react";
import { Ticket, X, Eye } from "lucide-react";
import { GetTicketsuper } from "../../../services/SuperAdmin";
import { useNavigate } from "react-router-dom";
import Datatable from "../../../extracomponents/Datatable";
import Content from "../../../components/superadmin/Content";

function HelpDesk() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [token, setToken] = useState("");
  const [clientId, setClientId] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedClientId = localStorage.getItem("userId");
    setToken(storedToken || "");
    setClientId(storedClientId || "");
    if (storedToken && storedClientId) {
      fetchTickets(storedToken, storedClientId);
    }
  }, []);

  const fetchTickets = async (tokenValue = token, clientIdValue = clientId) => {
    if (!tokenValue || !clientIdValue) return;
    const result = await GetTicketsuper(tokenValue, clientIdValue);
    if (result.status) {
      setTickets(result.data);
    } else {
      console.error("Error fetching tickets:", result.message);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const columns = [
    {
      name: "Ticket #",
      selector: row => row.ticketnumber,
      sortable: true,
    },
    {
      name: "Subject",
      selector: row => row.subject,
      sortable: true,
    },
    {
      name: "Message",
      selector: row => row.message,
      sortable: false,
      wrap: true,
    },
    {
      name: "Status",
      selector: row => {
        let label = "";
        let color = "";

        switch (row.status) {
          case 0:
            label = "Pending";
            color = "bg-yellow-200 text-yellow-800";
            break;
          case 1:
            label = "Open";
            color = "bg-blue-200 text-blue-800";
            break;
          case 2:
            label = "Closed";
            color = "bg-red-200 text-red-800";
            break;
          default:
            label = "Unknown";
            color = "bg-gray-200 text-gray-800";
        }

        return (
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${color}`}>
            {label}
          </span>
        );
      },
      sortable: true,
    },

    {
      name: "Action",
      cell: row => (
        <button
          onClick={() => navigate(`/superadmin/chatreply/${row._id}`)}
          className="text-blue-500 hover:text-blue-700"
        >
          <Eye size={20} />
        </button>
      ),

    },
  ];

  return (
     <Content
      Page_title="Help Desk"
      button_title="Back"
      button_status={true}
      route="/superadmin/dashboard"

      // extra_button="+ Add Content" extra_button_action={handleOpen}
    >
    <div className="flex bg-gray-100 min-h-screen">
      <div className="flex-1 p-6">
        {/* <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Ticket size={24} /> Help Desk
          </h1>
          <button
            onClick={openModal}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 flex items-center gap-1"
          >
            <span>+</span> New Request
          </button>
        </div> */}

        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <Datatable
            columns={columns}
            data={tickets}
            pagination
            highlightOnHover
            pointerOnHover
            noHeader
            onRefresh={fetchTickets}
          />
        </div>
      </div>


    </div>
    </Content>
  );
}

export default HelpDesk;
