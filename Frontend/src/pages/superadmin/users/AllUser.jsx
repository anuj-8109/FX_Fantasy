import React, { useEffect, useState } from "react";
import Datatable from "../../../extracomponents/Datatable";
import { User } from "lucide-react";
import { GetAllUser, StatusChange } from "../../../services/SuperAdmin";
import Swal from "sweetalert2";

const AllUsers = () => {
  const [allusers, setAllUsers] = useState([]);
  const token = localStorage.getItem("token");

  const fetchAllUsers = async () => {
    try {
      const response = await GetAllUser(token);
      setAllUsers(response?.data);
    } catch (error) {
      console.log(`Error in fetching All Users`);
    }
  };

  const handleStatusChange = async (newStatus,userId ) => {
    const isEnabling = newStatus === 1;

    const confirm = await Swal.fire({
      title: isEnabling ? "Activate User?" : "Deactivate User?",
      text: isEnabling
        ? "Do you really want to activate this user?"
        : "Do you really want to deactivate this user?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
      confirmButtonText: isEnabling ? "Yes, Activate" : "Yes, Deactivate",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await StatusChange({
        token,
        status: newStatus,
        id: userId,
      });

      if (res?.status === true || res?.status === "true") {
        await Swal.fire({
          icon: "success",
          title: "Success",
          text: "User status updated successfully.",
          confirmButtonColor: "#2563eb",
        });

        setAllUsers((prev) =>
          prev?.map((item) =>
            item.id === userId ? { ...item, ActiveStatus: newStatus } : item
          )
        );
      } else {
        throw new Error(res?.message || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update status.",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1,
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
    {
      name: "Active Status",
      cell: (row) => (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={row.ActiveStatus === 1}
            onChange={(e) =>
              handleStatusChange(row?.id, e.target.checked ? 1 : 0)
            }
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
          <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full border border-gray-300 peer-checked:translate-x-full transition-transform duration-200"></div>
        </label>
      ),
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
