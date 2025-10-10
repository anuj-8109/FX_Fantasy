// pages/user/AddContest.jsx
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { addprivatecontent } from "../../../services/User";
import toast from "react-hot-toast";
import BackButton from "../Backbutton";

const AddContest = () => {
  const token = localStorage.getItem("token");
  const client_id = localStorage.getItem("userId");
  const location = useLocation();
  const tournament_id = location.state?.tournament_id;

  const initialForm = {
    add_by: "",
    name: "",
    description: "",
    contest_type: "Mega",
    entry_fee: "",
    total_spots: "",
    max_entry_per_user: "1",
    prize_pool: "",
    contest_option: "", // default blank
    is_guaranteed: false,
    is_private: false,
    client_id,
    tournament_id,
    contest_code: "",
    start_date: "",
    end_date: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [prizeDist, setPrizeDist] = useState([{ from: 1, to: 1, amount: "" }]);
  const [loading, setLoading] = useState(false);

  // Generic change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle radio change for Guaranteed/Flexible
  const handleContestOptionChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      contest_option: value,
      is_guaranteed: value === "guaranteed",
      is_private: value === "flexible",
    }));
  };

  // Prize distribution handlers
  const handlePrizeChange = (index, field, value) => {
    const updated = [...prizeDist];
    updated[index][field] = value;
    setPrizeDist(updated);
  };

  const addPrizeRow = () => {
    const lastTo = prizeDist.length
      ? parseInt(prizeDist[prizeDist.length - 1].to || 1)
      : 1;
    setPrizeDist((prev) => [...prev, { from: lastTo + 1, to: lastTo + 1, amount: "" }]);
  };

  const removePrizeRow = (index) =>
    setPrizeDist((prev) => prev.filter((_, i) => i !== index));

  // Form validation
  const validateForm = () => {
    if (!formData.name.trim()) return "Contest Name is required";
    if (!formData.entry_fee || formData.entry_fee < 0) return "Valid Entry Fee required";
    if (!formData.total_spots || formData.total_spots <= 0) return "Total Spots required";
    if (!formData.prize_pool || formData.prize_pool < 0) return "Prize Pool required";

    for (let pd of prizeDist) {
      if (!pd.from || !pd.to || !pd.amount || isNaN(pd.amount))
        return "All prize rows must be valid numbers";
    }
    return null;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) return toast.error(error);

    const payload = {
      ...formData,
      prize_distribution: prizeDist.map((p) => ({
        rank: parseInt(p.from),
        amount: parseFloat(p.amount),
      })),
    };

    try {
      setLoading(true);
      const response = await addprivatecontent(token, payload);
      setLoading(false);

      if (response?.status) {
        toast.success(response?.message || "Contest added successfully!");
        setFormData(initialForm);
        setPrizeDist([{ from: 1, to: 1, amount: "" }]);
      } else {
        toast.error(response?.message || "Failed to add contest");
      }
    } catch (err) {
      setLoading(false);
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow rounded">
      <div className="flex items-center justify-between border p-2 mb-6 rounded bg-gray-100">
        <h2 className="text-2xl font-bold">Add Contest</h2>
        <BackButton />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name & Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Contest Name"
            className="w-full p-3 border rounded"
            required
          />
          <input
            type="text"
            name="contest_type"
            value={formData.contest_type}
            onChange={handleChange}
            placeholder="Contest Type"
            className="w-full p-3 border rounded"
          />
        </div>

        {/* Entry Fee & Total Spots */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="number"
            name="entry_fee"
            value={formData.entry_fee}
            onChange={handleChange}
            placeholder="Entry Fee"
            className="w-full p-3 border rounded"
          />
          <input
            type="number"
            name="total_spots"
            value={formData.total_spots}
            onChange={handleChange}
            placeholder="Total Spots"
            className="w-full p-3 border rounded"
          />
        </div>

        {/* Prize Pool */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="number"
            name="prize_pool"
            value={formData.prize_pool}
            onChange={handleChange}
            placeholder="Prize Pool"
            className="w-full p-3 border rounded"
          />
        </div>

        {/* Description */}
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-3 border rounded"
        />

        {/* Prize Distribution */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-700">Prize Distribution</h3>
          {prizeDist.map((pd, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                type="number"
                value={pd.from}
                onChange={(e) => handlePrizeChange(idx, "from", e.target.value)}
                placeholder="From"
                className="w-16 p-2 border rounded"
              />
              <input
                type="number"
                value={pd.to}
                onChange={(e) => handlePrizeChange(idx, "to", e.target.value)}
                placeholder="To"
                className="w-16 p-2 border rounded"
              />
              <input
                type="number"
                value={pd.amount}
                onChange={(e) => handlePrizeChange(idx, "amount", e.target.value)}
                placeholder="Amount"
                className="w-24 p-2 border rounded"
              />
              {prizeDist.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePrizeRow(idx)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addPrizeRow}
            className="px-3 py-1 bg-green-500 text-white rounded"
          >
            Add Prize
          </button>
        </div>

        {/* Guaranteed / Flexible */}
        <div className="flex items-center space-x-6">
          <span className="text-gray-700 font-medium">Contest Option:</span>

          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="contest_option"
              value="guaranteed"
              checked={formData.contest_option === "guaranteed"}
              onChange={(e) => handleContestOptionChange(e.target.value)}
              className="w-5 h-5"
            />
            <span>Guaranteed</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="contest_option"
              value="flexible"
              checked={formData.contest_option === "flexible"}
              onChange={(e) => handleContestOptionChange(e.target.value)}
              className="w-5 h-5"
            />
            <span>Flexible</span>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 bg-orange-600 hover:bg-orange-700 text-white rounded font-semibold transition"
        >
          {loading ? "Saving..." : "Add Contest"}
        </button>
      </form>
    </div>
  );
};

export default AddContest;
