import React, { useState, useEffect } from "react";
import { addTournament, stocklist } from "../../../services/SuperAdmin";
import Content from "../../../components/superadmin/Content";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import * as Yup from "yup";

function AddTournament() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const add_by = localStorage.getItem("add_by");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("upcoming");
  const [stocks, setStocks] = useState([{ stock_id: "", stock_name: "" }]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [useamount, setUseAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [stocklistData, setStocklistData] = useState([]);
  const [searchResults, setSearchResults] = useState({});

  // Yup validation schema
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Tournament name is required"),
    description: Yup.string().required("Description is required"),
    startDate: Yup.date().required("Start date is required"),
    endDate: Yup.date()
      .required("End date is required")
      .min(Yup.ref("startDate"), "End date cannot be before start date"),
    status: Yup.string().required("Status is required"),
    stocks: Yup.array()
      .of(
        Yup.object().shape({
          stock_id: Yup.string().required(
            "Select a valid stock from suggestions"
          ),
          stock_name: Yup.string().required(),
        })
      )
      .min(1, "At least one stock is required")
      .max(2, "You can add maximum 2 stocks only"),
    useamount: Yup.string().required("Use amount is required"),
  });

  useEffect(() => {
    fetchStockList();
  }, []);

  const fetchStockList = async () => {
    try {
      const res = await stocklist(token);
      if (res?.status) {
        setStocklistData(res?.data || []);
      } else {
        Swal.fire("Failed to fetch stocks");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addStockRow = () => {
    if (stocks.length >= 2) {
      toast.error("You can add maximum 2 stocks only");
      return;
    }
    setStocks([...stocks, { stock_id: "", stock_name: "" }]);
  };

  const removeStockRow = (i) => setStocks(stocks.filter((_, idx) => idx !== i));

  // handleSearchChange ko update karo
  const handleSearchChange = (i, value) => {
    const updated = [...stocks];
    updated[i].stock_name = value;
    updated[i].stock_id = "";
    setStocks(updated);

    let filtered = stocklistData;

    if (value.length > 0) {
      filtered = stocklistData.filter((s) =>
        s.symbol.toLowerCase().includes(value.toLowerCase())
      );
    }

    setSearchResults((prev) => ({ ...prev, [i]: filtered }));
  };

  const handleSelectStock = (i, stock) => {
    const updated = [...stocks];
    updated[i] = {
      stock_id: stock._id,
      stock_name: stock.symbol,
      instrument_token: stock.instrument_token,
      lotsize: stock.lotsize,
    };
    setStocks(updated);
    setSearchResults((prev) => ({ ...prev, [i]: [] }));
  };

  const onCancel = () => navigate("/superadmin/tournament");

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      // Validate all fields first
      await validationSchema.validate(
        { name, description, stocks, startDate, endDate, useamount, status },
        { abortEarly: false }
      );

      // Confirmation popup
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to save this tournament?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes!",
        cancelButtonText: "Cancel",
        buttonsStyling: false,
        customClass: {
          popup: "custom-swal-popup",
          title: "text-xl font-semibold text-gray-800",
          confirmButton:
            "px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition",
          cancelButton:
            "px-4 py-2 rounded-lg text-white bg-gray-500 hover:bg-gray-600 transition",
        },
      });

      if (!result.isConfirmed) return; // agar cancel kare to API call mat karo

      setLoading(true);

      const payload = {
        name,
        description,
        startdate: startDate,
        enddate: endDate,
        status,
        useamount,
        stocks,
        add_by,
      };

      const res = await addTournament(payload, token);

      if (res?.status) {
        toast.success("Tournament added successfully");
        navigate("/superadmin/tournament");
      } else {
        Swal.fire("Failed to add tournament");
      }
    } catch (err) {
      if (err.inner) {
        const messages = err.inner.map((e) => e.message).join("\n");
        Swal.fire("Validation Error", messages, "error");
      } else {
        Swal.fire("Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Content
      Page_title="Add Tournament"
      button_title="Back"
      button_status={true}
      route="/superadmin/tournament"
    >
      <div className="w-full max-w-5xl shadow-xl rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          Add Tournament
        </h2>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Tournament Name */}
          <div>
            <label className="text-sm font-medium">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-md px-3 py-2 mt-1"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium">Description</label>
            <CKEditor
              editor={ClassicEditor}
              data={description}
              onChange={(event, editor) => setDescription(editor.getData())}
            />
          </div>

          {/* Stocks */}
          <div>
            <h3 className="font-medium mb-2">Stocks *</h3>
            {stocks?.map((s, idx) => (
              <div key={idx} className="mb-4 relative">
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Search stock by symbol"
                    value={s.stock_name}
                    onChange={(e) => handleSearchChange(idx, e.target.value)}
                    onFocus={() =>
                      setSearchResults((prev) => ({
                        ...prev,
                        [idx]: stocklistData,
                      }))
                    }
                    className="w-full border rounded-md px-2 py-1"
                    required
                  />
                  {stocks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStockRow(idx)}
                      className="text-red-600 text-sm px-2"
                    >
                      X
                    </button>
                  )}
                </div>

                {/* Suggestions List */}
                {searchResults[idx]?.length > 0 && (
                  <ul
                    className="absolute z-10 bg-white border rounded-md shadow 
                 max-h-40 overflow-y-auto w-full mt-1"
                  >
                    {searchResults[idx].slice(0, 500).map(
                      (
                        stock // slice se optional limit
                      ) => (
                        <li
                          key={stock._id}
                          onClick={() => handleSelectStock(idx, stock)}
                          className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                        >
                          {stock.symbol} ({stock.tradesymbol})
                        </li>
                      )
                    )}
                  </ul>
                )}
              </div>
            ))}

            {stocks.length < 2 && (
              <button
                type="button"
                onClick={addStockRow}
                className="text-blue-600 text-sm"
              >
                + Add Stock
              </button>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded-md px-3 py-2 mt-1"
            >
              <option value="upcoming">Upcoming</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Use Amount*</label>
            <input
              type="text"
              value={useamount}
              onChange={(e) => setUseAmount(e.target.value)}
              className="w-full border rounded-md px-3 py-2 mt-1"
              required
            />
          </div>

          {/* Schedule */}
          <div>
            <h3 className="font-medium mb-2"> Schedule *</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 mt-1"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">End Date & Time *</label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 mt-1"
                  required
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-md border bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md bg-blue-600 text-white"
            >
              {loading ? "Saving..." : "Save Tournament"}
            </button>
          </div>
        </form>
      </div>
    </Content>
  );
}

export default AddTournament;
