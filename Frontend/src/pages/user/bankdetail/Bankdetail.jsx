import React, { useState } from "react";
import { addBank } from "../../../services/User";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import BackButton from "../../../pages/user/Backbutton";

export default function AddBankForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        branch: "",
        accountno: "",
        ifsc: "",
        client_id: "",
    });
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");
    const client_id = localStorage.getItem("userId");

    const handleChange = (e) => {
        const { name, value } = e.target;

        let newValue = value;
        if (name === "name" || name === "branch") {
            newValue = value.replace(/[^a-zA-Z\s]/g, ""); // letters only
        } else if (name === "accountno") {
            newValue = value.replace(/\D/g, ""); // digits only
        } else if (name === "ifsc") {
            newValue = value.toUpperCase().replace(/[^A-Z0-9]/g, ""); // alphanumeric uppercase
        }

        setFormData({ ...formData, [name]: newValue });
    };

    const validateForm = () => {
        const { name, branch, accountno, ifsc } = formData;

        if (!name) {
            toast.error("Bank name is required and must contain letters only");
            return false;
        }
        if (!branch) {
            toast.error("Branch is required and must contain letters only");
            return false;
        }
        if (!accountno) {
            toast.error("Account number is required and must contain digits only");
            return false;
        }
        if (!ifsc) {
            toast.error("IFSC code is required");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        const dataToSend = { ...formData, client_id };

        try {
            const res = await addBank(token, dataToSend);
            if (res?.status) {
                toast.success("Bank added successfully");
                setFormData({ name: "", branch: "", accountno: "", ifsc: "" });
                navigate("/wallet");
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
            <div className="w-full flex items-center justify-between mb-2 p-3 bg-gray-50 rounded-xl shadow-sm border border-blue-200">
                <h3 className="text-center font-bold text-lg ">Add Bank Details</h3>
                <BackButton showText={true} />
            </div>
            <div className="border p-2">
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
                        className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
                    >
                        {loading ? "Adding..." : "Add Bank"}
                    </button>
                </form>
            </div>
        </div>
    );
}
