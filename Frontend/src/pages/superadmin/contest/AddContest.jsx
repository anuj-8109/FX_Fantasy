import React, { useState, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { AddContest } from "../../../services/SuperAdmin";
import Content from "../../../components/superadmin/Content";
import { useLocation } from "react-router-dom";

export default function AddContest1({ onSuccess, onCancel }) {
    const location = useLocation();
    const tournamentId = location?.state?.tournament_id;
    console.log("Received tournamentId:", tournamentId);
    const [authData, setAuthData] = useState({
        add_by: null,
        token: null,
        isValid: false
    });

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [contestType, setContestType] = useState("Mega");
    const [entryFee, setEntryFee] = useState("");
    const [useAmount, setUseAmount] = useState(""); 
    const [totalSpots, setTotalSpots] = useState("");
    const [maxEntryPerUser, setMaxEntryPerUser] = useState(1);
    const [prizePool, setPrizePool] = useState("");
    const [prizeDistribution, setPrizeDistribution] = useState([
        { from: 1, to: 1, amount: "" },
    ]);

    const [stocks, setStocks] = useState([{ stock_name: "" }]);
    const [isGuaranteed, setIsGuaranteed] = useState(false);
    const [isPrivate, setIsPrivate] = useState(false);
    const [contestCode, setContestCode] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [status, setStatus] = useState("upcoming");
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const add_by = localStorage.getItem("add_by");
        const token = localStorage.getItem("token");

        console.log("Auth Check:", { add_by, token }); // Debug log

        if (!add_by) {
            console.error("add_by not found in localStorage");
            toast.error("User session not found. Please login again.");
        }

        if (!token) {
            console.error("token not found in localStorage");
            toast.error("Authentication token not found. Please login again.");
        }

        setAuthData({
            add_by,
            token,
            isValid: !!(add_by && token)
        });
    }, []);

    // const handlePrizeChange = (idx, field, value) => {
    //     const updated = [...prizeDistribution];
    //     updated[idx][field] = value;
    //     setPrizeDistribution(updated);
    // };

    const addPrizeRow = () => {
        setPrizeDistribution([...prizeDistribution, { from: "", to: "", amount: "" }]);
    };

    const removePrizeRow = (idx) => {
        setPrizeDistribution(prizeDistribution.filter((_, i) => i !== idx));
    };

    const handlePrizeChange = (idx, field, value) => {
        const updated = [...prizeDistribution];
        updated[idx][field] = value;
        setPrizeDistribution(updated);
    };


    const handleStockChange = (idx, field, value) => {
        const updated = [...stocks];
        updated[idx][field] = value;
        setStocks(updated);
    };

    const expandPrizeDistribution = (prizes) => {
        let expanded = [];
        prizes.forEach((p) => {
            if (p.from && p.to && p.amount) {
                for (let r = parseInt(p.from); r <= parseInt(p.to); r++) {
                    expanded.push({
                        rank: r,
                        amount: Number(p.amount),
                    });
                }
            }
        });
        return expanded;
    };


    const addStockRow = () => {
        setStocks([...stocks, { stock_name: "" }]);
    };

    const removeStockRow = (idx) => {
        if (stocks.length > 1) {
            const updated = stocks.filter((_, i) => i !== idx);
            setStocks(updated);
        }
    };


    const validateForm = () => {
        const errors = [];

        if (!name.trim()) errors.push("Name is required");
        if (!contestType) errors.push("Contest type is required");
        if (entryFee === "" || entryFee < 0) errors.push("Valid entry fee is required");
        if (useAmount === "" || useAmount < 0) errors.push("Use amount is required");
        if (!totalSpots || totalSpots <= 0) errors.push("Total spots must be greater than 0");
        if (prizePool === "" || prizePool < 0) errors.push("Valid prize pool is required");
        if (!startDate || !endDate) errors.push("Start and End date are required");

        const start = new Date(startDate);
        const end = new Date(endDate);
        if (start >= end) errors.push("End date must be after start date");

        // ✅ Prize distribution validation
        const validPrizes = prizeDistribution.filter(p => p.from && p.to && p.amount);
        if (validPrizes.length === 0) {
            errors.push("At least one valid prize distribution is required");
        }

        validPrizes.forEach((p, idx) => {
            if (parseInt(p.from) <= 0) {
                errors.push(`Row ${idx + 1}: From rank must be greater than 0`);
            }
            if (parseInt(p.to) < parseInt(p.from)) {
                errors.push(`Row ${idx + 1}: To rank must be greater than or equal to From rank`);
            }
            if (parseFloat(p.amount) <= 0) {
                errors.push(`Row ${idx + 1}: Amount must be greater than 0`);
            }
        });

        // ✅ Overlap check
        for (let i = 0; i < validPrizes.length; i++) {
            for (let j = i + 1; j < validPrizes.length; j++) {
                if (
                    parseInt(validPrizes[i].from) <= parseInt(validPrizes[j].to) &&
                    parseInt(validPrizes[j].from) <= parseInt(validPrizes[i].to)
                ) {
                    errors.push(
                        `Row ${i + 1} and Row ${j + 1} have overlapping rank ranges`
                    );
                }
            }
        }

        if (!authData.isValid) {
            errors.push("Authentication required. Please login again.");
        }

        return errors;
    };

    const handleSave = async (e) => {
        e.preventDefault();


        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            toast.error(validationErrors[0]);
            console.log("Validation errors:", validationErrors);
            return;
        }

        const confirm = await Swal.fire({
            title: "Add Contest?",
            text: "Are you sure you want to add this contest?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, Add",
            cancelButtonText: "Cancel",
        });


        if (!confirm.isConfirmed) return;


        const cleanPrizeDistribution = expandPrizeDistribution(
            prizeDistribution.filter(p => p.from && p.to && p.amount)
        );

        const cleanStocks = stocks.filter(s => s.stock_name.trim());

        const payload = {
            add_by: authData.add_by,
            name: name.trim(),
            description,
            contest_type: contestType,
            entry_fee: Number(entryFee),
            useamount: Number(useAmount),
            total_spots: Number(totalSpots),
            max_entry_per_user: Number(maxEntryPerUser),
            prize_pool: Number(prizePool),
            prize_distribution: cleanPrizeDistribution,
            stocks: cleanStocks,
            is_guaranteed: isGuaranteed,
            is_private: isPrivate,
            contest_code: contestCode.trim(),
            startdate: startDate,
            enddate: endDate,
            status,
            tournament_id: tournamentId,

        };
        // console.log("Payload being sent:", payload); 

        setLoading(true);
        try {
            const response = await AddContest(authData.token, payload);
            setLoading(false);

            // console.log("API Response:", response); 

            if (response?.status) {
                toast.success(response?.message || "Contest added successfully");
                if (onSuccess) onSuccess();
            } else {

                const errorMessage = response?.message || "Failed to add contest";
                toast.error(errorMessage);


                if (errorMessage.includes("Invalid token") || errorMessage.includes("token")) {
                    console.error("Token validation failed. User needs to login again.");

                }
            }
        } catch (error) {
            setLoading(false);
            console.error("API Error:", error);
            toast.error("Network error. Please check your connection and try again.");
        }
    };


    if (!authData.isValid) {
        return (
            <Content Page_title="Add-content" button_title="Back" button_status={true} route="/superadmin/contest">
                <div className="w-full max-w-6xl bg-white shadow-xl rounded-xl p-6">
                    <div className="text-center py-8">
                        <h2 className="text-xl font-semibold mb-4 text-red-600">Authentication Required</h2>
                        <p className="text-gray-600 mb-4">Please login to access this feature.</p>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            </Content>
        );
    }

    return (
        <Content Page_title="Add-content" button_title="Back" button_status={true} route="/superadmin/contest">
            <div className="w-full max-w-6xl shadow-xl rounded-xl p-6 Add-client-style ">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">Add Contest</h2>

                <form onSubmit={handleSave} className="space-y-6">

                    <div>
                        <label className="text-sm font-medium">Name *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border rounded-md px-3 py-2 mt-1 input-Add"
                            required
                        />
                    </div>


                    <div>
                        <label className="text-sm font-medium input-Add">Description</label>
                        <CKEditor
                            editor={ClassicEditor}
                            data={description}
                            dangerouslySetInnerHTML={{ __html: description }}
                            onChange={(event, editor) => setDescription(editor.getData())}
                            className="input-Add"
                        />
                    </div>


                    <div>
                        <label className="text-sm font-medium  input-Add" >Contest Type *</label>
                        <select
                            value={contestType}
                            onChange={(e) => setContestType(e.target.value)}
                            className="w-full border rounded-md px-3 py-2 mt-1  input-Add"
                            required
                        >
                            <option value="Mega">Mega</option>
                            <option value="Head-to-Head">Head-to-Head</option>

                        </select>
                    </div>


                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">Entry Fee *</label>
                            <input
                                type="number"
                                min="0"
                                value={entryFee}
                                onChange={(e) => setEntryFee(e.target.value)}
                                className="w-full border rounded-md px-3 py-2 mt-1 input-Add"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Use Amount *</label>
                            <input
                                type="number"
                                min="0"
                                value={useAmount}
                                onChange={(e) => setUseAmount(e.target.value)}
                                className="w-full border rounded-md px-3 py-2 mt-1 input-Add"
                                placeholder="Amount to be used"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Total Spots *</label>
                            <input
                                type="number"
                                min="1"
                                value={totalSpots}
                                onChange={(e) => setTotalSpots(e.target.value)}
                                className="w-full border rounded-md px-3 py-2 mt-1 input-Add"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Max Entry/User</label>
                            <input
                                type="number"
                                min="1"
                                value={maxEntryPerUser}
                                onChange={(e) => setMaxEntryPerUser(e.target.value)}
                                className="w-full border rounded-md px-3 py-2 mt-1  input-Add"
                            />
                        </div>
                    </div>


                    <div>
                        <label className="text-sm font-medium">Prize Pool *</label>
                        <input
                            type="number"
                            min="0"
                            value={prizePool}
                            onChange={(e) => setPrizePool(e.target.value)}
                            className="w-full border rounded-md px-3 py-2 mt-1  input-Add"
                            required
                        />
                    </div>


                    <div>
                        <h3 className="font-medium mb-2">🏆 Prize Distribution *</h3>
                        {prizeDistribution.map((p, idx) => (
                            <div key={idx} className="flex gap-2 mb-1 items-center">
                                <input
                                    type="number"
                                    placeholder="From Rank"
                                    min="1"
                                    value={p.from}
                                    onChange={(e) => handlePrizeChange(idx, "from", e.target.value)}
                                    className="w-1/4 border rounded-md px-2 py-1"
                                />
                                <input
                                    type="number"
                                    placeholder="To Rank"
                                    min={p.from || 1}
                                    value={p.to}
                                    onChange={(e) => handlePrizeChange(idx, "to", e.target.value)}
                                    className="w-1/4 border rounded-md px-2 py-1"
                                />
                                <input
                                    type="number"
                                    placeholder="Amount"
                                    min="0"
                                    value={p.amount}
                                    onChange={(e) => handlePrizeChange(idx, "amount", e.target.value)}
                                    className="w-1/2 border rounded-md px-2 py-1"
                                />
                                {prizeDistribution.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removePrizeRow(idx)}
                                        className="text-red-600 text-sm px-2"
                                    >
                                        X
                                    </button>
                                )}
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addPrizeRow}
                            className="text-blue-600 text-sm"
                        >
                            + Add Prize Row
                        </button>
                    </div>



                    {/* <div>
                        <h3 className="font-medium mb-2 input-Add">📈 Stocks *</h3>
                        {stocks.map((s, idx) => (
                            <div key={idx} className="flex gap-2 mb-1 items-center ">
                                <input
                                    type="text"
                                    placeholder="Stock Name (e.g., TCS, RELIANCE)"
                                    value={s.stock_name}
                                    onChange={(e) => handleStockChange(idx, "stock_name", e.target.value)}
                                    className="w-full border rounded-md px-2 py-1 input-Add"
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
                        ))}
                        <button type="button" onClick={addStockRow} className="text-blue-600 text-sm">
                            Add Stock
                        </button>
                    </div> */}


                    <div>
                        <h3 className="font-medium mb-2"> Settings</h3>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm  input-Add">
                                <input
                                    type="checkbox"
                                    checked={isGuaranteed}
                                    onChange={(e) => setIsGuaranteed(e.target.checked)}
                                    className=" input-Add"
                                />
                                Guaranteed Contest
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={isPrivate}
                                    onChange={(e) => setIsPrivate(e.target.checked)}
                                    className=" input-Add"
                                />
                                Private Contest
                            </label>
                        </div>
                        <div className="mt-3">
                            <label className="text-sm font-medium">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full border rounded-md px-3 py-2 mt-1  input-Add"
                            >
                                <option value="upcoming">Upcoming</option>
                                {/* <option value="live">Live</option>
                                <option value="completed">Completed</option> */}
                            </select>
                        </div>
                    </div>


                    {/* <div>
                        <label className="text-sm font-medium ">Contest Code</label>
                        <input
                            type="text"
                            value={contestCode}
                            onChange={(e) => setContestCode(e.target.value)}
                            className="w-full border rounded-md px-3 py-2 mt-1  input-Add"
                            placeholder="Optional unique code for the contest "
                        />
                    </div> */}


                    <div>
                        <h3 className="font-medium mb-2">📅 Schedule *</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium">Start Date & Time *</label>
                                <input
                                    type="datetime-local"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full border rounded-md px-3 py-2 mt-1 input-Add"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">End Date & Time *</label>
                                <input
                                    type="datetime-local"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full border rounded-md px-3 py-2 mt-1  input-Add"
                                    required
                                />
                            </div>
                        </div>
                    </div>



                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 rounded-md   border bg-blue-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !authData.isValid}
                            className={`px-4 py-2 rounded-md  bg-blue-600  border 1px solid red`}
                        >
                            {loading ? "Saving..." : "Save Contest"}
                        </button>
                    </div>
                </form>
            </div>
        </Content>
    );
}