import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import * as Yup from "yup";
import Content from "../../../components/superadmin/Content";
import ReusableForm from "../../../extracomponents/ResuableForm";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { AddContent, UpdateContent } from "../../../services/SuperAdmin";

export default function AddEditContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const contentData = location.state?.content || null; // edit data
  const token = localStorage.getItem("token");
  const add_by = localStorage.getItem("add_by");

  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
  });
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    if (contentData) {
      const data = {
        title: contentData.title || "",
        description: contentData.description || "",
      };
      setInitialValues(data);
      setOriginalData(data);
    }
  }, [contentData]);

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
  });

  const isFormChanged = (values) => {
    if (!originalData) return true;
    return JSON.stringify(values) !== JSON.stringify(originalData);
  };

  const handleSubmit = async (values) => {
    if (contentData && !isFormChanged(values)) {
      toast("No changes made", { icon: "ℹ️" });
      return;
    }

    const confirm = await Swal.fire({
      title: contentData ? "Update Content?" : "Add Content?",
      text: "Do you want to save this content?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Save",
      cancelButtonText: "Cancel",
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
      const payload = { ...values, add_by };
      if (contentData) payload.id = contentData._id;

      setLoading(true);
      const res = contentData
        ? await UpdateContent(token, payload)
        : await AddContent(token, payload);

      if (res?.status) {
        toast.success(res?.message || "Content saved successfully");
        navigate("/superadmin/content"); // go back to list
      } else {
        toast.error(res?.message || "Failed to save content");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const contentFields = [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "description", label: "Description", type: "ckeditor", required: true },
  ];

  return (
    <Content
      Page_title={contentData ? "Edit Content" : "Add Content"}
      button_status={true}
      button_title="Back"
      route="/superadmin/content"
    >
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          {contentData ? "Edit Content" : "Add Content"}
        </h2>

        <ReusableForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          fields={contentFields}
          SubmitBtn={contentData ? "Update Content" : "Save Content"}
          enableReinitialize={true}
          loading={loading}
        />
      </div>
    </Content>
  );
}
