import React, { useState, useEffect } from "react";
import { Ticket, Eye } from "lucide-react";
import { GetTicketsuper } from "../../../services/SuperAdmin";
import { useNavigate } from "react-router-dom";
import Datatable from "../../../extracomponents/DatatablePagination";
import Content from "../../../components/superadmin/Content";
import toast from "react-hot-toast";

function HelpDesk() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [token, setToken] = useState("");
  const [clientId, setClientId] = useState("");
  const [loading, setLoading] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedClientId = localStorage.getItem("userId");
    setToken(storedToken || "");
    setClientId(storedClientId || "");
    if (storedToken && storedClientId) fetchTickets(storedToken, storedClientId);
  }, []);

  const fetchTickets = async (tokenValue = token, clientIdValue = clientId, page = currentPage, limit = rowsPerPage, filter = filterText) => {
    if (!tokenValue || !clientIdValue) return;
    setLoading(true);
    const result = await GetTicketsuper(tokenValue, clientIdValue, { page, limit, filter });
    if (result?.status) {
      setTickets(result.data || []);
      setTotalRows(result.pagination?.total || 0); 
    } else {
      toast.error(result?.message || "Failed to load tickets");
    }
    setLoading(false);
  };


  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchTickets(token, clientId, page, rowsPerPage, filterText);
  };

  const handleRowsPerPageChange = (newPerPage, page) => {
    setRowsPerPage(newPerPage);
    setCurrentPage(page);
    fetchTickets(token, clientId, page, newPerPage, filterText);
  };

  const handleFilterChange = (text) => {
    setFilterText(text);
    setCurrentPage(1); 
    fetchTickets(token, clientId, 1, rowsPerPage, text);
  };

  const columns = [
  
    { name: "Ticket #", selector: (row) => row.ticketnumber, sortable: true },
    { name: "Subject", selector: (row) => row.subject, sortable: true },
    { name: "Message", selector: (row) => row.message, wrap: true },
    {
      name: "Status",
      selector: (row) => {
        let label = "", color = "";
        switch (row.status) {
          case 0: label = "Pending"; color = "bg-yellow-200 text-yellow-800"; break;
          case 1: label = "Open"; color = "bg-blue-200 text-blue-800"; break;
          case 2: label = "Closed"; color = "bg-red-200 text-red-800"; break;
          default: label = "Unknown"; color = "bg-gray-200 text-gray-800";
        }
        return <span className={`px-3 py-1 rounded-full text-sm font-medium ${color}`}>{label}</span>;
      },
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
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
    <Content Page_title="Help Desk" button_title="Back" button_status={true} route="/superadmin/dashboard">
      <div className="flex bg-gray-100 min-h-screen p-6">
        <div className="flex-1 bg-white rounded-lg shadow-md p-4 border">
          <Datatable
            columns={columns}
            data={tickets}
            totalRows={totalRows}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            filterText={filterText}
            onFilterChange={handleFilterChange}
            onRefresh={() => fetchTickets()}
          />
        </div>
      </div>
    </Content>
  );
}

export default HelpDesk;
