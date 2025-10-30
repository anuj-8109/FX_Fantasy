import React, { useEffect, useState } from "react";
import Datatable from "../../../extracomponents/DatatablePagination";
import {
  GetTournament,
  UpdateTournamentStatusActive,
  UpdateTournamentStatus,
} from "../../../services/SuperAdmin";
import Content from "../../../components/superadmin/Content";
import { Eye, Edit } from "lucide-react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function Tournament() {
  const navigate = useNavigate();
  const [tournament, setTournament] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewData, setViewData] = useState(null);

  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterText, setFilterText] = useState("");

  const token = localStorage.getItem("token");

  const openViewModal = (data) => {
    setViewData(data);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setViewData(null);
  };

  const handleCancel = async (row) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this tournament? This action will process refunds.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it",
      customClass: {
        popup: "custom-swal-popup",
        title: "custom-swal-title",
        htmlContainer: "custom-swal-text",
        confirmButton: "custom-swal-confirm",
        cancelButton: "custom-swal-cancel",
      },
    });

    if (!result.isConfirmed) return;

    setLoading(true);

    try {
      const payload = {
        id: row._id,
        status: "cancelled",
      };

      const res = await UpdateTournamentStatus(payload, token);

      if (res?.status) {
        toast.success(res?.message || "Tournament cancelled successfully!");
        fetchTournament();
      } else {
        toast.error(res?.message || "Failed to cancel tournament");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }

    setLoading(false);
  };

  const handleStatusChange = async (tournament) => {
    const isActive =
      tournament.activestatus === true || tournament.activestatus === 1;
    const actionText = isActive ? "Deactivate" : "Activate";

    const confirm = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to ${actionText} this tournament?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${actionText}`,
      cancelButtonText: "Cancel",
      customClass: {
        popup: "custom-swal-popup",
        title: "custom-swal-title",
        htmlContainer: "custom-swal-text",
        confirmButton: "custom-swal-confirm",
        cancelButton: "custom-swal-cancel",
      },
    });

    if (!confirm.isConfirmed) return;

    const payload = {
      id: tournament._id,
      status: tournament.activestatus === true ? false : true,
    };

    try {
      const res = await UpdateTournamentStatusActive(payload, token);

      if (res?.status) {
        toast.success(res?.message || `Tournament ${actionText}d`);
        fetchTournament();
      } else {
        toast.error(res?.message || "Failed to change status");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      exportValue: (row) => row.name || "N/A",
      export: true,
      sortable: true,
      width: "180px",
    },
    {
      name: "Status",
      selector: (row) => row.status,
      exportValue: (row) => row.status || "N/A",
      export: true,
      width: "140px",
      cell: (row) => {
        let bgColor = "";
        let textColor = "text-white";
        const status =
          row.status?.charAt(0).toUpperCase() +
          row.status?.slice(1).toLowerCase();

        switch (row.status) {
          case "live":
            bgColor = "bg-green-300";
            textColor = "text-black";
            break;
          case "completed":
            bgColor = "bg-green-700";
            textColor = "text-white";
            break;
          case "upcoming":
            bgColor = "bg-yellow-400";
            textColor = "text-black";
            break;
          case "cancelled":
            bgColor = "bg-red-500";
            textColor = "text-white";
            break;
          default:
            bgColor = "bg-gray-300";
            textColor = "text-black";
        }

        return (
          <span
            className={`px-2 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor}`}
          >
            {status || "N/A"}
          </span>
        );
      },
    },
    {
      name: "Stock",
      selector: (row) =>
        row.stocks && row.stocks.length > 0
          ? row.stocks.map((s) => s.stock_name).join(", ")
          : "N/A",
      exportValue: (row) => row.stocks || "N/A",
      export: true,
      width: "150px",
    },
    {
      name: "Virtual Amount",
      selector: (row) => row.useamount || "N/A",
      exportValue: (row) => row.useamount || "N/A",
      export: true,
      width: "120px",
    },
    {
      name: "Start Date",
      selector: (row) => new Date(row.startdate).toLocaleString(),
      exportValue: (row) => row.startdate || "N/A",
      export: true,
      sortable: true,
      width: "155px",
    },
    {
      name: "End Date",
      selector: (row) => new Date(row.enddate).toLocaleString(),
      exportValue: (row) => row.enddate || "N/A",
      export: true,
      sortable: true,
      width: "155px",
    },
    {
      name: "Status",
      selector: (row) => (row.activestatus ? "Active" : "Inactive"),
      exportValue: (row) => (row.activestatus ? "Active" : "Inactive"),
      cell: (row) => {
        const isDisabled = row.status === "live" || row.status === "completed";

        return (
          <label
            className={`relative inline-flex items-center ${
              isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <input
              type="checkbox"
              checked={row?.activestatus === true}
              onChange={() => {
                if (!isDisabled) handleStatusChange(row);
              }}
              className="sr-only peer"
              disabled={isDisabled}
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-green-600 transition-colors"></div>
            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full border border-gray-300 peer-checked:translate-x-full peer-checked:border-green-600 transition-transform"></div>
          </label>
        );
      },
      width: "80px",
      export: true,
    },
    {
      name: "Action",
      cell: (row) => {
        const now = new Date();
        const startDate = new Date(row.startdate);
        const endDate = new Date(row.enddate);
        const isLive = now >= startDate && now <= endDate;
        const isCompleted = now > endDate;
        const isUpcoming = now < startDate;

        return (
          <div className="flex gap-3 items-center">
            <Eye
              className="text-green-600 cursor-pointer"
              size={25}
              onClick={() => openViewModal(row)}
            />
            <Edit
              className={`${
                isLive || isCompleted
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:text-blue-700 cursor-pointer"
              }`}
              size={22}
              onClick={() => {
                if (!isLive && !isCompleted) {
                  navigate("/superadmin/add-tournament", {
                    state: { tournament: row },
                  });
                }
              }}
            />
            <button
              className={`px-3 py-1 rounded text-white text-sm transition ${
                isUpcoming
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!isUpcoming}
              onClick={() => {
                if (isUpcoming) handleCancel(row);
              }}
            >
              Cancel
            </button>
          </div>
        );
      },
      export: false,
      width: "210px",
    },
    {
      name: "Contest",
      cell: (row) => (
        <div className="flex gap-2">
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
          <button
            className={`px-3 py-2 rounded text-white transition ${
              row.status === "upcoming"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={row.status !== "upcoming"}
            onClick={() => {
              if (row.status === "upcoming") {
                navigate("/superadmin/add-contest", {
                  state: { tournament_id: row._id },
                });
              }
            }}
          >
            Add
          </button>
        </div>
      ),
      export: false,
      width: "150px",
    },
  ];

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

  // const fetchTournament = async () => {
  //   setLoading(true);
  //   try {
  //     const params = new URLSearchParams({
  //       page: currentPage,
  //       limit: rowsPerPage,
  //     });

  //     if (filterText) {
  //       params.append("search", filterText);
  //     }

  //     const res = await GetTournament(token, params.toString());

  //     if (res?.status) {
  //       const now = new Date();
  //       const updatedData = res.data.map((t) => {
  //         const start = new Date(t.startdate);
  //         const end = new Date(t.enddate);

  //         let newStatus = t.status;
  //         if (start > now) newStatus = "upcoming";
  //         else if (start <= now && end >= now) newStatus = "live";
  //         else if (end < now) newStatus = "completed";

  //         return { ...t, status: newStatus };
  //       });

  //       setTournament(updatedData);
  //       setTotalRows(res.pagination?.total || 0);
  //     } else {
  //       toast.error(res?.message || "Failed to fetch");
  //     }
  //   } catch (error) {
  //     toast.error("Error fetching tournaments");
  //   }
  //   setLoading(false);
  // };

  const fetchTournament = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: rowsPerPage,
      });

      if (filterText) {
        params.append("search", filterText);
      }

      const res = await GetTournament(token, params.toString());

      if (res?.status) {
        // Directly use backend status
        setTournament(res.data);
        setTotalRows(res.pagination?.total || 0);
      } else {
        toast.error(res?.message || "Failed to fetch");
      }
    } catch (error) {
      toast.error("Error fetching tournaments");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTournament();
  }, [currentPage, rowsPerPage, filterText]);

  return (
    <Content
      Page_title="Tournament"
      button_title="Back"
      button_status={true}
      route="/superadmin/dashboard"
      extra_button="Add Tournament"
      extra_button_action="/superadmin/add-tournament"
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
            onRefresh={fetchTournament}
            filterText={filterText}
            onFilterChange={handleFilterChange}
          />
        )}
      </div>

      {/* View Modal */}
      {viewModalOpen && viewData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 mt-10">
          <div className="bg-white p-6 rounded-md w-[650px] max-h-[80vh] overflow-y-auto hide-scrollbar">
            <h2 className="text-lg font-bold mb-4">Tournament Details</h2>
            <div className="space-y-3">
              <div>
                <strong>Name:</strong> {viewData.name || "N/A"}
              </div>
              <div>
                <strong>Status:</strong> {viewData.status || "N/A"}
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

export default Tournament;
