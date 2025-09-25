import React, { useState } from "react";
import Content from "../../../components/superadmin/Content";

function Kycdetails() {
  const [aadhaarFront, setAadhaarFront] = useState(null);
  const [aadhaarBack, setAadhaarBack] = useState(null);
  const [panFront, setPanFront] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add API call to upload files
    console.log({
      aadhaarFront,
      aadhaarBack,
      panFront,
    });
    alert("KYC submitted successfully!");
  };

  return (
 
      <div className="max-w-6xl mx-auto  border border-gray-300 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-center mb-4">KYC Verification</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Aadhaar Front */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Aadhaar Front *
            </label>
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
            <label className="block text-sm font-medium mb-1">
              Aadhaar Back *
            </label>
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
            <label className="block text-sm font-medium mb-1">
              PAN Front *
            </label>
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
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium"
          >
            Submit KYC
          </button>
        </form>
      </div>

  );
}

export default Kycdetails;
