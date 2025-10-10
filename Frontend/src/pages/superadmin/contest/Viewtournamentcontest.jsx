import React, { useEffect, useState } from "react";
import Datatable from "../../../extracomponents/DatatablePagination";
import { Eye, Edit, Trash2 } from "lucide-react";
import {
  getContestsByTournamentId,
  DeleteContest,
  UpdateContestStatusActive,
} from "../../../services/SuperAdmin";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Content from "../../../components/superadmin/Content";
import { useNavigate, useLocation } from "react-router-dom";

const TournamentContests = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const tournament_id = location.state?.tournament_id;
  const tournament_name = location.state?.tournament_name || "Tournament";

  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterText, setFilterText] = useState("");

  // ✅ Fetch contests for this tournament
  const fetchContests = async (
    page = currentPage,
    limit = rowsPerPage,
    filter = filterText
  ) => {
    if (!tournament_id) return;
    setLoading(true);
    try {
      const response = await getContestsByTournamentId(token, tournament_id, {
        page,
        limit,
        filter,
      });

      if (response?.status) {
        setContests(response?.contests || []);
        setTotalRows(response?.pagination?.total || response?.contests?.length || 0);
      } else {
        toast.error(response?.message || "Failed to load contests");
      }
    } catch (error) {
      toast.error("Something went wrong while fetching contests");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (tournament_id) fetchContests(currentPage, rowsPerPage, filterText);
  }, [tournament_id, currentPage, rowsPerPage, filterText]);

  // ✅ Handle pagination and filters
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

  // ✅ Delete Contest
  const handleDelete = async (contest) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this contest?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton:
          "px-2 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition",
        cancelButton:
          "px-2 py-2 rounded-lg text-white bg-gray-500 hover:bg-gray-600 transition",
      },
    });

    if (!confirm.isConfirmed) return;

    setLoading(true);
    const response = await DeleteContest(token, contest._id);
    setLoading(false);

    if (response?.status) {
      toast.success(response?.message || "Contest deleted successfully");
      fetchContests();
    } else {
      toast.error(response?.message || "Failed to delete contest");
    }
  };

  // ✅ Change Active/Inactive Status
  const handleStatusChange = async (contest) => {
    const actionText = contest.activestatus ? "Deactivate" : "Activate";

    const confirm = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to ${actionText} this contest?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${actionText}`,
      cancelButtonText: "Cancel",
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

  // ✅ Table Columns
  const columns = [
    {
      name: "Contest Name",
      selector: (row) => row.name,
      exportValue: (row) => row.name || "N/A",
      sortable: true,
      width: "160px",
    },
    {
      name: "Entry Fee",
      selector: (row) => row.entry_fee,
      exportValue: (row) => row.entry_fee || "N/A",
      width: "90px",
    },
    {
      name: "Total Spots",
      selector: (row) => `${row.filled_spots || 0}/${row.total_spots || 0}`,
      exportValue: (row) => `${row.filled_spots || 0}/${row.total_spots || 0}`,
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
      width: "150px",
    },
    {
      name: "Status",
      selector: (row) => (row.activestatus === true ? "Active" : "Inactive"),
      exportValue: (row) => (row.activestatus === true ? "Active" : "Inactive"),
      cell: (row) => (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={row?.activestatus === true}
            onChange={() => handleStatusChange(row)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-600 transition-colors"></div>
          <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full border peer-checked:translate-x-full transition-transform"></div>
        </label>
      ),
      width: "100px",
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-3">
          <Eye
            className="cursor-pointer text-green-600"
            size={25}
            onClick={() =>
              navigate(`/superadmin/viewcontest/${row._id}`, { state: row })
            }
          />
          <Edit
            className="cursor-pointer text-blue-600"
            size={25}
            onClick={() =>
              navigate("/superadmin/add-contest", { state: { contest: row } })
            }
          />
          <Trash2
            className="cursor-pointer text-red-600"
            size={25}
            onClick={() => handleDelete(row)}
          />
        </div>
      ),
      width: "120px",
    },
  ];

  return (
    <Content
      Page_title={`${tournament_name} Contests`}
      button_title="Back"
      button_status={true}
      route="/superadmin/tournament"
      extra_button="+ Add Contest"
      extra_button_action={() =>
        navigate("/superadmin/add-contest", {
          state: { tournament_id },
        })
      }
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
              fetchContests(currentPage, rowsPerPage, filterText)
            }
          />
        </div>
      </div>
    </Content>
  );
};

export default TournamentContests;
