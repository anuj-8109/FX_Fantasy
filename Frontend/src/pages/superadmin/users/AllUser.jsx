import React, { useEffect, useState } from "react";
import Datatable from "../../../extracomponents/Datatable";
import { User } from "lucide-react";
import {
  GetAllUser,
  StatusChange,
  UpdatePermissions,
} from "../../../services/SuperAdmin";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";
import { DeleteUser, EditUser } from "../../../services/SuperAdmin";
import toast from "react-hot-toast";
import Content from "../../../components/superadmin/Content";

const AllUsers = () => {
  const navigate = useNavigate();
  const [allusers, setAllUsers] = useState([]);
  const token = localStorage.getItem("token");

  const fetchAllUsers = async () => {
    try {
      const response = await GetAllUser(token);
      console.log("Current User Data:", response?.currentUser); // check what backend sends
      setAllUsers(response?.data);
    } catch (error) {
      console.log(`Error in fetching All Users`, error);
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
          console.log("res", res);

          if (res?.status) {
            toast.success(
              "User Deleted successfully!",
              res?.message,
              "success"
            );
            fetchAllUsers();
          }
        } catch (err) {
          Swal.fire("Error!", "Server error occurred.", "error");
        }
      }
    });
  };

  const handleStatusChange = async (newStatus, userId) => {
    const isEnabling = Number(newStatus) === 1;

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
      customClass: {
        popup: "custom-swal-popup",
        title: "text-xl font-semibold text-white-800",
        confirmButton:
          "px-2 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition",
        cancelButton:
          "px-2 py-2 rounded-lg text-white bg-gray-500 hover:bg-gray-600 transition",
      },
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
        fetchAllUsers();
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

  const handlePermissionUpdate = async (row) => {
    // Convert stored string into array
    let currentPermissions = [];
    try {
      currentPermissions = row.permissions?.[0]
        ? JSON.parse(row.permissions[0])
        : [];
    } catch (err) {
      currentPermissions = [];
    }

    const { value: selectedPermissions } = await Swal.fire({
      title: `Manage Permissions for ${row.FullName}`,
      input: "checkbox",
      inputOptions: {
        add_user: "Add User",
        edit_user: "Edit User",
        delete_user: "Delete User",
      },
      inputValue: currentPermissions,
      confirmButtonText: "Update",
      showCancelButton: true,
      customClass: {
        popup: "custom-swal-popup",
        title: "text-xl font-semibold text-white-800",
        confirmButton:
          "px-2 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition",
        cancelButton:
          "px-2 py-2 rounded-lg text-white bg-gray-500 hover:bg-gray-600 transition",
      },
    });

    if (!selectedPermissions || selectedPermissions.length === 0) {
      toast.error("Please select at least one permission.");
      return;
    }

    try {
      const response = await UpdatePermissions(token, {
        id: row._id,
        permissions: selectedPermissions, // ✅ send array
      });

      if (response?.status) {
        toast.success("Permissions updated successfully!");
        fetchAllUsers(); // refresh table
      } else {
        toast.error(response?.message || "Failed to update permissions");
      }
    } catch (err) {
      toast.error("Server error while updating permissions");
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const columns = [
    // {
    //   name: "S.No",
    //   selector: (row, index) => index + 1,
    //   sortable: true,
    //   width: "80px",
    // },
    {
      name: "Name",
      selector: (row) => row?.FullName || "N/A",
      exportValue: (row) => row?.FullName || "N/A",
      export: true,
      sortable: true,
      width: "150px",
    },
    {
      name: "User Name",
      selector: (row) => row?.UserName || "N/A",
      exportValue: (row) => row?.UserName || "N/A",
      export: true,
      sortable: true,
      width: "150px",
    },
    {
      name: "Email",
      selector: (row) => row?.Email || "N/A",
      exportValue: (row) => row?.Email || "N/A",
      export: true,
      width: "250px",
    },
    {
      name: "Phone No",
      selector: (row) => row?.PhoneNo || "N/A",
      exportValue: (row) => row?.PhoneNo || "N/A",
      export: true,
      sortable: true,
      width: "120px",
    },
    {
      name: "Status",
      cell: (row) => (
        <div className="flex items-center gap-3">
          {/* ✅ Toggle for active/inactive */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={row.ActiveStatus === 1}
              onChange={(e) =>
                handleStatusChange(e.target.checked ? "1" : "0", row?._id)
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-600 transition-colors"></div>
            <div className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full border bg-white peer-checked:translate-x-full transition-transform"></div>
          </label>
        </div>
      ),
      exportValue: (row) => (row.ActiveStatus === 1 ? "Active" : "Inactive"),
      export: true,
      sortable: true,
      width: "80px",
    },
    {
      name: "Permission",
      cell: (row) => (
        <div className="flex items-center gap-3">
          {/* ✅ Gear icon for permissions */}
          <button
            onClick={() => handlePermissionUpdate(row)}
            className="text-purple-600 hover:text-purple-800"
            title="Manage Permissions"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.065c1.51-.923 3.268.835 2.345 2.345a1.724 1.724 0 001.065 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.065 2.573c.923 1.51-.835 3.268-2.345 2.345a1.724 1.724 0 00-2.573 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.065c-1.51.923-3.268-.835-2.345-2.345a1.724 1.724 0 00-1.065-2.573c-1.756-.426-1.756-2.924 0-3.35.923-.573 1.065-1.724 1.065-2.573-.923-1.51.835-3.268 2.345-2.345.923.573 2.147.085 2.573-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>
      ),
      width: "100px",
      export: false,
    },
    {
      name: "Action",
      selector: (row) => row?.PhoneNo,
      sortable: true,
      cell: (row) => (
        <div className="flex gap-3">
          <Edit
            className="cursor-pointer text-blue-600"
            onClick={() =>
              navigate(`/superadmin/EditUsers/${row._id}`, {
                state: { userId: row._id },
              })
            }
          />
          <Trash2
            className="cursor-pointer text-red-600"
            onClick={() => handleDelete(row)}
          />
        </div>
      ),
      export: false,
    },
  ];

  return (
    <Content
      Page_title="All Employees"
      button_status={true}
      button_title="Back"
      route="/superadmin/dashboard"
      extra_button="Add Employee"
      extra_button_action="/superadmin/addUser"
    >
      <div className="p-8 min-h-screen AllUsers_Style">
        {/* <div className="flex items-center justify-between mb-6 border  rounded-xl shadow-sm p-2">
        <div className="flex items-center gap-2">
          <User className="" />
          <h1 className="text-xl font-bold ">All Users</h1>
        </div>

        <button
          className="  border px-4 py-2 text-sm rounded-lg shadow-md"
          onClick={addUser}
        >
          Add User +
        </button>
      </div> */}

        <div className=" border shadow-lg rounded-xl  ">
          <Datatable
            columns={columns}
            data={allusers}
            title="Users List"
            onRefresh={fetchAllUsers}
          />
        </div>
      </div>
    </Content>
  );
};

export default AllUsers;
