import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import * as Yup from "yup";
import Content from "../../../components/superadmin/Content";
import ReusableForm from "../../../extracomponents/ResuableForm";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { AddBlog, UpdateBlog } from "../../../services/SuperAdmin";

export default function AddEditBlog() {
  const navigate = useNavigate();
  const location = useLocation();
  const blogData = location.state?.blog || null;
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
    if (blogData) {
      const data = {
        title: blogData.title || "",
        description: blogData.description || "",
        image: null, // existing image handled separately
      };
      setInitialValues(data);
      setOriginalData(data);
    }
  }, [blogData]);

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    image: blogData
      ? Yup.mixed() // optional on edit
      : Yup.mixed().required("Image is required"), // required on add
  });

  const isFormChanged = (values) => {
    if (!originalData) return true;
    const formCopy = { ...values, image: null }; // ignore image for comparison
    return (
      JSON.stringify(formCopy) !==
      JSON.stringify({ ...originalData, image: null })
    );
  };

  const handleSubmit = async (values) => {
    if (blogData && !isFormChanged(values)) {
      toast("No changes made", { icon: "ℹ️" });
      return;
    }

    const confirm = await Swal.fire({
      title: blogData ? "Update Blog?" : "Add Blog?",
      text: "Do you want to save this blog?",
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
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("add_by", add_by);
      if (values.image instanceof File) formData.append("image", values.image);
      if (blogData) formData.append("id", blogData._id);

      setLoading(true);
      const res = blogData
        ? await UpdateBlog(token, formData)
        : await AddBlog(token, formData);

      if (res?.status) {
        toast.success(res?.message || "Blog saved successfully");
        navigate("/superadmin/blog");
      } else {
        toast.error(res?.message || "Failed to save blog");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const blogFields = [
    { name: "title", label: "Title", type: "text", required: true },
    {
      name: "description",
      label: "Description",
      type: "ckeditor",
      required: true,
    },
    { name: "image", label: "Image", type: "file" }, // optional on edit
  ];

  return (
    <Content
      Page_title={blogData ? "Edit Blog" : "Add Blog"}
      button_status={true}
      button_title="Back"
      route="/superadmin/blog"
    >
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          {blogData ? "Edit Blog" : "Add Blog"}
        </h2>

        <ReusableForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          fields={blogFields}
          SubmitBtn={blogData ? "Update Blog" : "Save Blog"}
          enableReinitialize={true}
          loading={loading}
        />
      </div>
    </Content>
  );
}
