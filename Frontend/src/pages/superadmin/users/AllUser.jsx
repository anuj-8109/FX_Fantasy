import React, { useEffect, useState } from "react";
import Datatable from "../../../extracomponents/Datatable";
import { User } from "lucide-react";
import { GetAllUser, StatusChange } from "../../../services/SuperAdmin";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { DeleteUser, EditUser } from "../../../services/SuperAdmin"
import toast from "react-hot-toast";

const AllUsers = () => {
  const navigate = useNavigate();
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
  const addUser = () => {
    navigate("/superadmin/addUser");
  };




  const handleDelete = (row) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result?.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          const res = await DeleteUser(token, row._id);
          console.log("res", res)

          if (res?.status) {
            toast.success("User Deleted successfully!", res?.message, "success");
            fetchAllUsers();
          }
        } catch (err) {
          Swal.fire("Error!", "Server error occurred.", "error");
        }
      }
    });
  };

  const handleStatusChange = async (newStatus, userId) => {
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
      const response = await StatusChange(token, newStatus, userId);

      if (response?.status === true || response?.status === "true") {
        await Swal.fire({
          icon: "success",
          title: "Success",
          text: response?.message || "User status updated successfully.",
          confirmButtonColor: "#2563eb",
        });

        setAllUsers((prev) =>
          prev?.map((item) =>
            item._id === userId ? { ...item, ActiveStatus: newStatus } : item
          )
        );
      } else {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: response?.message || "Failed to update status",
          confirmButtonColor: "#dc2626",
        });
      }
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.message || "Unexpected error",
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
              handleStatusChange(e.target.checked ? "1" : "0", row?._id)
            }
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
          <div className="absolute left-0.5 top-0.5  w-5 h-5 rounded-full border border-gray-300 peer-checked:translate-x-full transition-transform duration-200"></div>
        </label>
      ),
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => row?.PhoneNo,
      sortable: true,
      cell: (row) => (
        <div className="flex gap-3">

          <FaEdit
            className=" cursor-pointer"
            onClick={() => navigate(`/superadmin/EditUsers/${row._id}`, { state: { userId: row._id } })
            }
          />

          {/* Delete Icon */}
          <FaTrash
            className=" cursor-pointer"
            onClick={() => handleDelete(row)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-6  min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <User className="" />
          <h1 className="text-2xl font-bold">All Users</h1>
        </div>

        <button
          className="bg-blue-600 hover:bg-blue-700  px-4 py-2 text-sm rounded"
          onClick={addUser}
        >
          Add User +
        </button>
      </div>


      <div className=" shadow-lg rounded-xl p-4">
        <Datatable columns={columns} data={allusers} title="Users List" />
      </div>
    </div>
  );
};

export default AllUsers;
