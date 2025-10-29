import React, { useEffect, useState } from "react";
import Datatable from "../../../extracomponents/DatatablePagination";
import { GetTournament } from "../../../services/SuperAdmin";
import Content from "../../../components/superadmin/Content";
import { Eye } from "lucide-react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function CompletedTournament() {
  const navigate = useNavigate();
  const [tournament, setTournament] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewData, setViewData] = useState(null);

  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterText, setFilterText] = useState("");

//   const fatchTournament = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const params = new URLSearchParams({
//         page: currentPage,
//         limit: rowsPerPage,
//       });
//       if (filterText) params.append("search", filterText);

//       const res = await GetTournament(token, params.toString());
//       if (res?.status) {
//         const now = new Date();
//         const filtered = res.data
//           .map((t) => {
//             const start = new Date(t.startdate);
//             const end = new Date(t.enddate);
//             let status = "upcoming";
//             if (start <= now && end >= now) status = "live";
//             else if (end < now) status = "completed";
//             return { ...t, status };
//           })
//           .filter((t) => t.status === "completed");

//         setTournament(filtered);
//         setTotalRows(res.pagination?.total);
//       } else toast.error(res?.message || "Failed to fetch");
//     } catch (error) {
//       toast.error("Error fetching tournaments");
//     }
//     setLoading(false);
//   };


// const fatchTournament = async () => {
//   setLoading(true);
//   try {
//     const token = localStorage.getItem("token");
//     const params = new URLSearchParams();
//     const res = await GetTournament(token, params.toString());

//     if (res?.status) {
//       const now = new Date();
//       const filtered = res.data
//         .map((t) => {
//           const start = new Date(t.startdate);
//           const end = new Date(t.enddate);
//           let status = "upcoming";
//           if (start <= now && end >= now) status = "live";
//           else if (end < now) status = "completed";
//           return { ...t, status };
//         })
//         .filter((t) => t.status === "completed");

//       // ✅ handle pagination manually after filtering
//       const startIdx = (currentPage - 1) * rowsPerPage;
//       const paginated = filtered.slice(startIdx, startIdx + rowsPerPage);

//       setTournament(paginated);
//       setTotalRows(filtered.length);
//     } else toast.error(res?.message || "Failed to fetch");
//   } catch (error) {
//     toast.error("Error fetching tournaments");
//   }
//   setLoading(false);
// };


const fatchTournament = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem("token");
    const res = await GetTournament(token);

    if (res?.status) {
      const now = new Date();
      const completed = res.data
        .map((t) => {
          const start = new Date(t.startdate);
          const end = new Date(t.enddate);
          let status = "upcoming";
          if (start <= now && end >= now) status = "live";
          else if (end < now) status = "completed";
          return { ...t, status };
        })
        .filter((t) => t.status === "completed");

      // ✅ If you have a search filter
      const filtered = filterText
        ? completed.filter((t) =>
            t.name.toLowerCase().includes(filterText.toLowerCase())
          )
        : completed;

      // ✅ Now paginate locally
      const startIndex = (currentPage - 1) * rowsPerPage;
      const paginatedData = filtered.slice(
        startIndex,
        startIndex + rowsPerPage
      );

      setTournament(paginatedData);
      setTotalRows(filtered.length); // pagination stays in sync
    } else {
      toast.error(res?.message || "Failed to fetch tournaments");
    }
  } catch (error) {
    toast.error("Error fetching tournaments");
  }
  setLoading(false);
};


  useEffect(() => {
    fatchTournament();
  }, [currentPage, rowsPerPage, filterText]);


   // ✅ Handle page change - fetch new data from server
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // ✅ Handle rows per page change
  const handleRowsPerPageChange = (newPerPage) => {
    setRowsPerPage(newPerPage);
    setCurrentPage(1);
  };

 const handleFilterChange = (text) => {
    setFilterText(text);
    setCurrentPage(1); // Reset to page 1 on search
  };

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      width: "200px",
      sortable: true,
    },
    {
      name: "Stocks",
      selector: (row) =>
        row.stocks?.length > 0
          ? row.stocks.map((s) => s.stock_name).join(", ")
          : "N/A",
      width: "200px",
    },
    {
      name: "Virtual Amount",
      selector: (row) => row.useamount || "N/A",
      width: "120px",
    },
    {
      name: "Start Date",
      selector: (row) => new Date(row.startdate).toLocaleString(),
      width: "160px",
    },
    {
      name: "End Date",
      selector: (row) => new Date(row.enddate).toLocaleString(),
      width: "160px",
    },
    {
      name: "Action",
      cell: (row) => (
        <Eye
          className="text-green-600 cursor-pointer"
          onClick={() => openViewModal(row)}
        />
      ),
      width: "80px",
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
      Page_title="Completed Tournaments"
      button_title="Back"
      button_status={true}
      route="/superadmin/dashboard"
    >
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

      {viewModalOpen && viewData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-md w-[650px] max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">Tournament Details</h2>
            <div className="space-y-3">
              <div>
                <strong>Name:</strong> {viewData.name}
              </div>
              <div>
                <strong>Virtual Amount:</strong> {viewData.useamount}
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
                {viewData.stocks?.map((s) => s.stock_name).join(", ")}
              </div>
              <div>
                <strong>Description:</strong>
                <div
                  className="border rounded p-2 mt-1 max-h-40 overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: viewData.description }}
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded"
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

export default CompletedTournament;
