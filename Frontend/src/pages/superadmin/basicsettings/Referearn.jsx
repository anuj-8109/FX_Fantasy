import React, { useEffect, useState } from "react";
import Content from "../../../components/superadmin/Content";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import * as Yup from "yup";
import ReusableForm from "../../../extracomponents/ResuableForm";
import * as config from "../../../utils/config";
import {
  GetBasicSettingDetails,
  UpdateBasicSettings,
} from "../../../services/SuperAdmin";

const Referearn = () => {
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    refer_title: "",
    refer_description: "",
    sender_earn: 0,
    receiver_earn: 0,
    refersendmsg: "",
    refer_image: null,
    refer_amount_used_percent: 0,
  });
  const [originalData, setOriginalData] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [hasImageChanged, setHasImageChanged] = useState(false); // ✅ Track image changes separately

  // Fetch settings from API
  const fetchReferSettings = async () => {
    setLoading(true);
    try {
      const response = await GetBasicSettingDetails(token);
      if (
        response?.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        const data = response.data[0];
        const cleanedData = {
          refer_title: data.refer_title || "",
          refer_description: data.refer_description || "",
          sender_earn: Number(data.sender_earn) || 0,
          receiver_earn: Number(data.receiver_earn) || 0,
          refersendmsg: data.refersendmsg || "",
          refer_image: null,
          refer_amount_used_percent:
            Number(data.refer_amount_used_percent) || 0,
        };
        setInitialValues(cleanedData);
        setOriginalData(cleanedData);
        setHasImageChanged(false); // Reset image change tracker

        if (data.refer_image) {
          setExistingImage(data.refer_image);
        }
      }
    } catch (error) {
      toast.error(
        "Error fetching Refer & Earn settings: " + (error?.message || error)
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferSettings();
  }, []);

  // Yup validation schema - Image ko optional rakho
  const validationSchema = Yup.object({
    refer_title: Yup.string().required("Title is required"),
    refer_description: Yup.string().required("Description is required"),
    sender_earn: Yup.number()
      .min(0, "Sender earn must be at least 0")
      .required("Sender earn is required"),
    receiver_earn: Yup.number()
      .min(0, "Receiver earn must be at least 0")
      .required("Receiver earn is required"),
    refersendmsg: Yup.string().required("Share message is required"),
    refer_amount_used_percent: Yup.number()
      .min(0, "Percentage must be at least 0")
      .max(100, "Percentage cannot exceed 100")
      .required("Refer amount used percentage is required"),
    refer_image: Yup.mixed().nullable(), // ✅ Make it explicitly nullable
  });

  // ✅ COMPLETELY REWRITTEN: Ignore image field in comparison
  const isFormChanged = (values) => {
    if (!originalData) return true;

    // If image has been changed (tracked separately), return true
    if (hasImageChanged) return true;

    // Only compare non-image fields
    const fieldsToCompare = [
      "refer_title",
      "refer_description",
      "sender_earn",
      "receiver_earn",
      "refersendmsg",
      "refer_amount_used_percent",
    ];

    return fieldsToCompare.some((key) => {
      const originalValue = originalData[key];
      const currentValue = values[key];

      // Number comparison
      if (
        typeof originalValue === "number" ||
        typeof currentValue === "number"
      ) {
        return Number(originalValue) !== Number(currentValue);
      }

      // String comparison with trim
      const origStr = String(originalValue || "").trim();
      const currStr = String(currentValue || "").trim();
      return origStr !== currStr;
    });
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    // Debug logs (remove in production)
    console.log("📝 Form Values:", values);
    console.log("📦 Original Data:", originalData);
    console.log("🖼️ Has Image Changed:", hasImageChanged);
    console.log("🔄 Is Form Changed:", isFormChanged(values));

    // Check if changes were made
    if (!isFormChanged(values)) {
      toast("No changes made", { icon: "ℹ️" });
      return;
    }

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update Refer & Earn settings?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Update",
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

    setUpdateLoading(true);
    try {
      const response = await UpdateBasicSettings(token, values);
      toast.success(
        response?.message || "Refer & Earn settings updated successfully"
      );
      setHasImageChanged(false); // Reset after successful update
      fetchReferSettings();
    } catch (error) {
      toast.error("Error updating settings: " + (error?.message || error));
      console.error(error);
    } finally {
      setUpdateLoading(false);
    }
  };

  // ✅ Modified fields to track image changes
  const referFields = [
    {
      name: "refer_title",
      label: "Title",
      type: "text",
      required: true,
      colClass: "col-span-2",
    },
    {
      name: "refer_amount_used_percent",
      label: "Refer Amount Used (%)",
      type: "number",
      required: true,
      colClass: "col-span-2",
    },
    {
      name: "sender_earn",
      label: "Sender Earn (%)",
      type: "number",
      required: true,
      colClass: "col-span-2",
    },
    {
      name: "receiver_earn",
      label: "Receiver Earn (%)",
      type: "number",
      required: true,
      colClass: "col-span-2",
    },
    {
    name: "refer_description",
    label: "Description",
    type: "ckeditor",
    required: true,
    colClass: "col-span-4",
  },
    {
      name: "refersendmsg",
      label: "Share Message",
      type: "textarea",
      required: true,
      colClass: "col-span-4",
      rows: 3,
    },
    {
      name: "refer_image",
      label: "Image",
      type: "file",
      colClass: "col-span-4",
      onChange: (e) => {
        // ✅ Track when image is changed
        if (e.target.files && e.target.files[0]) {
          setHasImageChanged(true);
        }
      },
    },
  ];

  const getImageUrl = () => {
    if (!existingImage) return null;
    return `${
      config.image_url || "YOUR_BASE_URL"
    }uploads/refer/${existingImage}`;
  };

  if (loading) {
    return (
      <Content
        Page_title="Refer & Earn"
        button_title="Back"
        route="/superadmin/dashboard"
        button_status={true}
      >
        <div className="text-center py-12">
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </Content>
    );
  }

  return (
    <Content
      Page_title="Refer & Earn"
      button_title="Back"
      route="/superadmin/dashboard"
      button_status={true}
    >
      <div className="bg-white p-6 rounded-xl shadow-md">

        {existingImage && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
            <h3 className="font-semibold text-gray-800 mb-2">Current Image:</h3>
            <img
              src={getImageUrl()}
              alt="Refer Image"
              className="w-48 h-48 object-cover rounded-md border shadow-sm"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <p className="text-sm text-gray-500 mt-2">
              Upload a new image to replace this one
            </p>
          </div>
        )}

        <ReusableForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          fields={referFields}
          SubmitBtn="Update Settings"
          enableReinitialize={true}
          loading={updateLoading}
        />
      </div>
    </Content>
  );
};

export default Referearn;
