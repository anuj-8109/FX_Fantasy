import React, { useState } from "react";
import { addBank } from "../../../services/User";
import toast from "react-hot-toast";

export default function AddBankForm() {
    const [formData, setFormData] = useState({
        name: "",
        branch: "",
        accountno: "",
        ifsc: "",
        client_id: "",
    });

    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");
    const client_id = localStorage.getItem("userId")

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Add client_id to formData
        const dataToSend = { ...formData, client_id };

        // Basic validation
        const { name, branch, accountno, ifsc } = formData;
        if (!name || !branch || !accountno || !ifsc) {
            toast.error("All fields are required");
            setLoading(false);
            return;
        }

        try {
            const res = await addBank(token, dataToSend); // send client_id here
            if (res?.status) {
                toast.success("Bank added successfully");
                setFormData({ name: "", branch: "", accountno: "", ifsc: "" });
            } else {
                toast.error(res?.message || "Failed to add bank");
            }
        } catch (error) {
            toast.error("Network error");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="max-w-6xl mx-auto p-4 border rounded-md shadow-md">
            <h3 className="text-center font-bold text-lg mb-4">Add Bank Details</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Bank Name"
                    className="w-full border p-2 rounded"
                />
                <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    placeholder="Branch"
                    className="w-full border p-2 rounded"
                />
                <input
                    type="text"
                    name="accountno"
                    value={formData.accountno}
                    onChange={handleChange}
                    placeholder="Account Number"
                    className="w-full border p-2 rounded"
                />
                <input
                    type="text"
                    name="ifsc"
                    value={formData.ifsc}
                    onChange={handleChange}
                    placeholder="IFSC Code"
                    className="w-full border p-2 rounded"
                />


                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                >
                    {loading ? "Adding..." : "Add Bank"}
                </button>
            </form>
        </div>
    );
}
