import React, { useEffect, useState } from "react";
import Datatable from "../../../extracomponents/DatatablePagination";
import { Edit, Eye, Trash2 } from "lucide-react";
import {
  GetContestsList,
  DeleteContest,
  UpdateContestStatusActive,
  UpdateContestStatus,
} from "../../../services/SuperAdmin";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Content from "../../../components/superadmin/Content";
import { useNavigate } from "react-router-dom";

const Contest = () => {
  const navigate = useNavigate();
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterText, setFilterText] = useState("");

  const token = localStorage.getItem("token");

  const fetchContests = async (
    page = currentPage,
    limit = rowsPerPage,
    filter = filterText
  ) => {
    setLoading(true);
    try {
      const response = await GetContestsList(token, { page, limit, filter });
      if (response?.status) {
        setContests(response.data || []);
        setTotalRows(response.pagination?.total || 0);
      } else {
        toast.error(response?.message || "Failed to load contests");
      }
    } catch (err) {
      toast.error("Something went wrong while fetching contests");
    }
    setLoading(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchContests(page, rowsPerPage, filterText);
  };

  const handleRowsPerPageChange = (newPerPage) => {
    setRowsPerPage(newPerPage);
    setCurrentPage(1);
    fetchContests(1, newPerPage, filterText);
  };

  const handleFilterChange = (text) => {
    setFilterText(text);
    setCurrentPage(1);
    fetchContests(1, rowsPerPage, text);
  };

  useEffect(() => {
    fetchContests(currentPage, rowsPerPage, filterText);
  }, [currentPage, rowsPerPage, filterText]);

  const handleCancelContest = async (row) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this contest? Refund will be processed.",
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

      const res = await UpdateContestStatus(token, payload);

      if (res?.status) {
        toast.success(res?.message || "Contest cancelled successfully!");
        fetchContests();
      } else {
        toast.error(res?.message || "Failed to cancel contest");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }

    setLoading(false);
  };

  const handleStatusChange = async (contest) => {
    const actionText = contest.activestatus ? "Deactivate" : "Activate";

    const confirm = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to ${actionText} this contest?`,
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
      id: contest._id,
      status: contest.activestatus ? "false" : "true",
    };

    const res = await UpdateContestStatusActive(token, payload);

    if (res?.status) {
      toast.success(res?.message || `Contest ${actionText}d successfully`);
      fetchContests();
    } else {
      toast.error(res?.message || "Failed to change status");
    }
  };

  const columns = [
    {
      name: "Tournament Name",
      selector: (row) => row.tournament_id?.name || "N/A",
      exportValue: (row) => row.tournament_id?.name || "N/A",
      export: true,
      sortable: true,
      width: "160px",
    },
    {
      name: "Contest Name",
      selector: (row) => row.name,
      exportValue: (row) => row.name || "N/A",
      export: true,
      sortable: true,
      width: "160px",
    },
    {
      name: "Entry Fee",
      selector: (row) => row.entry_fee,
      exportValue: (row) => row.entry_fee || "N/A",
      export: true,
      width: "90px",
    },
    {
      name: "Total Spots",
      selector: (row) => `${row.filled_spots || 0}/${row.total_spots || 0}`,
      exportValue: (row) => `${row.filled_spots || 0}/${row.total_spots || 0}`,
      export: true,
      cell: (row) => (
        <span>
          {row.filled_spots || 0}/{row.total_spots || 0}
        </span>
      ),
      width: "110px",
    },
    {
      name: "Prize Pool",
      selector: (row) => row.prize_pool,
      exportValue: (row) => row.prize_pool || "N/A",
      export: true,
      width: "90px",
    },
    {
      name: "Type",
      selector: (row) => {
        const types = [];
        if (row.is_guaranteed) types.push("Guaranteed");
        if (row.is_private) types.push("Private");
        return types.length > 0 ? types.join(", ") : "-";
      },
      exportValue: (row) => {
        const types = [];
        if (row.is_guaranteed) types.push("Guaranteed");
        if (row.is_private) types.push("Private");
        return types.length > 0 ? types.join(", ") : "-";
      },
      export: true,
      width: "100px",
    },
    {
      name: "Status",
      selector: (row) => (row.activestatus === true ? "Active" : "Inactive"),
      exportValue: (row) => (row.activestatus === true ? "Active" : "Inactive"),
      cell: (row) => {
        const now = new Date();
        const startDate = new Date(row.tournament_id?.startdate);
        const endDate = new Date(row.tournament_id?.enddate);
        const isLive = now >= startDate && now <= endDate;
        const isCompleted = now > endDate;

        return (
          <label
            className={`relative inline-flex items-center ${
              row.filled_spots > 0 || isLive || isCompleted
                ? "cursor-not-allowed opacity-60"
                : "cursor-pointer"
            }`}
            onClick={(e) => {
              e.preventDefault();

              if (row.filled_spots > 0) {
                toast.error(
                  "Cannot change status. Some spots are already filled."
                );
                return;
              }
              if (isLive || isCompleted) {
                toast.error(
                  "Cannot change status for a live or completed tournament's contest."
                );
                return;
              }

              handleStatusChange(row);
            }}
          >
            <input
              type="checkbox"
              checked={row?.activestatus === true}
              readOnly
              className="sr-only peer"
            />
            <div
              className={`w-11 h-6 rounded-full transition-colors ${
                row.activestatus ? "bg-green-600" : "bg-gray-300"
              }`}
            ></div>
            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full border peer-checked:translate-x-full transition-transform"></div>
          </label>
        );
      },
      width: "70px",
      export: true,
    },
    {
      name: "Action",
      cell: (row) => {
        const now = new Date();
        const startDate = new Date(row.tournament_id?.startdate);
        const endDate = new Date(row.tournament_id?.enddate);
        const isLive = now >= startDate && now <= endDate;
        const isCompleted = now > endDate;
        const isUpcoming = now < startDate;

        return (
          <div className="flex gap-3 items-center">
            {/* View */}
            <Eye
              className="text-green-600 cursor-pointer"
              size={25}
              onClick={() =>
                navigate(`/superadmin/viewcontest/${row._id}`, { state: row })
              }
            />

            {/* Edit */}
            <Edit
              className={`${
                isLive || isCompleted
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 cursor-pointer"
              }`}
              size={25}
              onClick={() => {
                if (isLive || isCompleted) return;
                navigate("/superadmin/add-contest", {
                  state: { contest: row },
                });
              }}
            />

            {/* Cancel (instead of Delete) */}
            {/* <button
              className={`px-3 py-1 rounded text-white text-sm transition ${
                isUpcoming
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!isUpcoming}
              onClick={() => {
                if (isUpcoming) handleCancelContest(row);
              }}
            >
              Cancel
            </button> */}
          </div>
        );
      },
      export: false,
      width: "180px",
    },
  ];

  return (
    <Content
      Page_title="Contest Management"
      button_title="Back"
      button_status={true}
      route="/superadmin/dashboard"
      // extra_button="+ Add Contest"
      extra_button_action={() => navigate("/superadmin/add-contest")}
    >
      <div className="p-2">
        <div className="shadow-lg rounded-xl p-4">
          <Datatable
            columns={columns}
            data={contests}
            totalRows={totalRows}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            filterText={filterText}
            onFilterChange={handleFilterChange}
            onRefresh={() =>
              fetchContests({
                page: currentPage,
                limit: rowsPerPage,
                filter: filterText,
              })
            }
          />
        </div>
      </div>
    </Content>
  );
};

export default Contest;
