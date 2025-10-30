import React, { useEffect, useState } from "react";
import Datatable from "../../../extracomponents/DatatablePagination";
import { Eye } from "lucide-react";
import { GetContestsList } from "../../../services/SuperAdmin";
import { getContestRanking } from "../../../services/User";
import Content from "../../../components/superadmin/Content";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Winnings = () => {
  const navigate = useNavigate();
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterText, setFilterText] = useState("");

  const token = localStorage.getItem("token");

  // 🧩 Fetch contests list
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

  useEffect(() => {
    fetchContests(currentPage, rowsPerPage, filterText);
  }, [currentPage, rowsPerPage, filterText]);

  // 🔍 Handle pagination + filter
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

  // 👁 Show participants and their winnings
  const handleViewParticipants = async (contest) => {
    try {
      const response = await getContestRanking(token, {
        contest_id: contest._id,
      });

      if (
        response?.status &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        const participants = response.data;
        const prizeMap = {};

        // Build map: rank → amount
        contest.prize_distribution?.forEach((prize) => {
          prizeMap[prize.rank] = prize.amount;
        });

        // Build table rows
        const rows = participants
          .map((p, i) => {
            const winning = prizeMap[p.rank] || 0;
            return `
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding:8px;">${i + 1}</td>
                <td style="padding:8px;">${p.client_id?.FullName ?? "N/A"}</td>
                <td style="padding:8px;">${p.rank ?? "-"}</td>
                <td style="padding:8px;">₹${winning}</td>
              </tr>`;
          })
          .join("");

        const htmlContent = `
          <div style="text-align:left;">
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr style="border-bottom:1px solid #ddd;background:#f8f9fa;">
                  <th style="padding:8px;">#</th>
                  <th style="padding:8px;">Name</th>
                  <th style="padding:8px;">Rank</th>
                  <th style="padding:8px;">Winning Amount</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>`;

        Swal.fire({
          title: "Participants & Winnings",
          html: htmlContent,
          width: 600,
          confirmButtonText: "Close",
        });
      } else {
        Swal.fire("No Data", "No participants found for this contest.", "info");
      }
    } catch (error) {
      console.error("Error fetching participants:", error);
      Swal.fire("Error", "Failed to fetch participants.", "error");
    }
  };

  // 🧱 Table columns
  const columns = [
    {
      name: "Contest Name",
      selector: (row) => row.name || "N/A",
      sortable: true,
      width: "160px",
    },
    {
      name: "Tournament Name",
      selector: (row) => row.tournament_id?.name || "N/A",
      sortable: true,
      width: "180px",
    },
    {
      name: "Type",
      selector: (row) => {
        const types = [];
        if (row.is_guaranteed) types.push("Guaranteed");
        if (row.is_private) types.push("Private");
        return types.length > 0 ? types.join(", ") : "-";
      },
      // width: "120px",
    },
    {
      name: "End Date",
      selector: (row) =>
        row.tournament_id?.enddate
          ? new Date(row.tournament_id.enddate).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })
          : "N/A",
      width: "180px",
    },
    // {
    //   name: "Entry Fee",
    //   selector: (row) => `₹${row.entry_fee || 0}`,
    //   width: "100px",
    // },
    // {
    //   name: "Prize Pool",
    //   selector: (row) => `₹${row.prize_pool || 0}`,
    //   width: "120px",
    // },
    {
      name: "Action",
      cell: (row) => (
        <Eye
          size={22}
          className="text-green-600 cursor-pointer"
          onClick={() => handleViewParticipants(row)}
        />
      ),
      width: "80px",
    },
  ];

  return (
    <Content
      Page_title="Winnings"
      button_title="Back"
      button_status={true}
      route="/superadmin/dashboard"
    >
      <div className="p-2">
        <div className="shadow-lg rounded-xl p-4 bg-white">
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
            progressPending={loading}
          />
        </div>
      </div>
    </Content>
  );
};

export default Winnings;
