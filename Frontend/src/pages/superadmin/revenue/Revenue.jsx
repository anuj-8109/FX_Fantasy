import React from "react";
import DataTable from "react-data-table-component";
import Content from "../../../components/superadmin/Content";

function Revenue() {
 // Static data
const data = [
  {
    id: 1,
    date: "2025-09-01",
    contestName: "Super Sixers League",
    type: "Fantasy Cricket",
    userName: "Rohit Sharma",
    entryFee: "₹500",
  },
  {
    id: 2,
    date: "2025-09-05",
    contestName: "Goal Masters Cup",
    type: "Fantasy Football",
    userName: "Virat Kohli",
    entryFee: "₹300",
  },
  {
    id: 3,
    date: "2025-09-10",
    contestName: "All-Rounder Challenge",
    type: "Fantasy Cricket",
    userName: "Hardik Pandya",
    entryFee: "₹700",
  },
  {
    id: 4,
    date: "2025-09-15",
    contestName: "Hoop Kings Tournament",
    type: "Fantasy Basketball",
    userName: "KL Rahul",
    entryFee: "₹400",
  },
  {
    id: 5,
    date: "2025-09-20",
    contestName: "Legends Trophy",
    type: "Fantasy Cricket",
    userName: "MS Dhoni",
    entryFee: "₹600",
  },
];

// Table columns
const columns = [
  { name: "Date", selector: (row) => row.date, sortable: true, width: "130px" },
  { name: "Contest Name", selector: (row) => row.contestName, sortable: true },
  { name: "Type", selector: (row) => row.type, sortable: true },
  { name: "User Name", selector: (row) => row.userName, sortable: true },
  { name: "Entry Fee", selector: (row) => row.entryFee, sortable: true },
];


  // Table custom style
  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#746de9ff",
        color: "white",
        fontWeight: "bold",
        fontSize: "14px",
      },
    },
  };

  return (
    <Content
      Page_title="Revenue"
      button_status={true}
      button_title="Back"
      route="/superadmin/dashboard"
      // extra_button="Add Employee"
      // extra_button_action="/superadmin/addUser"
    >
      <div className=" bg-gray-100 ">
        {/* <h1 className="text-3xl font-bold text-gray-800 mb-6">Revenue Report</h1> */}

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

export default Revenue;
