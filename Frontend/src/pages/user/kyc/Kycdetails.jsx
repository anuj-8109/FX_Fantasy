import React, { useState } from "react";
import { KYCVarifiaction } from "../../../services/User";
import toast from "react-hot-toast";

function Kycdetails() {
    const [adhaarphotofront, setAadhaarFront] = useState(null);
    const [adhaarphotoback, setAadhaarBack] = useState(null);
    const [pancard, setPanFront] = useState(null);
    const [loading, setLoading] = useState(false);


    const token = localStorage.getItem("token");
    const id = localStorage.getItem("userId")

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!adhaarphotofront || !adhaarphotoback || !pancard) {
            toast.error("Please upload all documents");
            return;
        }

        const formData = new FormData();
        formData.append("id", id);
        formData.append("adhaarphotofront", adhaarphotofront);
        formData.append("adhaarphotoback", adhaarphotoback);
        formData.append("pancard", pancard);

        try {
            setLoading(true);
            const res = await KYCVarifiaction(token, formData);

            if (res?.status === true) {
                toast.success("KYC submitted successfully!");
                setAadhaarFront(null);
                setAadhaarBack(null);
                setPanFront(null);
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                toast.error(res?.message || "Something went wrong");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="max-w-6xl mx-auto border border-gray-300 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-center mb-4">KYC Verification</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Aadhaar Front */}
                <div>
                    <label className="block text-sm font-medium mb-1">Aadhaar Front *</label>
                    <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => setAadhaarFront(e.target.files[0])}
                        className="w-full border p-2 rounded-lg text-sm"
                        required
                    />
                </div>

                {/* Aadhaar Back */}
                <div>
                    <label className="block text-sm font-medium mb-1">Aadhaar Back *</label>
                    <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => setAadhaarBack(e.target.files[0])}
                        className="w-full border p-2 rounded-lg text-sm"
                        required
                    />
                </div>

                {/* PAN Front */}
                <div>
                    <label className="block text-sm font-medium mb-1">PAN Front *</label>
                    <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => setPanFront(e.target.files[0])}
                        className="w-full border p-2 rounded-lg text-sm"
                        required
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className={`w-full py-2 rounded-lg font-medium transition text-white ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                        }`}
                    disabled={loading}
                >
                    {loading ? "Submitting..." : "Submit KYC"}
                </button>
            </form>
        </div>
    );
}

export default Kycdetails;
