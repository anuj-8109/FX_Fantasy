// pages/user/AddContest.jsx
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { addprivatecontent } from "../../../services/User";
import toast from "react-hot-toast";

const AddContest = () => {
    const token = localStorage.getItem("token");
    const client_id = localStorage.getItem("userId");
    const location = useLocation();
    const tournament_id = location.state?.tournament_id || "";

    const initialForm = {
        name: "",
        description: "",
        contest_type: "",
        entry_fee: "",
        total_spots: "",
        max_entry_per_user: "",
        prize_pool: "",
        is_guaranteed: false,
        client_id,
        tournament_id,
        contest_code: "",
        useamount: 0,
    };


    const [formData, setFormData] = useState(initialForm);
    const [prizeDist, setPrizeDist] = useState([{ rank: 1, amount: "" }]);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handlePrizeChange = (index, field, value) => {
        const updated = [...prizeDist];
        updated[index][field] = value;
        setPrizeDist(updated);
    };

    const addPrizeRow = () => setPrizeDist((prev) => [...prev, { rank: prev.length + 1, amount: "" }]);
    const removePrizeRow = (index) => setPrizeDist((prev) => prev.filter((_, i) => i !== index));

    const handleSubmit = async (e) => {
        e.preventDefault();

        for (let pd of prizeDist) {
            if (!pd.rank || !pd.amount || isNaN(pd.amount)) {
                toast.error("All prize distribution fields must be valid numbers!");
                return;
            }
        }

        const payload = {
            ...formData,
            useamount: formData.useamount || 0,
            prize_distribution: prizeDist.map((p) => ({ rank: parseInt(p.rank), amount: parseFloat(p.amount) })),
        };

        try {
            setLoading(true);
            const response = await addprivatecontent(token, payload);
            setLoading(false);

            if (response.status) {
                toast.success(response.message || "Contest added successfully!");
                setFormData(initialForm);
                setPrizeDist([{ rank: 1, amount: "" }]);
            } else {
                toast.error(response.message || "Failed to add contest");
            }
        } catch (err) {
            setLoading(false);
            toast.error(err.message || "Something went wrong");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded mt-6">
            <h2 className="text-2xl font-bold mb-6">Add Contest</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name & Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Contest Name" className="w-full p-3 border rounded" required />
                    <input type="text" name="contest_type" value={formData.contest_type} onChange={handleChange} placeholder="Contest Type" className="w-full p-3 border rounded" />
                </div>

                {/* Entry Fee & Total Spots */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="number" name="entry_fee" value={formData.entry_fee} onChange={handleChange} placeholder="Entry Fee" className="w-full p-3 border rounded" />
                    <input type="number" name="total_spots" value={formData.total_spots} onChange={handleChange} placeholder="Total Spots" className="w-full p-3 border rounded" />
                </div>

                {/* Max Entry & Prize Pool */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="number" name="max_entry_per_user" value={formData.max_entry_per_user} onChange={handleChange} placeholder="Max Entry per User" className="w-full p-3 border rounded" />
                    <input type="number" name="prize_pool" value={formData.prize_pool} onChange={handleChange} placeholder="Prize Pool" className="w-full p-3 border rounded" />
                </div>

                {/* Description */}
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full p-3 border rounded" required />

                {/* Prize Distribution */}
                <div className="space-y-2">
                    <input
                        type="number"
                        name="useamount"
                        value={formData.useamount}
                        onChange={handleChange}
                        placeholder="Use Amount"
                        className="w-full p-3 border rounded"
                    />

                    <h3 className="font-semibold text-gray-700">Prize Distribution</h3>
                    {prizeDist.map((pd, index) => (
                        <div key={index} className="flex gap-2 items-center">
                            <input type="number" value={pd.rank} onChange={(e) => handlePrizeChange(index, "rank", e.target.value)} placeholder="Rank" className="w-16 p-2 border rounded" />
                            <input type="number" value={pd.amount} onChange={(e) => handlePrizeChange(index, "amount", e.target.value)} placeholder="Amount" className="w-24 p-2 border rounded" />
                            {prizeDist.length > 1 && <button type="button" onClick={() => removePrizeRow(index)} className="px-2 py-1 bg-red-500 text-white rounded">Remove</button>}
                        </div>
                    ))}
                    <button type="button" onClick={addPrizeRow} className="px-3 py-1 bg-green-500 text-white rounded">Add Prize</button>
                </div>

                {/* Guaranteed Checkbox */}
                <label className="flex items-center space-x-2">
                    <input type="checkbox" name="is_guaranteed" checked={formData.is_guaranteed} onChange={handleChange} className="w-5 h-5" />
                    <span className="text-gray-700 font-medium">Is Guaranteed?</span>
                </label>

                {/* Submit */}
                <button type="submit" disabled={loading} className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition">
                    {loading ? "Saving..." : "Add Contest"}
                </button>
            </form>
        </div>
    );
};

export default AddContest;
