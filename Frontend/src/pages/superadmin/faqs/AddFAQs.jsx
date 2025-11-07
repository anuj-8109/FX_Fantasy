import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import * as Yup from "yup";
import Content from "../../../components/superadmin/Content";
import ReusableForm from "../../../extracomponents/ResuableForm";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { AddFAQs, UpdateFAQs } from "../../../services/SuperAdmin";

export default function AddEditFAQ() {
  const navigate = useNavigate();
  const location = useLocation();
  const faqData = location.state?.faq || null; // edit data from location state
  const token = localStorage.getItem("token");
  const add_by = localStorage.getItem("add_by");

  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
  });
  const [originalData, setOriginalData] = useState(null);

  // Populate form for edit
  useEffect(() => {
    if (faqData) {
      const data = {
        title: faqData.title || "",
        description: faqData.description || "",
      };
      setInitialValues(data);
      setOriginalData(data);
    }
  }, [faqData]);

  const validationSchema = Yup.object({
    title: Yup.string().required("Question is required"),
    description: Yup.string().required("Answer is required"),
  });

  const isFormChanged = (values) => {
    if (!originalData) return true;
    return JSON.stringify(values) !== JSON.stringify(originalData);
  };

  const handleSubmit = async (values) => {
    if (faqData && !isFormChanged(values)) {
      toast("No changes made", { icon: "ℹ️" });
      return;
    }

    const confirm = await Swal.fire({
      title: faqData ? "Update FAQ?" : "Add FAQ?",
      text: "Do you want to save this FAQ?",
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
      const payload = { ...values, add_by };
      if (faqData) payload.id = faqData._id;

      setLoading(true);
      const res = faqData
        ? await UpdateFAQs(token, payload)
        : await AddFAQs(token, payload);

      if (res?.status) {
        toast.success(res?.message || "FAQ saved successfully");
        navigate("/superadmin/faqs");
      } else {
        toast.error(res?.message || "Failed to save FAQ");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Fields config for ReusableForm
  const faqFields = [
    {
      name: "title",
      label: "Question",
      type: "text",
      required: true,
      colClass: "col-span-4",
    },
    {
      name: "description",
      label: "Answer",
      type: "ckeditor",
      required: true,
      colClass: "col-span-4",
    },
  ];

  return (
    <Content
      Page_title={faqData ? "Edit FAQ" : "Add FAQ"}
      button_status={true}
      button_title="Back"
      route="/superadmin/faqs"
    >
      <div className="bg-white p-6 rounded-xl shadow-md">
       

        <ReusableForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          fields={faqFields}
          SubmitBtn={faqData ? "Update FAQ" : "Save FAQ"}
          enableReinitialize={true}
          loading={loading}
        />
      </div>
    </Content>
  );
}
