import React from "react";
import DataTable from "react-data-table-component";
import Content from "../../../components/superadmin/Content";

function Winnings() {
  // Static data
  const data = [
  {
    id: 1,
    date: "2025-09-01",
    contestName: "Super Sixers League",
    type: "Fantasy Cricket",
    userName: "Rohit Sharma",
    winningAmount: "₹25,000",
    rank: 1,
  },
  {
    id: 2,
    date: "2025-09-10",
    contestName: "Football Kings Cup",
    type: "Fantasy Football",
    userName: "Virat Kohli",
    winningAmount: "₹15,000",
    rank: 3,
  },
  {
    id: 3,
    date: "2025-09-18",
    contestName: "All-Rounder Challenge",
    type: "Fantasy Cricket",
    userName: "Hardik Pandya",
    winningAmount: "₹40,000",
    rank: 2,
  },
  {
    id: 4,
    date: "2025-09-20",
    contestName: "Slam Dunk Showdown",
    type: "Fantasy Basketball",
    userName: "KL Rahul",
    winningAmount: "₹10,000",
    rank: 4,
  },
  {
    id: 5,
    date: "2025-09-25",
    contestName: "Legends Trophy",
    type: "Fantasy Cricket",
    userName: "MS Dhoni",
    winningAmount: "₹50,000",
    rank: 1,
  },
];


  // Table columns
  const columns = [
  { name: "Date", selector: (row) => row.date, sortable: true, width: "130px" },
  { name: "Contest Name", selector: (row) => row.contestName, sortable: true },
  { name: "Type", selector: (row) => row.type, sortable: true },
  { name: "User Name", selector: (row) => row.userName, sortable: true },
  { name: "Winning Amount", selector: (row) => row.winningAmount, sortable: true },
  { name: "Rank", selector: (row) => row.rank, sortable: true, width: "100px" },
];


  // Custom style
  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#6a65c7ff",
        color: "white",
        fontWeight: "bold",
        fontSize: "14px",
      },
    },
  };

  return (
    <Content
      Page_title="Winnings"
      button_status={true}
      button_title="Back"
      route="/superadmin/dashboard"
      // extra_button="Add Employee"
      // extra_button_action="/superadmin/addUser"
    >
      <div className=" bg-gray-100 ">
        {/* <h1 className="text-3xl font-bold text-gray-800 mb-6">Winnings Report</h1> */}

        <div className="bg-white rounded-xl shadow-md ">
          <DataTable
            columns={columns}
            data={data}
            customStyles={customStyles}
            pagination
            highlightOnHover
            striped
          />
        </div>
      </div>
    </Content>
  );
}

export default Winnings;
