import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import * as Yup from "yup";
import Content from "../../../components/superadmin/Content";
import ReusableForm from "../../../extracomponents/ResuableForm";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
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
  const [stocklistData, setStocklistData] = useState([]);
  const [showDropdown, setShowDropdown] = useState({});

  const [initialValues, setInitialValues] = useState({
    name: "",
    description: "",
    stocks: [{ stock_id: "", stock_name: "" }],
    useamount: "",
    startdate: "",
    enddate: "",
    status: "upcoming",
  });

  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    fetchStockList();
    if (tournamentData) {
      setInitialValues({
        name: tournamentData.name || "",
        description: tournamentData.description || "",
        stocks: tournamentData.stocks || [{ stock_id: "", stock_name: "" }],
        useamount: tournamentData.useamount || "",
        startdate: tournamentData.startdate || "",
        enddate: tournamentData.enddate || "",
        status: tournamentData.status || "upcoming",
      });
      setOriginalData(tournamentData);
    }
  }, [tournamentData]);

  const fetchStockList = async () => {
    try {
      const res = await stocklist(token);
      if (res?.status) setStocklistData(res.data || []);
      else Swal.fire("Failed to fetch stocks");
    } catch (err) {
      console.error(err);
    }
  };

  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required("Tournament name is required"),
    description: Yup.string().required("Description is required"),
    startdate: Yup.date()
      .required("Start date is required")
      .min(new Date(), "Start date cannot be in the past"),
    enddate: Yup.date()
      .required("End date is required")
      .min(Yup.ref("startdate"), "End date cannot be before start date"),
    useamount: Yup.string().required("Use amount is required"),
    stocks: Yup.array()
      .of(
        Yup.object().shape({
          stock_id: Yup.string().required("Select a valid stock"),
          stock_name: Yup.string().required("Stock name required"),
        })
      )
      .min(1, "At least one stock is required")
      .max(2, "You can add maximum 2 stocks only"),
  });

  const isFormChanged = (values) => {
    if (!originalData) return true;
    return JSON.stringify(values) !== JSON.stringify(originalData);
  };

  const handleSubmit = async (values) => {
    if (tournamentData && !isFormChanged(values)) {
      toast("No changes made", { icon: "ℹ️" });
      return;
    }

    const confirm = await Swal.fire({
      title: tournamentData ? "Update Tournament?" : "Add Tournament?",
      text: "Do you want to save this tournament?",
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
      setLoading(true);
      const payload = {
        ...values,
        add_by,
        status: "upcoming",
      };

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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fields Configuration
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
      render: (field, form, values, setFieldValue) => (
        <div className="space-y-4">
          {values.stocks.map((s, idx) => {
            // Filter stocks based on search
            const searchTerm = s.stock_name?.trim().toLowerCase();
            const filtered = searchTerm
              ? stocklistData.filter(
                  (st) =>
                    st.symbol.toLowerCase().includes(searchTerm) ||
                    st.tradesymbol?.toLowerCase().includes(searchTerm)
                )
              : stocklistData.slice(0, 50); // Show first 50 stocks when no search

            // Show dropdown when focused or typing
            const shouldShowDropdown =
              showDropdown[idx] && filtered.length > 0 && !s.stock_id;

            return (
              <div key={idx} className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock {idx + 1}
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={s.stock_name}
                    onChange={(e) => {
                      const updated = [...values.stocks];
                      updated[idx].stock_name = e.target.value;
                      updated[idx].stock_id = "";
                      setFieldValue("stocks", updated);
                      setShowDropdown({ ...showDropdown, [idx]: true });
                    }}
                    onFocus={() => {
                      setShowDropdown({ ...showDropdown, [idx]: true });
                    }}
                    onBlur={() => {
                      // Delay to allow click on dropdown
                      setTimeout(() => {
                        setShowDropdown({ ...showDropdown, [idx]: false });
                      }, 200);
                    }}
                    placeholder="Search stock by symbol or name"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {values.stocks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const updated = values.stocks.filter(
                          (_, i) => i !== idx
                        );
                        setFieldValue("stocks", updated);
                      }}
                      className="text-red-600 hover:text-red-800 font-bold text-lg px-3 py-2 border border-red-300 rounded-md hover:bg-red-50"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Selected stock display */}
                {s.stock_id && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md text-sm text-green-700">
                    ✓ Selected: <strong>{s.stock_name}</strong>
                  </div>
                )}

                {/* Suggestions dropdown */}
                {shouldShowDropdown && (
                  <div className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-lg mt-1 w-full max-h-[240px] overflow-y-scroll">
                    <ul>
                      {filtered.length > 0 ? (
                        filtered.map((stock) => (
                          <li
                            key={stock._id}
                            onMouseDown={(e) => {
                              e.preventDefault(); // Prevent input blur
                              const updated = [...values.stocks];
                              updated[idx] = {
                                stock_id: stock._id,
                                stock_name: stock.symbol,
                                instrument_token: stock.instrument_token,
                                lotsize: stock.lotsize,
                              };
                              setFieldValue("stocks", updated);
                              setShowDropdown({
                                ...showDropdown,
                                [idx]: false,
                              });
                            }}
                            className="px-4 py-3 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-semibold text-gray-800">
                              {stock.symbol}
                            </div>
                            <div className="text-xs text-gray-500">
                              {stock.tradesymbol}
                            </div>
                          </li>
                        ))
                      ) : (
                        <li className="px-4 py-3 text-gray-500 text-sm">
                          No stocks found
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Validation error */}
                {form.touched.stocks?.[idx]?.stock_id &&
                  form.errors.stocks?.[idx]?.stock_id && (
                    <div className="text-red-500 text-sm mt-1">
                      {form.errors.stocks[idx].stock_id}
                    </div>
                  )}
              </div>
            );
          })}

          {/* Add stock button */}
          {values.stocks.length < 2 && (
            <button
              type="button"
              onClick={() =>
                setFieldValue("stocks", [
                  ...values.stocks,
                  { stock_id: "", stock_name: "" },
                ])
              }
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 mt-2"
            >
              <span className="text-lg">+</span> Add Another Stock
            </button>
          )}

          {values.stocks.length >= 2 && (
            <div className="text-sm text-gray-500 italic">
              Maximum 2 stocks can be added
            </div>
          )}
        </div>
      ),
    },
    {
      name: "useamount",
      label: "Use Amount",
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
