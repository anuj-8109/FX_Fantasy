import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import * as Yup from "yup";
import Content from "../../../components/superadmin/Content";
import ReusableForm from "../../../extracomponents/ResuableForm";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { AddNews, UpdateNews } from "../../../services/SuperAdmin";

export default function AddEditNews() {
  const navigate = useNavigate();
  const location = useLocation();
  const newsData = location.state?.news || null;
  const token = localStorage.getItem("token");
  const add_by = localStorage.getItem("add_by");

  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
    image: null,
  });
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    if (newsData) {
      const data = {
        title: newsData.title || "",
        description: newsData.description || "",
        image: null, // existing image handled separately
      };
      setInitialValues(data);
      setOriginalData(data);
    }
  }, [newsData]);

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    image: newsData
      ? Yup.mixed() // optional on edit
      : Yup.mixed().required("Image is required"), // required on add
  });

  const isFormChanged = (values) => {
    if (!originalData) return true;
    const formCopy = { ...values, image: null }; // ignore image for comparison
    return JSON.stringify(formCopy) !== JSON.stringify({ ...originalData, image: null });
  };

  const handleSubmit = async (values) => {
    if (newsData && !isFormChanged(values)) {
      toast("No changes made", { icon: "ℹ️" });
      return;
    }

    const confirm = await Swal.fire({
      title: newsData ? "Update News?" : "Add News?",
      text: "Do you want to save this news?",
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
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("add_by", add_by);
      if (values.image instanceof File) formData.append("image", values.image);
      if (newsData) formData.append("id", newsData._id);

      setLoading(true);
      const res = newsData
        ? await UpdateNews(token, formData)
        : await AddNews(token, formData);

      if (res?.status) {
        toast.success(res?.message || "News saved successfully");
        navigate("/superadmin/news");
      } else {
        toast.error(res?.message || "Failed to save news");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const newsFields = [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "description", label: "Description", type: "ckeditor", required: true },
    { name: "image", label: "Image", type: "file" }, // optional on edit
  ];

  return (
    <Content
      Page_title={newsData ? "Edit News" : "Add News"}
      button_status={true}
      button_title="Back"
      route="/superadmin/news"
    >
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          {newsData ? "Edit News" : "Add News"}
        </h2>

        <ReusableForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          fields={newsFields}
          SubmitBtn={newsData ? "Update News" : "Save News"}
          enableReinitialize={true}
          loading={loading}
        />
      </div>
    </Content>
  );
}
