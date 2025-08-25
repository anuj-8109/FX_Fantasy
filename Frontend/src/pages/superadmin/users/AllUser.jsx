import React, { useEffect, useState } from "react";
import Datatable from "../../../extracomponents/Datatable";
import { User } from "lucide-react";
import { GetAllUser } from "../../../services/SuperAdmin";

const AllUsers = () => {
  const [allusers, setAllUsers] = useState([]);
  const token = localStorage.getItem("token");
console.log("Token",token);

  const fetchAllUsers = async () => {
    try {
      const response = await GetAllUser(token);
      setAllUsers(response?.data);
    } catch (error) {
      console.log(`Error in fetching All Users`);
    }
  };

  useEffect(()=>{
    fetchAllUsers();
  },[])


  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      width: "70px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Role",
      selector: (row) => row.role,
      sortable: true,
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-2 mb-6">
        <User className="text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-800">All Users</h1>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-4">
        <Datatable columns={columns} data={allusers} title="Users List" />
      </div>
    </div>
  );
};

export default AllUsers;
