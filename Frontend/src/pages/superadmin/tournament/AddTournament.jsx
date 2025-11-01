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
    enddate: Yup.date()
      .required("End date is required")
      .min(Yup.ref('startdate'), "End date must be after start date"),
    useamount: Yup.number()
      .typeError("Virtual amount must be a number")
      .required("Virtual amount is required")
      .positive("Virtual amount must be positive"),
  });

  const isFormChanged = (values) => {
    if (!originalData) return true;
    return JSON.stringify(values) !== JSON.stringify(originalData);
  };

  const handleSubmit = async (values, formikBag) => {
    try {
      // ✅ Manual stocks validation
      if (!values.stocks || values.stocks.length === 0) {
        toast.error("Please add at least one stock");
        formikBag?.setSubmitting(false);
        return;
      }

      const hasEmptyStock = values.stocks.some(stock => !stock.ticker || stock.ticker === "");
      if (hasEmptyStock) {
        toast.error("Please select all stocks before saving");
        formikBag?.setSubmitting(false);
        return;
      }

      const tickers = values.stocks.map(s => s.ticker);
      const hasDuplicates = tickers.length !== new Set(tickers).size;
      if (hasDuplicates) {
        toast.error("Duplicate stocks are not allowed");
        formikBag?.setSubmitting(false);
        return;
      }

      if (tournamentData && !isFormChanged(values)) {
        toast("No changes made", { icon: "ℹ️" });
        formikBag?.setSubmitting(false);
        return;
      }

      const confirm = await Swal.fire({
        title: tournamentData ? "Update Tournament?" : "Add Tournament?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
      });

      if (!confirm.isConfirmed) {
        formikBag?.setSubmitting(false);
        return;
      }

      setLoading(true);

      const payload = {
        name: values.name,
        description: values.description,
        useamount: values.useamount,
        startdate: values.startdate,
        enddate: values.enddate,
        add_by,
        status: "upcoming",
        stocks: values.stocks.map((c) => ({
          stock_name: c.ticker,
        })),
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
      console.error("Error:", err);
    } finally {
      setLoading(false);
      formikBag?.setSubmitting(false);
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
      colClass: "col-span-4",
      render: (field, form, values, setFieldValue) => {
        // ✅ Check if form is submitted and stocks have errors
        const formSubmitted = form.submitCount > 0;

        return (
          <div>
            

            {values.stocks?.map((c, idx) => {
              // ✅ Check if this stock is empty and form was submitted
              const isEmpty = !c.ticker || c.ticker === "";
              const showError = formSubmitted && isEmpty;

              return (
                <div key={idx} className="mb-3 p-3 border rounded bg-gray-50">
                  <label className="text-sm font-medium block mb-1">
                    Stock {idx + 1}
                  </label>
                  <select
                    value={c.ticker || ""}
                    onChange={(e) => {
                      const updated = [...values.stocks];
                      updated[idx].ticker = e.target.value;
                      setFieldValue("stocks", updated);
                    }}
                    className={`w-full border px-3 py-2 rounded ${showError ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                  >
                    <option value="">-- Select Stock --</option>
                    {stocksListData.map((item) => (
                      <option key={item._id} value={item.ticker}>
                        {item.ticker.toUpperCase()}
                      </option>
                    ))}
                  </select>

                  {/* ✅ Show error message if empty and submitted */}
                  {showError && (
                    <p className="text-red-500 text-sm mt-1">
                      Please select a stock
                    </p>
                  )}

                  {values.stocks.length > 1 && (
                    <button
                      type="button"
                      className="text-red-500 mt-2 text-sm hover:underline"
                      onClick={() => {
                        const updated = values.stocks.filter((_, i) => i !== idx);
                        setFieldValue("stocks", updated);
                      }}
                    >
                      ✕ Remove Stock
                    </button>
                  )}
                </div>
              );
            })}

            {/* ✅ Show error if no stocks at all */}
            {formSubmitted && values.stocks.length === 0 && (
              <p className="text-red-500 text-sm mt-1">
                At least one stock is required
              </p>
            )}

            {values.stocks.length < 2 && (
              <button
                type="button"
                onClick={() =>
                  setFieldValue("stocks", [...values.stocks, { ticker: "" }])
                }
                className="text-blue-600 text-sm hover:underline mt-2"
              >
                + Add Another Stock
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