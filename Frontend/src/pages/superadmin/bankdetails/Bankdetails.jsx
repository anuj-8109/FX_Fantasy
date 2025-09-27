import React, { useState } from 'react'
import { getBankdetails } from "../../../services/SuperAdmin"
import toast from 'react-hot-toast'
import { useEffect } from 'react'

function Bankdetails() {

    const [kycdetails, setKycdetails] = useState([]);
    const token = localStorage.getItem("token")
    const client_id = localStorage.getItem("userId");
    console.log("kycdetails", kycdetails)
    console.log("client_id", client_id)

    const fatchkycdetails = async () => {
        try {
            const res = await getBankdetails(token, client_id);
            if (res?.status) {
                setKycdetails(res?.data)
            }
            else {
                toast.error(res?.message || "Failed to load Information");
            }
        } catch (error) {
            toast.error("Error updating status");
        }
    }

    useEffect(() => {
        fatchkycdetails();
    }, [])


    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Bank details</h2>
            {kycdetails.length > 0 ? (
                <table className="min-w-full border border-gray-300 rounded-lg">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="px-4 py-2 border">#</th>
                            <th className="px-4 py-2 border">Bank Name</th>
                            <th className="px-4 py-2 border">Account No</th>
                            <th className="px-4 py-2 border">IFSC</th>
                            <th className="px-4 py-2 border">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {kycdetails.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-2 border">{index + 1}</td>
                                <td className="px-4 py-2 border">{item.bank_name}</td>
                                <td className="px-4 py-2 border">{item.account_number}</td>
                                <td className="px-4 py-2 border">{item.ifsc_code}</td>
                                <td className="px-4 py-2 border">
                                    {item.status === "approved" ? (
                                        <span className="text-green-600 font-semibold">Approved</span>
                                    ) : (
                                        <span className="text-yellow-600 font-semibold">Pending</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-gray-500">No KYC details found.</p>
            )}
        </div>
    );


}

export default Bankdetails;