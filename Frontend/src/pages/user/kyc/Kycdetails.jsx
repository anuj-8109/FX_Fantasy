import React, { useEffect, useState } from "react";
import { KYCVarifiaction, GetUserDetails, getState, getCityByStates } from "../../../services/User";
import toast from "react-hot-toast";

function Kycdetails() {
    const [adhaarphotofront, setAadhaarFront] = useState(null);
    const [adhaarphotoback, setAadhaarBack] = useState(null);
    const [pancard, setPanFront] = useState(null);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [dob, setDob] = useState("");

    // lists
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]); // **array**

    // selected values
    const [selectedState, setSelectedState] = useState("");
    const [selectedCity, setSelectedCity] = useState("");

    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("userId");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!adhaarphotofront || !adhaarphotoback || !pancard) {
            toast.error("Please upload all documents");
            return;
        }

        if (!email || !name || !phone || !dob) {
            toast.error("Please fill in all the required fields");
            return;
        }

        // validate selected state/city
        if (!selectedState || !selectedCity) {
            toast.error("Please select your state and city");
            return;
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        const formData = new FormData();
        formData.append("id", id);
        formData.append("adhaarphotofront", adhaarphotofront);
        formData.append("adhaarphotoback", adhaarphotoback);
        formData.append("pancard", pancard);
        formData.append("email", email);
        formData.append("name", name);
        formData.append("phone", phone);
        formData.append("dob", dob);
        formData.append("state", selectedState);
        formData.append("city", selectedCity);

        console.log("Form Data:", formData);

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

    const fetchData = async () => {
        const userDetails = await GetUserDetails(token, id);
        if (userDetails?.data) {
            setEmail(userDetails.data.Email || "");
            setName(userDetails.data.FullName || "");
            setPhone(userDetails.data.PhoneNo || "");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // fetch states list
    useEffect(() => {
        const fetchStates = async () => {
            const res = await getState(token);
            console.log("State API Response:", res);
            if (Array.isArray(res)) {
                setStates(res);
            } else if (Array.isArray(res?.data)) {
                setStates(res.data);
            } else {
                setStates([]);
            }
        };
        fetchStates();
    }, [token]);

    // fetch cities when selectedState changes
    useEffect(() => {
        const fetchCities = async () => {
            if (!selectedState) {
                setCities([]);
                setSelectedCity(""); // reset selected city
                return;
            }

            console.log("Fetching cities for state:", selectedState);
            const res = await getCityByStates(token, selectedState);
            console.log("City API Response:", res);

            if (Array.isArray(res)) {
                setCities(res);
            } else if (Array.isArray(res?.data)) {
                setCities(res.data);
            } else {
                setCities([]);
            }
            setSelectedCity(""); // reset selected city after new list
        };

        fetchCities();
    }, [selectedState, token]);

    return (
        <div className="max-w-6xl mx-auto border border-gray-300 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-center mb-4">KYC Verification</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* file inputs... (same as your code) */}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label>Name</label>
                        <input
                            type="text"
                            className="w-full border p-2 rounded-lg text-sm"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Mobile</label>
                        <input
                            type="text"
                            className="w-full border p-2 rounded-lg text-sm"
                            placeholder="Mobile"
                            value={phone}
                            readOnly
                        />
                    </div>

                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            className="w-full border p-2 rounded-lg text-sm"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>DOB</label>
                        <input
                            type="date"
                            className="w-full border p-2 rounded-lg text-sm"
                            placeholder="DOB"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label>State</label>
                        <select
                            className="w-full border p-2 rounded-lg text-sm"
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                            required
                        >
                            <option value="">Select State</option>
                            {states.map((state) => (
                                // use state._id (or state.id if API expects number) — check console if unsure
                                <option key={state._id} value={state.name}>
                                    {state.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>City</label>
                        
                            <select
                                className="w-full border p-2 rounded-lg text-sm"
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                                required
                            >
                                <option value="">Select City</option>
                                {Array.isArray(cities) &&
                                    cities.map((city) => (
                                        <option key={city._id} value={city.city}>
                                            {city.city}
                                        </option>
                                    ))}
                            </select>
                        

                    </div>
                </div>

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
