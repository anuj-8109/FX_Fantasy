import React, { useEffect, useState } from "react";
import Datatable from "../../../extracomponents/DatatablePagination";
import {
  GetContestsList,
  UpdateContestStatusActive,
  DeleteContest,
} from "../../../services/SuperAdmin";
import Content from "../../../components/superadmin/Content";
import { Eye, Edit } from "lucide-react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function InactiveContest() {
  const navigate = useNavigate();
  const [contests, setContests] = useState([]);
  const [filteredContests, setFilteredContests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterText, setFilterText] = useState("");

  const token = localStorage.getItem("token");

  const fetchAllContests = async () => {
    setLoading(true);
    try {
      let allData = [];
      let page = 1;
      let totalPages = 1;

      while (page <= totalPages) {
        const res = await GetContestsList(token, { page, limit: 100 });
        if (res?.status) {
          allData = [...allData, ...res.data];
          totalPages = res.pagination?.totalPages || 1;
          page++;
        } else break;
      }

      const inactiveContests = allData.filter((c) => c.activestatus === false);
      setContests(inactiveContests);
    } catch (err) {
      toast.error("Error fetching contests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllContests();
  }, []);

  useEffect(() => {
    let filtered = contests;
    if (filterText.trim()) {
      filtered = contests.filter((c) =>
        c.name?.toLowerCase().includes(filterText.toLowerCase().trim())
      );
    }
    setTotalRows(filtered.length);
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    setFilteredContests(filtered.slice(start, end));
  }, [contests, currentPage, rowsPerPage, filterText]);

  const handleStatusChange = async (contest) => {
    const res = await UpdateContestStatusActive(token, {
      id: contest._id,
      status: "true",
    });
    if (res?.status) {
      toast.success("Activated successfully");
      // Update locally
      setContests((prev) => prev.filter((c) => c._id !== contest._id));
    } else {
      toast.error("Failed to activate");
    }
  };

  const handleDelete = async (contest) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this contest?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
    });
    if (!confirm.isConfirmed) return;

    const res = await DeleteContest(token, contest._id);
    if (res?.status) {
      toast.success("Contest deleted");
      setContests((prev) => prev.filter((c) => c._id !== contest._id));
    } else {
      toast.error("Failed to delete");
    }
  };

  const columns = [
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Entry Fee", selector: (row) => row.entry_fee },
    { name: "Prize Pool", selector: (row) => row.prize_pool },
    {
      name: "Status",
      cell: () => <span className="text-gray-500 font-semibold">Inactive</span>,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-3 items-center">
          <Eye
            className="text-green-600 cursor-pointer"
            onClick={() =>
              navigate(`/superadmin/viewcontest/${row._id}`, { state: row })
            }
          />
          <Edit
            className="text-blue-600 cursor-pointer"
            onClick={() =>
              navigate("/superadmin/add-contest", { state: { contest: row } })
            }
          />
          <button
            className="bg-green-600 text-white px-3 py-1 rounded"
            onClick={() => handleStatusChange(row)}
          >
            Activate
          </button>
        </div>
      ),
    },
  ];

  return (
    <Content
      Page_title="Inactive Contests"
      button_title="Back"
      button_status={true}
      route="/superadmin/dashboard"
    >
      <Datatable
        columns={columns}
        data={filteredContests}
        totalRows={totalRows}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={setRowsPerPage}
        filterText={filterText}
        onFilterChange={setFilterText}
        onRefresh={fetchAllContests}
        progressPending={loading}
      />
    </Content>
  );
}

export default InactiveContest;
