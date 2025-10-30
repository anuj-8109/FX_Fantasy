import React, { useEffect, useState } from "react";
import Datatable from "../../../extracomponents/DatatablePagination";
import { GetTournament } from "../../../services/SuperAdmin";
import Content from "../../../components/superadmin/Content";
import { Eye } from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function CancelledTournament() {
  const navigate = useNavigate();
  const [tournament, setTournament] = useState([]);
  const [allCancelledTournaments, setAllCancelledTournaments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewData, setViewData] = useState(null);

  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterText, setFilterText] = useState("");

  const token = localStorage.getItem("token");

  // ✅ Fetch ALL tournaments from ALL pages
  const fatchTournament = async () => {
    setLoading(true);
    try {
      let allTournaments = [];
      let currentApiPage = 1;
      let totalPages = 1;

      // ✅ Fetch all pages from API
      while (currentApiPage <= totalPages) {
        const params = new URLSearchParams({
          page: currentApiPage,
          limit: 100, // Fetch more at once to reduce API calls
        });

        const res = await GetTournament(token, params.toString());

        if (res?.status && res.data) {
          allTournaments = [...allTournaments, ...res.data];
          
          // Update total pages from pagination response
          if (res.pagination) {
            totalPages = res.pagination.totalPages || 1;
          }
          
          currentApiPage++;
        } else {
          break;
        }
      }

      // ✅ Filter ONLY cancelled tournaments (where status = "cancelled" and del = false)
      const cancelledOnly = allTournaments.filter(
        (t) => t.status === "cancelled" 
      );

      setAllCancelledTournaments(cancelledOnly);
      
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      toast.error("Error fetching tournaments");
      setAllCancelledTournaments([]);
    }
    setLoading(false);
  };

  // ✅ Apply search filter and pagination on client side
  useEffect(() => {
    let filtered = [...allCancelledTournaments];

    // Apply search filter
    if (filterText && filterText.trim() !== "") {
      filtered = filtered.filter((t) =>
        t.name.toLowerCase().includes(filterText.toLowerCase().trim())
      );
    }

    // Set total after filtering
    setTotalRows(filtered.length);

    // Apply client-side pagination
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginated = filtered.slice(startIndex, endIndex);

    setTournament(paginated);
  }, [allCancelledTournaments, currentPage, rowsPerPage, filterText]);

  // Fetch data only once on mount
  useEffect(() => {
    fatchTournament();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newPerPage) => {
    setRowsPerPage(newPerPage);
    setCurrentPage(1);
  };

  const handleFilterChange = (text) => {
    setFilterText(text);
    setCurrentPage(1);
  };

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      exportValue: (row) => row.name || "N/A",
      export: true,
      width: "180px",
      sortable: true,
    },
    // {
    //   name: "Status",
    //   selector: (row) => row.status,
    //   exportValue: (row) => row.status || "N/A",
    //   export: true,
    //   width: "140px",
    //   cell: (row) => {
    //     return (
    //       <span className="px-2 py-1 rounded-full text-sm font-medium bg-red-500 text-white">
    //         Cancelled
    //       </span>
    //     );
    //   },
    // },
    {
      name: "Stocks",
      selector: (row) =>
        row.stocks?.length > 0
          ? row.stocks.map((s) => s.stock_name).join(", ")
          : "N/A",
      exportValue: (row) =>
        row.stocks?.length > 0
          ? row.stocks.map((s) => s.stock_name).join(", ")
          : "N/A",
      export: true,
      width: "180px",
    },
    {
      name: "Virtual Amount",
      selector: (row) => row.useamount || "N/A",
      exportValue: (row) => row.useamount || "N/A",
      export: true,
      width: "140px",
    },
    {
      name: "Start Date",
      selector: (row) => new Date(row.startdate).toLocaleString(),
      exportValue: (row) => row.startdate || "N/A",
      export: true,
      width: "170px",
      sortable: true,
    },
    {
      name: "End Date",
      selector: (row) => new Date(row.enddate).toLocaleString(),
      exportValue: (row) => row.enddate || "N/A",
      export: true,
      width: "170px",
      sortable: true,
    },
    {
      name: "Cancelled Date",
      selector: (row) => 
        row.updated_at ? new Date(row.updated_at).toLocaleString() : "N/A",
      exportValue: (row) => row.updated_at || "N/A",
      export: true,
      width: "170px",
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <Eye
          className="text-green-600 cursor-pointer hover:text-green-700"
          size={25}
          onClick={() => openViewModal(row)}
        />
      ),
      export: false,
      width: "100px",
    },
    {
      name: "Contest",
      cell: (row) => (
        <button
          className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          onClick={() =>
            navigate("/superadmin/tournamentcontest", {
              state: { tournament_id: row._id },
            })
          }
        >
          View
        </button>
      ),
      export: false,
      width: "130px",
    },
  ];

  const openViewModal = (data) => {
    setViewData(data);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setViewData(null);
  };

  return (
    <Content
      Page_title="Cancelled Tournaments"
      button_title="Back"
      button_status={true}
      route="/superadmin/dashboard"
    >
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Datatable
            columns={columns}
            data={tournament}
            totalRows={totalRows}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onRefresh={fatchTournament}
            filterText={filterText}
            onFilterChange={handleFilterChange}
          />
        )}
      </div>

      {/* View Modal */}
      {viewModalOpen && viewData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-md w-[650px] max-h-[80vh] overflow-y-auto hide-scrollbar">
            <h2 className="text-lg font-bold mb-4">Tournament Details</h2>
            <div className="space-y-3">
              <div>
                <strong>Name:</strong> {viewData.name || "N/A"}
              </div>
              <div>
                <strong>Status:</strong>{" "}
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm font-medium">
                  Cancelled
                </span>
              </div>
              <div>
                <strong>Virtual Amount:</strong> {viewData.useamount || "N/A"}
              </div>
              <div>
                <strong>Start Date:</strong>{" "}
                {new Date(viewData.startdate).toLocaleString()}
              </div>
              <div>
                <strong>End Date:</strong>{" "}
                {new Date(viewData.enddate).toLocaleString()}
              </div>
              <div>
                <strong>Cancelled Date:</strong>{" "}
                {viewData.updated_at
                  ? new Date(viewData.updated_at).toLocaleString()
                  : "N/A"}
              </div>
              <div>
                <strong>Stocks:</strong>{" "}
                {viewData.stocks && viewData.stocks.length > 0
                  ? viewData.stocks.map((s) => s.stock_name).join(", ")
                  : "N/A"}
              </div>
              <div>
                <strong>Description:</strong>
                <div
                  className="border rounded p-2 mt-1 max-h-40 overflow-y-auto"
                  dangerouslySetInnerHTML={{
                    __html: viewData.description || "N/A",
                  }}
                />
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                onClick={closeViewModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Content>
  );
}

export default CancelledTournament;