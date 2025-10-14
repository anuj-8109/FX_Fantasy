import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import * as Yup from "yup";
import Content from "../../../components/superadmin/Content";
import ReusableForm from "../../../extracomponents/ResuableForm";
import {
  AddCoupons,
  UpdateCoupons,
  GetCouponsList,
} from "../../../services/SuperAdmin";
import * as config from "../../../utils/config";

export default function AddCoupon() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const editId = params.get("id");
  const token = localStorage.getItem("token");
  const add_by = localStorage.getItem("add_by");

  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    name: "",
    code: "",
    type: "",
    value: "",
    startdate: "",
    enddate: "",
    minpurchasevalue: "",
    mincouponvalue: "",
    limitation: "",
    image: "",
  });
  const [originalData, setOriginalData] = useState(null);

  // ✅ Fetch coupon data if editing
  useEffect(() => {
    if (editId) fetchCouponData();
  }, [editId]);

  const fetchCouponData = async () => {
    const res = await GetCouponsList(token);
    if (res?.status) {
      const coupon = res?.data?.find((c) => c._id === editId);
      if (coupon) {
        const fetchedData = {
          name: coupon.name || "",
          code: coupon.code || "",
          type: coupon.type || "",
          value: coupon.value || "",
          startdate: coupon.startdate?.split("T")[0] || "",
          enddate: coupon.enddate?.split("T")[0] || "",
          minpurchasevalue: coupon.minpurchasevalue || "",
          mincouponvalue: coupon.mincouponvalue || "",
          limitation: coupon.limitation || "",
          image: coupon.image
            ? `${config.image_url}uploads/coupon/${coupon.image}`
            : "",
        };
        setInitialValues(fetchedData);
        setOriginalData(fetchedData);
      }
    }
  };

  // ✅ Validation Schema (All required + StartDate >= Today + EndDate > StartDate)
  const today = new Date();
  today.setHours(0, 0, 0, 0); // remove time portion

  const validationSchema = Yup.object({
    name: Yup.string().required("Coupon name is required"),
    code: Yup.string().required("Coupon code is required"),
    type: Yup.string().required("Select coupon type"),
    value: Yup.number()
      .required("Value is required")
      .positive("Value must be positive"),
    startdate: Yup.date()
      .required("Start date is required")
      .test(
        "startdate-check",
        "Start date cannot be before today",
        function (value) {
          if (!value) return false;
          if (!editId) {
            // Add mode: startdate >= today
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return value >= today;
          }
          return true; // Edit mode: no restriction
        }
      ),
    enddate: Yup.date()
      .required("End date is required")
      .min(Yup.ref("startdate"), "End date must be after start date"),
    minpurchasevalue: Yup.number()
      .required("Minimum purchase value is required")
      .min(0, "Cannot be negative"),
    mincouponvalue: Yup.number()
      .required("Minimum coupon value is required")
      .min(0, "Cannot be negative"),
    limitation: Yup.number()
      .required("Limitation is required")
      .min(1, "Must be at least 1"),
    image: Yup.mixed().test(
      "file-required",
      "Coupon image is required",
      function (value) {
        // Add mode: file must exist
        if (!editId) return value instanceof File;
        // Edit mode: allow URL string or new File
        return typeof value === "string" || value instanceof File;
      }
    ),
  });

  // ✅ Field Configs for ReusableForm
  const couponFields = [
    { name: "name", label: "Coupon Name", type: "text", required: true },
    { name: "code", label: "Coupon Code", type: "text", required: true },
    {
      name: "type",
      label: "Coupon Type",
      type: "select",
      required: true,
      options: [
        { label: "Percentage", value: "percentage" },
        { label: "Fixed", value: "fixed" },
      ],
    },
    { name: "value", label: "Value", type: "number", required: true },
    {
      name: "minpurchasevalue",
      label: "Minimum Purchase Value",
      type: "number",
      required: true,
    },
    {
      name: "mincouponvalue",
      label: "Minimum Coupon Value",
      type: "number",
      required: true,
    },
    { name: "limitation", label: "Limitation", type: "number", required: true },
    {
      name: "image",
      label: "Coupon Image",
      type: "file",
      accept: "image/*",
      required: true,
      onChange: (e, setFieldValue) => {
        const file = e.currentTarget.files[0];
        if (file) setFieldValue("image", file);
      },
      fieldProps: {
        renderPreview: (value) =>
          value && (
            <img
              src={
                typeof value === "string" ? value : URL.createObjectURL(value)
              }
              alt="coupon"
              className="mt-2 h-20 rounded-md border object-cover"
            />
          ),
      },
    },
    { name: "startdate", label: "Start Date", type: "date", required: true },
    { name: "enddate", label: "End Date", type: "date", required: true },
  ];

  // ✅ Compare changes before submit
  const isFormChanged = (values) => {
    if (!originalData) return true;
    const compare = { ...values };

    // if image is file object, skip comparison
    if (typeof compare.image !== "string") compare.image = originalData.image;

    return JSON.stringify(compare) !== JSON.stringify(originalData);
  };

  // ✅ Handle Submit
  const handleSubmit = async (values) => {
    if (editId && !isFormChanged(values)) {
      toast("No changes made", { icon: "ℹ️" });
      return;
    }

    const confirm = await Swal.fire({
      title: editId ? "Update Coupon?" : "Add Coupon?",
      text: "Do you want to save this coupon?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Save",
      cancelButtonText: "Cancel",
      buttonsStyling: false,
      customClass: {
        popup: "custom-swal-popup",
        title: "custom-swal-title",
        htmlContainer: "custom-swal-text",
        confirmButton: "custom-swal-confirm",
        cancelButton: "custom-swal-cancel",

      },
    });

    if (!confirm.isConfirmed) return;

    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, val]) => {
        if (val) formData.append(key, val);
      });
      formData.append("add_by", add_by);
      if (editId) formData.append("id", editId);

      setLoading(true);
      const res = editId
        ? await UpdateCoupons(token, formData)
        : await AddCoupons(token, formData);

      if (res?.status) {
        toast.success(res?.message || "Saved successfully");
        navigate("/superadmin/coupons");
      } else {
        toast.error(res?.message || "Failed to save");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Content
      Page_title={editId ? "Edit Coupon" : "Add Coupon"}
      button_status={true}
      button_title="Back"
      route="/superadmin/coupons"
    >
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          {editId ? "Edit Coupon" : "Add Coupon"}
        </h2>

        <ReusableForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          fields={couponFields}
          SubmitBtn={editId ? "Update Coupon" : "Save Coupon"}
          enableReinitialize={true}
          loading={loading}
        />
      </div>
    </Content>
  );
}
