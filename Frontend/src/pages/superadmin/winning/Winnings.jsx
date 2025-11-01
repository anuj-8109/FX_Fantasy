import React, { useEffect, useState } from "react";
import Datatable from "../../../extracomponents/DatatablePagination";
import { Eye } from "lucide-react";
import { GetContestsList,GetContestRankingSuperAmin,GetContestDetails } from "../../../services/SuperAdmin";
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
// const handleViewParticipants = async (contest) => {
//   try {
//     // ✅ 1. Fetch participants
//     const rankingRes = await GetContestRankingSuperAmin(token, {
//       contest_id: contest._id,
//     });

//     // ✅ 2. Fetch prize distribution
//     const detailsRes = await GetContestDetails(token, contest._id);

//     const prizeDistribution = detailsRes?.data?.prize_distribution || [];
//     const prizeMap = {};
//     prizeDistribution.forEach((p) => {
//       prizeMap[p.rank] = p.amount;
//     });

//     let htmlContent = "";

//     // ✅ CASE 1: No participants in contest
//     if (!rankingRes?.status || rankingRes.data.length === 0) {
//       htmlContent = `
//         <div style="padding:20px; text-align:center;">
//             <img src="https://cdn-icons-png.flaticon.com/512/4076/4076500.png" width="90" style="opacity:0.6;"/>
//             <h3 style="margin-top:10px; color:#666;">No Participants Found</h3>
//             <p style="color:#888;">This contest has no joined users yet.</p>
//         </div>
//       `;
//     } 
//     else {
//       // ✅ CASE 2: Participants Exist → build table
//       const rows = rankingRes.data
//         .map((p) => {
//           const winning = prizeMap[p.rank] || 0;
//           return `
//             <tr style="border-bottom: 1px solid #eee;">
//               <td style="padding:10px;">${p.client_id?.FullName ?? "N/A"}</td>
//               <td style="padding:10px;">${p.rank ?? "-"}</td>
//               <td style="padding:10px;">₹${winning}</td>
//             </tr>`;
//         })
//         .join("");

//       htmlContent = `
//         <div style="text-align:left;">
//           <table style="width:100%; border-collapse:collapse;">
//             <thead>
//               <tr style="background:#f5f6f8; border-bottom:1px solid #ddd;">
//                 <th style="padding:10px;">Name</th>
//                 <th style="padding:10px;">Rank</th>
//                 <th style="padding:10px;">Winning Amount</th>
//               </tr>
//             </thead>
//             <tbody>${rows}</tbody>
//           </table>
//         </div>
//       `;
//     }

//     // ✅ SweetAlert modal
//     Swal.fire({
//       title: "Participants & Winnings",
//       html: htmlContent,
//       width: 600,
//       confirmButtonText: "Close",
//     });

//   } catch (error) {
//     console.error("Error:", error);
//     Swal.fire("Error", "Something went wrong.", "error");
//   }
// };

const handleViewParticipants = async (contest) => {
  try {
    // ✅ 1. Fetch participants
    const rankingRes = await GetContestRankingSuperAmin(token, {
      contest_id: contest._id,
    });

    // ✅ 2. Fetch prize distribution
    const detailsRes = await GetContestDetails(token, contest._id);

    const prizeDistribution = detailsRes?.data?.prize_distribution || [];
    const prizeMap = {};
    prizeDistribution.forEach((p) => {
      prizeMap[p.rank] = p.amount;
    });

    let htmlContent = "";

    // ✅ CASE 1: No participants in contest
    if (!rankingRes?.status || rankingRes.data.length === 0) {
      htmlContent = `
        <div style="
          display:flex;
          flex-direction:column;
          justify-content:center;
          align-items:center;
          padding:25px;
          text-align:center;
        ">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/4076/4076500.png" 
              width="90" 
              style="opacity:0.8; margin-bottom:15px;"
            />

            <h3 style="margin:0; font-size:20px; color:#444;">
              No Participants Found
            </h3>

            <p style="color:#777; font-size:14px; margin-top:5px;">
              This contest has no joined users yet.
            </p>
        </div>
      `;
    } 
    else {
      // ✅ CASE 2: Participants Exist → build table
      const rows = rankingRes.data
        .map((p) => {
          const winning = prizeMap[p.rank] || 0;
          return `
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding:10px;">${p.client_id?.FullName ?? "N/A"}</td>
              <td style="padding:10px;">${p.rank ?? "-"}</td>
              <td style="padding:10px;">₹${winning}</td>
            </tr>`;
        })
        .join("");

      htmlContent = `
        <div style="text-align:left;">
          <table style="width:100%; border-collapse:collapse;">
            <thead>
              <tr style="background:#f5f6f8; border-bottom:1px solid #ddd;">
                <th style="padding:10px;">Name</th>
                <th style="padding:10px;">Rank</th>
                <th style="padding:10px;">Winning Amount</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      `;
    }

    // ✅ SweetAlert modal
    Swal.fire({
      title: "Participants & Winnings",
      html: htmlContent,
      width: 600,
      confirmButtonText: "Close",
    });

  } catch (error) {
    console.error("Error:", error);
    Swal.fire("Error", "Something went wrong.", "error");
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
