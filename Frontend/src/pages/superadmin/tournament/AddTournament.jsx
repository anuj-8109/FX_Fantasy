import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import * as Yup from "yup";
import Content from "../../../components/superadmin/Content";
import ReusableForm from "../../../extracomponents/ResuableForm";
import {
  addTournament,
  UpdateTournament,
  stocklist,
} from "../../../services/SuperAdmin";

export default function AddEditTournament() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const add_by = localStorage.getItem("add_by");

  const tournamentData = location.state?.tournament || null;

  const [loading, setLoading] = useState(false);
  const [stocksListData, setStocksListData] = useState([]);

  const [initialValues, setInitialValues] = useState({
    name: "",
    description: "",
    stocks: [{ ticker: "" }],
    useamount: "",
    startdate: "",
    enddate: "",
    status: "upcoming",
  });

  const [originalData, setOriginalData] = useState(null);

  const toLocalDateTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}T${String(
      date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  useEffect(() => {
    fetchStocksList();

    if (tournamentData) {
      const stocksArr = tournamentData.stocks?.length
        ? tournamentData.stocks.map((c) => ({ ticker: c.stock_name }))
        : [{ ticker: "" }];

      const formattedData = {
        name: tournamentData.name || "",
        description: tournamentData.description || "",
        stocks: stocksArr,
        useamount: tournamentData.useamount || "",
        startdate: toLocalDateTime(tournamentData.startdate),
        enddate: toLocalDateTime(tournamentData.enddate),
        status: tournamentData.status || "upcoming",
      };

      setInitialValues(formattedData);
      setOriginalData(formattedData);
    }
  }, [tournamentData]);

  const fetchStocksList = async () => {
    try {
      const res = await stocklist(token);
      if (res?.status) setStocksListData(res.data || []);
      else Swal.fire("Failed to fetch stocks list");
    } catch (err) {
      console.error(err);
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Tournament name is required"),
    description: Yup.string().required("Description is required"),
    startdate: Yup.date().required("Start date is required"),
    enddate: Yup.date().required("End date is required"),
    useamount: Yup.string().required("Virtual amount is required"),
    stocks: Yup.array().min(1).max(2),
  });

  const isFormChanged = (values) => {
    if (!originalData) return true;
    return JSON.stringify(values) !== JSON.stringify(originalData);
  };

  const handleSubmit = async (values) => {
    // ✅ VERY IMPORTANT — now sending `stock_name` (not ticker)
    values.stocks = values.stocks.map((c) => ({
      stock_name: c.ticker,
    }));

    if (tournamentData && !isFormChanged(values)) {
      toast("No changes made", { icon: "ℹ️" });
      return;
    }

    const confirm = await Swal.fire({
      title: tournamentData ? "Update Tournament?" : "Add Tournament?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);

      const payload = {
        ...values,
        add_by,
        status: "upcoming",
      };

      if (tournamentData) payload.id = tournamentData._id;

      const res = tournamentData
        ? await UpdateTournament(payload, token)
        : await addTournament(payload, token);

      if (res?.status) {
        toast.success(res?.message || "Tournament saved successfully");
        navigate("/superadmin/tournament");
      } else {
        toast.error(res?.message || "Failed to save tournament");
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const tournamentFields = [
    {
      name: "name",
      label: "Tournament Name",
      type: "text",
      required: true,
      colClass: "col-span-2",
    },
    {
      name: "description",
      label: "Description",
      type: "ckeditor",
      required: true,
      colClass: "col-span-4",
    },
    {
      name: "stocks",
      label: "Stocks",
      type: "custom",
      required: true,
      colClass: "col-span-4",
      render: (field, form, values, setFieldValue) => {
        return (
          <div>
            {values.stocks.map((c, idx) => (
              <div key={idx} className="mb-3">
                <label className="text-sm font-medium block mb-1">
                  Stock {idx + 1}
                </label>
                <select
                  value={c.ticker}
                  onChange={(e) => {
                    const updated = [...values.stocks];
                    updated[idx].ticker = e.target.value;
                    setFieldValue("stocks", updated);
                  }}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="">Select Stock</option>
                  {stocksListData.map((item) => (
                    <option key={item._id} value={item.ticker}>
                      {item.ticker.toUpperCase()}
                    </option>
                  ))}
                </select>

                {values.stocks.length > 1 && (
                  <button
                    type="button"
                    className="text-red-500 mt-1"
                    onClick={() => {
                      const updated = values.stocks.filter((_, i) => i !== idx);
                      setFieldValue("stocks", updated);
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            {values.stocks.length < 2 && (
              <button
                type="button"
                onClick={() =>
                  setFieldValue("stocks", [...values.stocks, { ticker: "" }])
                }
                className="text-blue-600"
              >
                + Add More
              </button>
            )}
          </div>
        );
      },
    },
    {
      name: "useamount",
      label: "Virtual Amount",
      type: "number",
      required: true,
      colClass: "col-span-2",
    },
    {
      name: "startdate",
      label: "Start Date & Time",
      type: "datetime-local",
      required: true,
      colClass: "col-span-2",
    },
    {
      name: "enddate",
      label: "End Date & Time",
      type: "datetime-local",
      required: true,
      colClass: "col-span-2",
    },
  ];

  return (
    <Content
      Page_title={tournamentData ? "Edit Tournament" : "Add Tournament"}
      button_status={true}
      button_title="Back"
      route="/superadmin/tournament"
    >
      <div className="bg-white p-6 rounded-xl shadow-md">
        <ReusableForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          fields={tournamentFields}
          SubmitBtn={tournamentData ? "Update Tournament" : "Save Tournament"}
          enableReinitialize={true}
          loading={loading}
        />
      </div>
    </Content>
  );
}
