import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Shield, CheckSquare, Square } from "lucide-react";
import toast from "react-hot-toast";
import { UpdatePermissions } from "../../../services/SuperAdmin";
import Content from "../../../components/superadmin/Content";

// Permission categories based on sidebar (excluding Basic Settings)
const permissionCategories = [
  {
    category: "Dashboard",
    permissions: [
      { id: "dashboard_view", label: "View Dashboard", key: "dashboard" },
    ],
  },
  //   {
  //     category: "Employee Management",
  //     permissions: [
  //       { id: "employee_view", label: "View Employees", key: "alluser" },
  //       { id: "employee_add", label: "Add Employee", key: "add_user" },
  //       { id: "employee_edit", label: "Edit Employee", key: "edit_user" },
  //       { id: "employee_delete", label: "Delete Employee", key: "delete_user" },
  //     ],
  //   },
  {
    category: "Client Management",
    permissions: [
      { id: "client_view", label: "View Clients", key: "clients" },
      { id: "client_add", label: "Add Client", key: "add_client" },
      { id: "client_edit", label: "Edit Client", key: "edit_client" },
      { id: "client_delete", label: "Delete Client", key: "delete_client" },
      {
        id: "client_status",
        label: "Change Client Status",
        key: "change_client_status",
      },
      {
        id: "client_download",
        label: "Download Client Data",
        key: "download_client",
      },
    ],
  },
  {
    category: "Tournament Management",
    permissions: [
      { id: "tournament_view", label: "View Tournaments", key: "tournament" },
      { id: "tournament_add", label: "Add Tournament", key: "add_tournament" },
      {
        id: "tournament_edit",
        label: "Edit Tournament",
        key: "edit_tournament",
      },
      {
        id: "tournament_cancel",
        label: "Cancel Tournament",
        key: "cancel_tournament",
      },
      {
        id: "tournament_status",
        label: "Change Tournament Status",
        key: "change_tournament_status",
      },
      {
        id: "tournament_download",
        label: "Download Tournament Data",
        key: "download_tournament",
      },
      {
        id: "tournament_view_contest",
        label: "View Tournament Contest",
        key: "view_tournament_contest",
      },
      {
        id: "tournament_add_contest",
        label: "Add Tournament Contest",
        key: "add_tournament_contest",
      },
    ],
  },
  {
    category: "Contest Management",
    permissions: [
      { id: "contest_view", label: "View Contests", key: "contest" },
      //   { id: "contest_add", label: "Add Contest", key: "add_contest" },
      { id: "contest_edit", label: "Edit Contest", key: "edit_contest" },
      { id: "contest_cancel", label: "Cancel Contest", key: "cancel_contest" },
      {
        id: "contest_status",
        label: "Change Contest Status",
        key: "change_contest_status",
      },
      {
        id: "contest_download",
        label: "Download Contest Data",
        key: "download_contest",
      },
    ],
  },
  {
    category: "Content Management",
    permissions: [
      { id: "banner_manage", label: "Manage Banners", key: "banner" },
      { id: "content_manage", label: "Manage Content", key: "content" },
      { id: "blog_manage", label: "Manage Blogs", key: "blog" },
      { id: "news_manage", label: "Manage News", key: "news" },
    ],
  },
  {
    category: "Financial Management",
    permissions: [
      //   { id: "withdrawal_view", label: "View Withdrawals", key: "withdrawal" },
      {
        id: "withdrawal_approve",
        label: "Approve Withdrawals",
        key: "approve_withdrawal",
      },
      //   { id: "revenue_view", label: "View Revenue", key: "revenue" },
      //   { id: "winnings_view", label: "View Winnings", key: "winning" },
      {
        id: "withdrawal_download",
        label: "Download Withdrawal Data",
        key: "download_withdrawal",
      },
    ],
  },
  {
    category: "KYC & Bank Management",
    permissions: [
      { id: "kyc_view", label: "View KYC Approvals", key: "kycapproval" },
      { id: "kyc_approve", label: "Approve/Reject KYC", key: "kyc_approve" },
      { id: "bank_view", label: "View Bank Details", key: "bankdetail" },
    ],
  },
  {
    category: "Support & Help",
    permissions: [
      { id: "helpdesk_view", label: "View HelpDesk", key: "help" },
      {
        id: "helpdesk_respond",
        label: "Respond to Tickets",
        key: "help_respond",
      },
      { id: "faq_manage", label: "Manage FAQs", key: "faqs" },
    ],
  },
  {
    category: "Marketing",
    permissions: [
      { id: "coupon_view", label: "View Coupons", key: "coupons" },
      { id: "coupon_add", label: "Add Coupons", key: "add_coupon" },
      { id: "coupon_edit", label: "Edit Coupons", key: "edit_coupon" },
      { id: "coupon_delete", label: "Delete Coupons", key: "delete_coupon" },
    ],
  },
];

