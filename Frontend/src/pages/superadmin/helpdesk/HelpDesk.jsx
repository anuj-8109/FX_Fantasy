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
    if (storedToken && storedClientId)
      fetchTickets(storedToken, storedClientId);
  }, []);

  const fetchTickets = async (
    tokenValue = token,
    clientIdValue = clientId,
    page = currentPage,
    limit = rowsPerPage,
    filter = filterText
  ) => {
    if (!tokenValue || !clientIdValue) return;
    setLoading(true);
    const result = await GetTicketsuper(tokenValue, clientIdValue, {
      page,
      limit,
      filter,
    });
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

  const statusMap = {
    0: "Pending",
    1: "Active",
    2: "Closed",
  };

  const columns = [
    {
      name: "Client Name",
      selector: (row) => row.client.FullName || "N/A",
      exportValue: (row) => row.FullName || "N/A",
      export: true,
      sortable: true,
      width: "150px",
    },
    {
      name: "E-mail",
      selector: (row) => row.Email || "N/A",
      exportValue: (row) => row.Email || "N/A",
      export: true,
      sortable: true,
      width: "150px",
    },
    {
      name: "Phone No",
      selector: (row) => row.PhoneNo || "N/A",
      exportValue: (row) => row.PhoneNo || "N/A",
      export: true,
      sortable: true,
      width: "120px",
    },
    {
      name: "Ticket",
      selector: (row) => row.ticketnumber || "N/A",
      exportValue: (row) => row.ticketnumber || "N/A",
      export: true,
      sortable: true,
      width: "200px",
    },
    {
      name: "Subject",
      selector: (row) => row.subject || "N/A",
      exportValue: (row) => row.subject || "N/A",
      export: true,
      sortable: true,
      width: "120px",
    },
    // {
    //   name: "Message",
    //   selector: (row) => row.message || "N/A",
    //   exportValue: (row) => row.message || "N/A",
    //   export: true,
    //   wrap: true,
    //   width: "120px",
    // },
    {
      name: "Status",
      selector: (row) => row.status,
      exportValue: (row) => {
        switch (row.status) {
          case 1:
            return "Active";
          case 2:
            return "Closed";
          case 0:
            return "Pending";
          default:
            return "N/A";
        }
      },
      export: true,
      width: "100px",
      cell: (row) => {
        let bgColor = "";
        let textColor = "text-white";
        let label = "";

        switch (row.status) {
          case 1:
            bgColor = "bg-green-300"; // light green for Active
            textColor = "text-black";
            label = "Active";
            break;
          case 2:
            bgColor = "bg-green-700"; // dark green for Closed
            textColor = "text-white";
            label = "Closed";
            break;
          case 0:
            bgColor = "bg-yellow-400"; // yellow for Pending
            textColor = "text-black";
            label = "Pending";
            break;
          default:
            bgColor = "bg-gray-300";
            textColor = "text-black";
            label = "Unknown";
        }

        return (
          <span
            className={`px-2 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor}`}
          >
            {label}
          </span>
        );
      },
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
      width: "90px",
      export: false,
    },
  ];

  return (
    <Content
      Page_title="Help Desk"
      button_title="Back"
      button_status={true}
      route="/superadmin/dashboard"
    >
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
