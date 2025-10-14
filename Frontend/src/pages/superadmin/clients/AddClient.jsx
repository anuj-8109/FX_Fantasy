import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import * as Yup from "yup";
import Content from "../../../components/superadmin/Content";
import ReusableForm from "../../../extracomponents/ResuableForm";
import {
  AddClient,
  UpdateClient,
  getState,
  getStateByCity,
} from "../../../services/SuperAdmin";

export default function AddEditClient() {
  const navigate = useNavigate();
  const location = useLocation();
  const clientData = location.state?.client || null;
  const token = localStorage.getItem("token");
  const add_by = localStorage.getItem("add_by");

  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [initialValues, setInitialValues] = useState({
    FullName: "",
    Email: "",
    PhoneNo: "",
    state: "",
    city: "",
    dob: "",
  });

  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    fetchStates();
  }, []);

  useEffect(() => {
    if (clientData) {
      setInitialValues({
        FullName: clientData.FullName || "",
        Email: clientData.Email || "",
        PhoneNo: clientData.PhoneNo || "",
        state: clientData.state || "",
        city: clientData.city || "",
        dob: clientData.dob || "",
      });
      setOriginalData({
        FullName: clientData.FullName || "",
        Email: clientData.Email || "",
        PhoneNo: clientData.PhoneNo || "",
        state: clientData.state || "",
        city: clientData.city || "",
        dob: clientData.dob || "",
      });

      // 🧠 Fetch city list for existing state when editing
      if (clientData.state) {
        fetchCities(clientData.state);
      }
    }
  }, [clientData]);

  const fetchStates = async () => {
    try {
      const res = await getState(token);
      if (res) setStates(res);
    } catch (err) {
      toast.error("Failed to load states");
    }
  };

  const fetchCities = async (stateName) => {
    try {
      if (!stateName) return setCities([]);
      const res = await getStateByCity(stateName, token);
      if (res) setCities(res);
    } catch (err) {
      toast.error("Failed to load cities");
    }
  };

  const validationSchema = Yup.object({
    FullName: Yup.string().required("Full Name is required"),
    Email: Yup.string().email("Invalid email").required("Email is required"),
    PhoneNo: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
    state: Yup.string().required("State is required"),
    city: Yup.string().required("City is required"),
    dob: Yup.date()
      .max(
        new Date(new Date().setDate(new Date().getDate() - 1)),
        "Date of Birth cannot be today or a future date"
      )
      .required("Date of Birth is required"),
  });

  const isFormChanged = (values) => {
    if (!originalData) return true;
    return (
      values.FullName !== originalData.FullName ||
      values.Email !== originalData.Email ||
      values.PhoneNo !== originalData.PhoneNo ||
      values.state !== originalData.state ||
      values.city !== originalData.city ||
      values.dob !== originalData.dob
    );
  };

  const handleSubmit = async (values) => {
    if (clientData && !isFormChanged(values)) {
      toast("No changes made", { icon: "ℹ️" });
      return;
    }

    const confirm = await Swal.fire({
      title: clientData ? "Update Client?" : "Add Client?",
      text: "Do you want to save this client?",
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

    const payload = {
      add_by,
      FullName: values.FullName,
      Email: values.Email,
      PhoneNo: values.PhoneNo,
      state: values.state,
      city: values.city,
      dob: values.dob,
    };
    if (clientData) payload.id = clientData._id;

    try {
      setLoading(true);
      const res = clientData
        ? await UpdateClient(token, payload)
        : await AddClient(token, payload);

      if (res?.status) {
        toast.success(res?.message || "Client saved successfully");
        navigate("/superadmin/clients");
      } else {
        toast.error(res?.message || "Failed to save client");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const clientFields = [
    { name: "FullName", label: "Full Name", type: "text", required: true },
    { name: "Email", label: "Email", type: "email", required: true },
    { name: "PhoneNo", label: "Phone No", type: "text", required: true },
    {
      name: "state",
      label: "State",
      type: "select",
      required: true,
      options: states.map((s) => ({ label: s.name, value: s.name })),
      onChange: (e, setFieldValue) => {
        const selectedState = e.target.value;
        setFieldValue("state", selectedState);
        setFieldValue("city", "");
        fetchCities(selectedState);
      },
    },
    {
      name: "city",
      label: "City",
      type: "select",
      required: true,
      options: cities.map((c) => ({ label: c.city, value: c.city })),
    },
    { name: "dob", label: "Date of Birth", type: "date", required: true },
  ];

  return (
    <Content
      Page_title={clientData ? "Edit Client" : "Add Client"}
      button_status={true}
      button_title="Back"
      route="/superadmin/clients"
    >
      <div className="bg-white p-6 rounded-xl shadow-md">
        {/* <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          {clientData ? "Edit Client" : "Add Client"}
        </h2> */}

        <ReusableForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          fields={clientFields}
          SubmitBtn={clientData ? "Update Client" : "Save Client"}
          enableReinitialize={true}
          loading={loading}
        />
      </div>
    </Content>
  );
}