const ManagePermissions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, userName, userPermissions } = location.state || {};

  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectAll, setSelectAll] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!userId) {
      toast.error("No user selected");
      navigate("/superadmin/alluser");
      return;
    }

    // Initialize permissions from user data
    console.log("User Permissions received:", userPermissions);

    if (
      userPermissions &&
      Array.isArray(userPermissions) &&
      userPermissions.length > 0
    ) {
      try {
        let parsedPermissions = [];

        // Case 1: If permissions[0] is a JSON string like "[\"add_user\",\"edit_user\"]"
        if (typeof userPermissions[0] === "string") {
          try {
            // Try to parse as JSON
            parsedPermissions = JSON.parse(userPermissions[0]);
            console.log("Parsed from JSON string:", parsedPermissions);
          } catch (e) {
            // If not JSON, treat as single permission
            parsedPermissions = userPermissions;
            console.log("Using as is:", parsedPermissions);
          }
        }
        // Case 2: If permissions is already an array of permission keys
        else {
          parsedPermissions = userPermissions;
          console.log("Already array:", parsedPermissions);
        }

        // Filter out any invalid values like "1" or empty strings
        const validPermissions = parsedPermissions.filter(
          (p) => p && p !== "1" && typeof p === "string"
        );

        console.log("Final valid permissions:", validPermissions);
        setSelectedPermissions(validPermissions);
      } catch (err) {
        console.error("Error parsing permissions:", err);
        setSelectedPermissions([]);
      }
    } else {
      console.log("No permissions found, starting with empty array");
      setSelectedPermissions([]);
    }
  }, [userId, userPermissions, navigate]);

  // Check if all permissions in a category are selected
  useEffect(() => {
    const newSelectAll = {};
    permissionCategories.forEach((category) => {
      const allSelected = category.permissions.every((perm) =>
        selectedPermissions.includes(perm.key)
      );
      newSelectAll[category.category] = allSelected;
    });
    setSelectAll(newSelectAll);
  }, [selectedPermissions]);

  const handlePermissionToggle = (permissionKey) => {
    setSelectedPermissions((prev) => {
      if (prev.includes(permissionKey)) {
        return prev.filter((p) => p !== permissionKey);
      } else {
        return [...prev, permissionKey];
      }
    });
  };

  const handleSelectAllCategory = (category) => {
    const categoryPermissions = category.permissions.map((p) => p.key);
    const allSelected = categoryPermissions.every((key) =>
      selectedPermissions.includes(key)
    );

    if (allSelected) {
      // Deselect all in category
      setSelectedPermissions((prev) =>
        prev.filter((p) => !categoryPermissions.includes(p))
      );
    } else {
      // Select all in category
      setSelectedPermissions((prev) => {
        const newPerms = [...prev];
        categoryPermissions.forEach((key) => {
          if (!newPerms.includes(key)) {
            newPerms.push(key);
          }
        });
        return newPerms;
      });
    }
  };

  const handleSavePermissions = async () => {
    if (selectedPermissions.length === 0) {
      toast.error("Please select at least one permission");
      return;
    }

    setLoading(true);
    try {
      const response = await UpdatePermissions(token, {
        id: userId,
        permissions: selectedPermissions,
      });

      if (response?.status) {
        toast.success("Permissions updated successfully!");
        setTimeout(() => {
          navigate("/superadmin/alluser");
        }, 1500);
      } else {
        toast.error(response?.message || "Failed to update permissions");
      }
    } catch (error) {
      console.error("Error updating permissions:", error);
      toast.error("Server error while updating permissions");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAllPermissions = () => {
    const allPermissionKeys = permissionCategories.flatMap((category) =>
      category.permissions.map((p) => p.key)
    );

    const allSelected = allPermissionKeys.every((key) =>
      selectedPermissions.includes(key)
    );

    if (allSelected) {
      setSelectedPermissions([]);
    } else {
      setSelectedPermissions(allPermissionKeys);
    }
  };

  const totalPermissions = permissionCategories.reduce(
    (sum, cat) => sum + cat.permissions.length,
    0
  );
  const allSelected = selectedPermissions.length === totalPermissions;

  return (
    <Content
      Page_title={`Manage Permissions - ${userName || "Employee"}`}
      button_status={true}
      button_title="Back"
      route="/superadmin/alluser"
    >
      <div className="p-4 min-h-screen bg-gray-100">
        {/* HEADER CARD */}
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-800">
                Manage Permissions
              </h1>
              <p className="text-gray-500 mt-0.5 text-xs">
                Assign permissions to{" "}
                <span className="font-medium text-blue-600">{userName}</span>
              </p>
            </div>

            <button
              onClick={handleSelectAllPermissions}
              className={`px-4 py-1.5 rounded-md text-white text-xs shadow transition ${
                allSelected ? "bg-red-500" : "bg-blue-600"
              }`}
            >
              {allSelected ? "Deselect All" : "Select All"}
            </button>
          </div>
        </div>

        {/* PERMISSION CARDS */}
        {/* PERMISSION CARDS */}
        <div className="max-w-5xl mx-auto bg-white mt-4 rounded-lg shadow-sm border border-gray-200 p-4">
          {permissionCategories.map((category, idx) => (
            <div key={idx} className="mb-8">
              {/* CATEGORY HEADER — IMPROVED */}
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-gray-800 tracking-wide border-l-4 border-blue-600 pl-2">
                  {category.category}
                </h2>

                <button
                  onClick={() => handleSelectAllCategory(category)}
                  className="text-[10px] px-3 py-1 rounded bg-gray-100 border border-gray-300 hover:bg-gray-200"
                >
                  {selectAll[category.category] ? "Deselect" : "Select All"}
                </button>
              </div>

              {/* PERMISSIONS AS SMALL CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {category.permissions.map((permission) => {
                  const isSelected = selectedPermissions.includes(
                    permission.key
                  );

                  return (
                    <div
                      key={permission.id}
                      className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-100 transition"
                    >
                      <span className="text-gray-700 text-xs font-medium">
                        {permission.label}
                      </span>

                      {/* Toggle */}
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() =>
                            handlePermissionToggle(permission.key)
                          }
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition"></div>
                        <div className="absolute left-1 top-1 w-3.5 h-3.5 bg-white rounded-full shadow transform transition peer-checked:translate-x-4"></div>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* SAVE BAR */}
        <div className="max-w-5xl mx-auto bg-white p-4 rounded-lg shadow border border-gray-200 mt-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-600 text-xs">
              Selected:{" "}
              <span className="font-semibold text-blue-600">
                {selectedPermissions.length}
              </span>{" "}
              / {totalPermissions}
            </p>

            <button
              disabled={loading || selectedPermissions.length === 0}
              onClick={handleSavePermissions}
              className={`px-5 py-1.5 rounded-md text-white text-xs shadow ${
                loading || selectedPermissions.length === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Saving..." : "Save Permissions"}
            </button>
          </div>
        </div>
      </div>
    </Content>
  );
};

export default ManagePermissions;
