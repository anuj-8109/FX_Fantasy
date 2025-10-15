import React from "react";
import DataTable from "react-data-table-component";
import Content from "../../../components/superadmin/Content";

function Revenue() {
  // Static data
  const data = [
    { id: 1, client: "ABC Pvt Ltd", revenue: "₹50,000", month: "January", status: "Paid" },
    { id: 2, client: "XYZ Corp", revenue: "₹30,000", month: "February", status: "Pending" },
    { id: 3, client: "TechVision", revenue: "₹70,000", month: "March", status: "Paid" },
    { id: 4, client: "FinEdge", revenue: "₹20,000", month: "April", status: "Overdue" },
    { id: 5, client: "InnovaSoft", revenue: "₹45,000", month: "May", status: "Paid" },
    
  ];

  // Table columns
  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true, width: "80px" },
    { name: "Client", selector: (row) => row.client, sortable: true },
    { name: "Revenue", selector: (row) => row.revenue, sortable: true },
    { name: "Month", selector: (row) => row.month, sortable: true },
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
