import React, { useState } from "react";
import { addTournament } from "../../../services/SuperAdmin";
import Content from "../../../components/superadmin/Content";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

function AddTournament() {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const add_by = localStorage.getItem("add_by");

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("upcoming");
    const [stocks, setStocks] = useState([{ stock_name: "" }]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(false);


    const addStockRow = () => setStocks([...stocks, { stock_name: "" }]);

    const removeStockRow = (i) =>
        setStocks(stocks.filter((_, idx) => idx !== i));

    const handleStockChange = (i, value) => {
        const updated = [...stocks];
        updated[i].stock_name = value;
        setStocks(updated);
    };

    const onCancel = () => {
        navigate("/superadmin/tournament");
    };


    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {

            const payload = {
                name,
                description,
                startdate: startDate,
                enddate: endDate,
                status,
                stocks,
                add_by: add_by,
            };

            const res = await addTournament(payload, token);

            if (res?.status) {
               toast.success("Tournament added successfully ");
                navigate("/superadmin/tournament");
            } else {
                Swal.fire("Failed to add tournament ");
            }
        } catch (err) {
            Swal.fire("Something went wrong!");
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
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">Add Tournament</h2>

                <form onSubmit={handleSave} className="space-y-6">

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


                    <div>
                        <label className="text-sm font-medium">Description</label>
                        <CKEditor
                            editor={ClassicEditor}
                            data={description}
                            onChange={(event, editor) => setDescription(editor.getData())}
                        />
                    </div>

                    <div>
                        <h3 className="font-medium mb-2"> Stocks *</h3>
                        {stocks.map((s, idx) => (
                            <div key={idx} className="flex gap-2 mb-2 items-center">
                                <input
                                    type="text"
                                    placeholder="Stock Name (e.g., TCS, INFY)"
                                    value={s.stock_name}
                                    onChange={(e) => handleStockChange(idx, e.target.value)}
                                    className="w-full border rounded-md px-2 py-1"
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
                        <button
                            type="button"
                            onClick={addStockRow}
                            className="text-blue-600 text-sm"
                        >
                            + Add Stock
                        </button>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full border rounded-md px-3 py-2 mt-1"
                        >
                            <option value="upcoming">Upcoming</option>
                            <option value="live">Live</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <div>
                        <h3 className="font-medium mb-2"> Schedule *</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium">Start Date & Time *</label>
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
