import React, { useEffect, useState } from "react";
import Datatable from "../../../extracomponents/Datatable";
import { Edit, Trash2 } from "lucide-react";
import {
  GetCouponsList,
  DeleteCoupons,
  UpdateCouponsStatus,
} from "../../../services/SuperAdmin";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Content from "../../../components/superadmin/Content";
import * as config from "../../../utils/config";
import { useNavigate } from "react-router-dom";

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchCoupons = async () => {
    setLoading(true);
    const response = await GetCouponsList(token);
    if (response?.status) {
      setCoupons(response?.data);
    } else {
      toast.error(response?.message || "Failed to load coupons");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = async (coupon) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this coupon?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    setLoading(true);
    const response = await DeleteCoupons(token, coupon._id);
    setLoading(false);

    if (response?.status) {
      toast.success(response?.message || "Coupon deleted successfully");
      fetchCoupons();
    } else {
      toast.error(response?.message || "Failed to delete coupon");
    }
  };

  const handleStatusChange = async (coupon) => {
    const actionText = coupon.status ? "Deactivate" : "Activate";

    const confirm = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to ${actionText} this coupon?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${actionText}`,
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    const payload = {
      id: coupon._id,
      status: (!coupon.status).toString(),
    };

    const res = await UpdateCouponsStatus(token, payload);

    if (res?.status) {
      toast.success(res?.message || `Coupon ${actionText}d`);
      fetchCoupons();
    } else {
      toast.error(res?.message || "Failed to change status");
    }
  };

  const columns = [
    {
      name: "Image",
      cell: (row) =>
        row?.image ? (
          <img
            src={`${config?.image_url}uploads/coupon/${row.image}`}
            alt={row.title}
            className="w-16 h-16 object-cover rounded"
          />
        ) : (
          <span className="text-gray-400 italic">No Image</span>
        ),
      export: false,
    },
    { name: "Name", selector: (row) => row?.name || "N/A", export: true },
    { name: "Code", selector: (row) => row?.code || "N/A", export: true },
    { name: "Type", selector: (row) => row?.type || "N/A", export: true },
    { name: "Value", selector: (row) => row?.value || "N/A", export: true },
    {
      name: "Min Purchase Value",
      selector: (row) => row?.minpurchasevalue || "N/A",
      export: true,
    },
    {
      name: "Min Coupon Value",
      selector: (row) => row?.mincouponvalue || "N/A",
      export: true,
    },
    {
      name: "Limitation",
      selector: (row) => row?.limitation || "N/A",
      export: true,
    },
    // {
    //   name: "Total Limitation",
    //   selector: (row) => row?.totallimitation || "N/A",
    //   export: true,
    // },
    {
      name: "Validity",
      selector: (row) => {
        const start = row.startdate
          ? new Date(row.startdate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "N/A";

        const end = row.enddate
          ? new Date(row.enddate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "N/A";

        return `${start} - ${end}`;
      },
      export: true,
      width: "250px",
    },
    {
      name: "Status",
      selector: (row) => (row.status ? "Active" : "Inactive"),
      export: true,
      cell: (row) => (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={row.status === true}
            onChange={() => handleStatusChange(row)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-600 transition-colors"></div>
          <div className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full border peer-checked:translate-x-full transition-transform"></div>
        </label>
      ),
      width: "100px",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-3">
          <Edit
            className="cursor-pointer text-blue-600"
            onClick={() => navigate(`/superadmin/add-coupon?id=${row._id}`)}
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
      Page_title="Coupon Management"
      button_title="Back"
      button_status={true}
      extra_button="+ Add Coupon"
      extra_button_action={() => navigate("/superadmin/add-coupon")}
      route="/superadmin/dashboard"
    >
      <div className="p-2 shadow-lg rounded-xl">
        <Datatable
          columns={columns}
          data={coupons}
          title="Coupons List"
          onRefresh={fetchCoupons}
        />
      </div>
    </Content>
  );
};

export default Coupons;
