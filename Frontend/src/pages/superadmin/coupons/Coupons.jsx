import React, { useEffect, useState } from "react";
import Datatable from "../../../extracomponents/Datatable";
import { FileText, Edit, Eye, Trash2 } from "lucide-react";
import {
  GetCouponsList,
  AddCoupons,
  UpdateCoupons,
  UpdateCouponsStatus,
  DeleteCoupons,
} from "../../../services/SuperAdmin";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Content from "../../../components/superadmin/Content";
import * as config from "../../../utils/config";

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewCoupon, setViewCoupon] = useState(null);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [type, setType] = useState("percentage");
  const [value, setValue] = useState("");
  const [startdate, setStartdate] = useState("");
  const [enddate, setEnddate] = useState("");
  const [minpurchasevalue, setMinpurchasevalue] = useState("");
  const [mincouponvalue, setMinCouponvalue] = useState("");
  const [limitation, setLimitation] = useState("");
  const [image, setImage] = useState("");

  const token = localStorage.getItem("token");
  const add_by = localStorage.getItem("add_by");

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

  const handleOpen = (coupon = null) => {
    setSelectedCoupon(coupon);
    setName(coupon?.name || "");
    setCode(coupon?.code || "");
    setType(coupon?.type || "percentage");
    setValue(coupon?.value || "");
    setStartdate(coupon?.startdate || "");
    setEnddate(coupon?.enddate || "");
    setMinpurchasevalue(coupon?.minpurchasevalue || "");
    setMinCouponvalue(coupon?.mincouponvalue || "");
    setLimitation(coupon?.limitation || "");
    setImage(coupon?.image || "");
    setOpen(true);
  };

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

  const handleCancel = () => {
    setOpen(false);
    setSelectedCoupon(null);
    setName("");
    setCode("");
    setType("percentage");
    setValue("");
    setStartdate("");
    setEnddate("");
    setMinpurchasevalue("");
    setMinCouponvalue("");
    setLimitation("");
    setImage("");
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const confirm = await Swal.fire({
      title: selectedCoupon ? "Update Coupon?" : "Add Coupon?",
      text: selectedCoupon
        ? "Are you sure you want to update this coupon?"
        : "Are you sure you want to add this coupon?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Save",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    const formData = new FormData();
    formData.append("add_by", add_by);
    formData.append("name", name);
    formData.append("code", code);
    formData.append("type", type);
    formData.append("value", value);
    formData.append("startdate", startdate);
    formData.append("enddate", enddate);
    formData.append("minpurchasevalue", minpurchasevalue);
    formData.append("mincouponvalue", mincouponvalue);
    formData.append("limitation", limitation);
    if (image) formData.append("image", image);
    if (selectedCoupon) formData.append("id", selectedCoupon._id);

    setLoading(true);
    let response;
    if (selectedCoupon) {
      response = await UpdateCoupons(token, formData);
    } else {
      response = await AddCoupons(token, formData);
    }

    if (response?.status) {
      toast.success(response?.message || "Saved successfully");
      fetchCoupons();
      handleCancel();
    } else {
      toast.error(response?.message || "Failed to save");
    }

    setLoading(false);
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
    // {
    //   name: "S.No",
    //   selector: (row, index) => index + 1,
    //   width: "80px",
    // },
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
    {
      name: "Name",
      selector: (row) => row?.name || "N/A",
      exportValue: (row) => row.name || "N/A",
      export: true,
      sortable: true,
    },
    {
      name: "Code",
      selector: (row) => row?.code || "N/A",
      exportValue: (row) => row.code || "N/A",
      export: true,
    },
    {
      name: "Type",
      selector: (row) => row?.type || "N/A",
      exportValue: (row) => row.type || "N/A",
      export: true,
    },
    {
      name: "Value",
      selector: (row) => row?.value || "N/A",
      exportValue: (row) => row.value || "N/A",
      export: true,
    },
    {
      name: "Validity",
      selector: (row) =>
        new Date(row.startdate).toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }) +
        " - " +
        new Date(row.enddate).toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),

      exportValue: (row) => {
        if (!row?.startdate || !row?.enddate) return "N/A";
        const start = new Date(row.startdate).toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        const end = new Date(row.enddate).toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        return `${start} - ${end}`;
      },

      export: true,
      cell: (row) => {
        const start = new Date(row?.startdate).toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        const end = new Date(row?.enddate).toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <div>
            {start} - {end}
          </div>
        );
      },
      width: "280px",
    },
    {
      name: "Min Purchase",
      selector: (row) => row?.minpurchasevalue || "N/A",
      exportValue: (row) => row.minpurchasevalue || "N/A",
      export: true,
    },
    {
      name: "Min Coupon Value",
      selector: (row) => row?.mincouponvalue || "N/A",
      exportValue: (row) => row.mincouponvalue || "N/A",
      export: true,
    },
    {
      name: "Limitation",
      selector: (row) => row?.limitation || "N/A",
      exportValue: (row) => row.limitation || "N/A",
      export: true,
    },
    {
      name: "Status",
      selector: (row) => row?.status,
      exportValue: (row) => (row.status ? "Acitve" : "InActive"),
      export: true,
      cell: (row) => (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={row.status === true}
            onChange={() => handleStatusChange(row)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
          <div className="absolute left-0.5 top-0.5  w-5 h-5 rounded-full border border-gray-300 peer-checked:translate-x-full transition-transform duration-200"></div>
        </label>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-3">
          <Edit
            className="cursor-pointer text-blue-600"
            onClick={() => handleOpen(row)}
          />
          <Trash2
            className="cursor-pointer text-red-600"
            onClick={() => handleDelete(row)}
          />
          {/* <Eye
            className="cursor-pointer text-green-600"
            size={20}
            onClick={() => {
              setViewCoupon(row);
              setViewOpen(true);
            }}
          /> */}
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
      extra_button_action={() => handleOpen(null)}
      route="/superadmin/dashboard"
    >
      <div className="p-2 ">
        {/* <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FileText />
            <h1 className="text-2xl font-bold">All Coupons</h1>
          </div>

          <button
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm rounded text-white"
            onClick={() => handleOpen()}
          >
            + Add Coupon
          </button>
        </div> */}

        <div className="shadow-lg rounded-xl p-4 ">
          <Datatable
            columns={columns}
            data={coupons}
            title="Coupons List"
            onRefresh={fetchCoupons}
          />
        </div>

        {open && (
          <div className="fixed inset-0 flex items-center justify-center z-50 Coupons_style bg-opacity-40">
            <div className="w-full max-w-2xl max-h-[85vh] mt-10 overflow-y-auto rounded-2xl shadow-2xl p-6  hide-scrollbar Add-client-style">
              <h2 className="text-lg font-semibold mb-4 border-b pb-2 ">
                {selectedCoupon ? "✏️ Edit Coupon" : "➕ Add Coupon"}
              </h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm ">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border rounded-md px-3 py-2 mt-1 input-Add "
                    />
                  </div>
                  <div>
                    <label className="text-sm ">Code</label>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full border rounded-md px-3 py-2 mt-1 input-Add"
                    />
                  </div>
                  <div>
                    <label className="text-sm ">Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full border rounded-md px-3 py-2 mt-1 input-Add"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="flat">Flat</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm ">Value</label>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      className="w-full border rounded-md px-3 py-2 mt-1 input-Add"
                    />
                  </div>
                  <div>
                    <label className="text-sm ">Start Date</label>
                    <input
                      type="date"
                      value={startdate}
                      onChange={(e) => setStartdate(e.target.value)}
                      className="w-full border rounded-md px-3 py-2 mt-1 input-Add"
                    />
                  </div>
                  <div>
                    <label className="text-sm ">End Date</label>
                    <input
                      type="date"
                      value={enddate}
                      onChange={(e) => setEnddate(e.target.value)}
                      className="w-full border rounded-md px-3 py-2 mt-1 input-Add"
                    />
                  </div>
                  <div>
                    <label className="text-sm ">Min Purchase Value</label>
                    <input
                      type="number"
                      value={minpurchasevalue}
                      onChange={(e) => setMinpurchasevalue(e.target.value)}
                      className="w-full border rounded-md px-3 py-2 mt-1 input-Add"
                    />
                  </div>
                  <div>
                    <label className="text-sm ">Min Coupon Value</label>
                    <input
                      type="number"
                      value={mincouponvalue}
                      onChange={(e) => setMinCouponvalue(e.target.value)}
                      className="w-full border rounded-md px-3 py-2 mt-1 input-Add"
                    />
                  </div>
                  <div>
                    <label className="text-sm ">Limitation</label>
                    <input
                      type="number"
                      value={limitation}
                      onChange={(e) => setLimitation(e.target.value)}
                      className="w-full border rounded-md px-3 py-2 mt-1 input-Add"
                    />
                  </div>
                  <div>
                    <label className="text-sm ">Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files[0])}
                      className="w-full border rounded-md px-3 py-2 mt-1 input-Add"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 bg-blue-600 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {viewOpen && viewCoupon && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl p-6">
              <h2 className="text-lg font-semibold mb-4 border-b pb-2 flex justify-between">
                <span>👁️ Coupon Details</span>
                <button
                  onClick={() => {
                    setViewOpen(false);
                    setViewCoupon(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✖
                </button>
              </h2>

              <div className="space-y-4">
                <p>
                  <b>Name:</b> {viewCoupon?.name}
                </p>
                <p>
                  <b>Code:</b> {viewCoupon?.code}
                </p>
                <p>
                  <b>Type:</b> {viewCoupon?.type}
                </p>
                <p>
                  <b>Value:</b> {viewCoupon?.value}
                </p>
                <p>
                  <b>Validity:</b> {viewCoupon?.startdate} -{" "}
                  {viewCoupon?.enddate}
                </p>
                <p>
                  <b>Min Purchase:</b> {viewCoupon?.minpurchasevalue}
                </p>
                <p>
                  <b>Min Coupon Value:</b> {viewCoupon?.mincouponvalue}
                </p>
                <p>
                  <b>Limitation:</b> {viewCoupon?.limitation}
                </p>
                {viewCoupon?.image && (
                  <img
                    src={viewCoupon.image}
                    alt={viewCoupon.name}
                    className="w-full max-h-64 object-contain rounded-md border"
                  />
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    setViewOpen(false);
                    setViewCoupon(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Content>
  );
};

export default Coupons;
