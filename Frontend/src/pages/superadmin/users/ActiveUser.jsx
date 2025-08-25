import React, { useEffect, useState } from "react";
import Datatable from "../../../extracomponents/Datatable";
import { UserCheck } from "lucide-react";
import { GetActiveUser } from "../../../services/SuperAdmin";

const ActiveUser = () => {
  const [activeuser, setActiveUser] = useState([]);
  const token = localStorage.getItem("token");

  const fetchActiveUsers = async () => {
    try {
      const response = await GetActiveUser(token);
      setActiveUser(response?.data);
    } catch (error) {
      console.log(`Error in fetching All Users`);
    }
  };

  useEffect(() => {
    fetchActiveUsers();
  }, []);

  const columns = [
    {
      name: "S.No",
      selector: (row,index) => index+1,
      sortable: true,
      width: "80px",
    },
    {
      name: "Name",
      selector: (row) => row?.FullName,
      sortable: true,
    },
    {
      name: "User Name",
      selector: (row) => row?.UserName,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row?.Email,
    },
    {
      name: "Phone No",
      selector: (row) => row?.PhoneNo,
      sortable: true,
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-2 mb-6">
        <UserCheck className="text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-800">Active Users</h1>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-4">
        <Datatable columns={columns} data={activeuser} title="Users List" />
      </div>
    </div>
  );
};

export default ActiveUser;
