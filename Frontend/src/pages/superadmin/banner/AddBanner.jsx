import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import * as Yup from "yup";
import Content from "../../../components/superadmin/Content";
import ReusableForm from "../../../extracomponents/ResuableForm";
import { AddBanner, UpdateBanner } from "../../../services/SuperAdmin";

export default function AddEditBanner() {
  const navigate = useNavigate();
  const location = useLocation();

  const bannerData = location.state?.banner || null; // edit data via state
  const token = localStorage.getItem("token");
  const add_by = localStorage.getItem("add_by");

  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    image: null,
    hyperlink: "",
    type: "",
  });
  const [originalData, setOriginalData] = useState(null);

  // preload if edit mode
  useEffect(() => {
    if (bannerData) {
      setInitialValues({
        image: bannerData.image || null,
        hyperlink: bannerData.hyperlink || "",
        type: bannerData.type || "",
      });
      setOriginalData({
        image: bannerData.image || null,
        hyperlink: bannerData.hyperlink || "",
        type: bannerData.type || "",
      });
    }
  }, [bannerData]);

  // ✅ Validation schema
  const validationSchema = Yup.object({
    image: Yup.mixed().required("Image is required"),
    hyperlink: Yup.string()
      .url("Invalid URL")
      .required("Hyperlink is required"),
    type: Yup.string().required("Type is required"),
  });

  // 🔹 Detect if form changed
  const isFormChanged = (values) => {
    if (!originalData) return true;
    return (
      values.hyperlink !== originalData.hyperlink ||
      values.type !== originalData.type ||
      values.image !== originalData.image
    );
  };

  // 🔹 Handle submit
  const handleSubmit = async (values) => {
    if (bannerData && !isFormChanged(values)) {
      toast("No changes made", { icon: "ℹ️" });
      return;
    }

    const confirm = await Swal.fire({
      title: bannerData ? "Update Banner?" : "Add Banner?",
      text: "Do you want to save this banner?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Save",
      cancelButtonText: "Cancel",
      buttonsStyling: false,
      customClass: {
        confirmButton:
          "px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition",
        cancelButton:
          "px-4 py-2 rounded-lg text-white bg-gray-500 hover:bg-gray-600 transition",
      },
    });

    if (!confirm.isConfirmed) return;

    try {
      const formData = new FormData();
      formData.append("add_by", add_by);
      formData.append("hyperlink", values.hyperlink);
      formData.append("type", values.type);
      if (values.image instanceof File) {
        formData.append("image", values.image);
      }
      if (bannerData) formData.append("id", bannerData._id);

      setLoading(true);
      const res = bannerData
        ? await UpdateBanner(token, formData)
        : await AddBanner(token, formData);

      if (res?.status) {
        toast.success(res?.message || "Banner saved successfully");
        navigate("/superadmin/banner");
      } else {
        toast.error(res?.message || "Failed to save banner");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fields for ReusableForm
  const bannerFields = [
    { name: "image", label: "Image", type: "file", required: true },
    {
      name: "hyperlink",
      label: "Hyperlink",
      type: "text",
      required: true,
      placeholder: "Enter banner hyperlink (https://example.com)",
    },
    {
      name: "type",
      label: "Type",
      type: "text",
      required: true,
      placeholder: "Enter banner type (e.g. Home, Sidebar)",
    },
  ];

  return (
    <Content
      Page_title={bannerData ? "Edit Banner" : "Add Banner"}
      button_status={true}
      button_title="Back"
      route="/superadmin/banner"
    >
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          {bannerData ? "Edit Banner" : "Add Banner"}
        </h2>

        <ReusableForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          fields={bannerFields}
          SubmitBtn={bannerData ? "Update Banner" : "Save Banner"}
          enableReinitialize={true}
          loading={loading}
        />
      </div>
    </Content>
  );
}
