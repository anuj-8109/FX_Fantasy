import React from "react";
import DataTable from "react-data-table-component";
import Content from "../../../components/superadmin/Content";

function Winnings() {
  // Static data
  const data = [
    { id: 1, player: "Rohit Sharma", amount: "₹25,000", game: "Fantasy Cricket", date: "2025-09-01", status: "Paid" },
    { id: 2, player: "Virat Kohli", amount: "₹15,000", game: "Fantasy Football", date: "2025-09-10", status: "Pending" },
    { id: 3, player: "Hardik Pandya", amount: "₹40,000", game: "Fantasy Cricket", date: "2025-09-18", status: "Paid" },
    { id: 4, player: "KL Rahul", amount: "₹10,000", game: "Fantasy Basketball", date: "2025-09-20", status: "Overdue" },
    { id: 5, player: "MS Dhoni", amount: "₹50,000", game: "Fantasy Cricket", date: "2025-09-25", status: "Paid" },
  ];

  // Table columns
  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true, width: "80px" },
    { name: "Player", selector: (row) => row.player, sortable: true },
    { name: "Game", selector: (row) => row.game, sortable: true },
    { name: "Amount", selector: (row) => row.amount, sortable: true },
    { name: "Date", selector: (row) => row.date, sortable: true },
    {
      name: "Status",
      selector: (row) => row.status,
      cell: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-white ${row.status === "Paid"
              ? "bg-green-500"
              : row.status === "Pending"
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
        >
          {row.status}
        </span>
      ),
    },
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
