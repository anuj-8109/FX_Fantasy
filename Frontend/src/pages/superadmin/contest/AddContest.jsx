import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import * as Yup from "yup";
import Content from "../../../components/superadmin/Content";
import ReusableForm from "../../../extracomponents/ResuableForm";
import { AddContest, UpdateContest } from "../../../services/SuperAdmin";

export default function AddEditContest() {
  const navigate = useNavigate();
  const location = useLocation();
  const contestData = location.state?.contest || null;
  const tournamentId =
    location.state?.tournament_id || contestData?.tournament_id?._id;

  const token = localStorage.getItem("token");
  const add_by = localStorage.getItem("add_by");

  const [loading, setLoading] = useState(false);
  const [contestTypeSelection, setContestTypeSelection] = useState("normal");
  const [initialValues, setInitialValues] = useState({
    name: "",
    description: "",
    entry_fee: "",
    total_spots: "",
    prize_pool: "",
    prize_distribution: [{ from: 1, to: 1, amount: "" }],
  });
  const [originalData, setOriginalData] = useState(null);

  // Generate random contest code
  const generateContestCode = () => {
    return "CONT" + Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  // Merge prize distribution from expanded format to range format
  const mergePrizeDistribution = (prizes = []) => {
    if (!prizes.length) return [{ from: 1, to: 1, amount: "" }];
    const sorted = prizes.sort((a, b) => a.rank - b.rank);
    const merged = [];
    let start = sorted[0].rank;
    let end = sorted[0].rank;
    let amt = sorted[0].amount;

    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].amount === amt && sorted[i].rank === end + 1) {
        end++;
      } else {
        merged.push({ from: start, to: end, amount: amt });
        start = sorted[i].rank;
        end = sorted[i].rank;
        amt = sorted[i].amount;
      }
    }
    merged.push({ from: start, to: end, amount: amt });
    return merged;
  };

  useEffect(() => {
    if (contestData) {
      const mergedPrizes = contestData.prize_distribution?.length
        ? mergePrizeDistribution(contestData.prize_distribution)
        : [{ from: 1, to: 1, amount: "" }];

      // Determine contest type selection
      let typeSelection = "normal";
      if (contestData.is_guaranteed) typeSelection = "guaranteed";
      else if (contestData.is_private) typeSelection = "private";

      setContestTypeSelection(typeSelection);

      setInitialValues({
        name: contestData.name || "",
        description: contestData.description || "",
        entry_fee: contestData.entry_fee || "",
        total_spots: contestData.total_spots || "",
        prize_pool: contestData.prize_pool || "",
        prize_distribution: mergedPrizes,
      });

      setOriginalData({
        name: contestData.name || "",
        description: contestData.description || "",
        entry_fee: contestData.entry_fee || "",
        total_spots: contestData.total_spots || "",
        prize_pool: contestData.prize_pool || "",
        prize_distribution: mergedPrizes,
        contestType: typeSelection,
      });
    }
  }, [contestData]);

  const validationSchema = Yup.object({
    name: Yup.string().required("Contest name is required"),
    description: Yup.string().required("Description is required"),
    entry_fee: Yup.number()
      .min(0, "Entry fee must be 0 or greater")
      .required("Entry fee is required"),
    total_spots: Yup.number()
      .min(1, "Total spots must be at least 1")
      .required("Total spots is required"),
    prize_pool: Yup.number()
      .min(0, "Prize pool must be 0 or greater")
      .required("Prize pool is required"),
    prize_distribution: Yup.array()
      .of(
        Yup.object().shape({
          from: Yup.number().min(1, "From rank must be at least 1"),
          to: Yup.number().min(1, "To rank must be at least 1"),
          amount: Yup.number().min(0, "Amount must be 0 or greater"),
        })
      )
      .min(1, "At least one prize distribution is required"),
  });

  const isFormChanged = (values) => {
    if (!originalData) return true;
    const currentData = {
      ...values,
      contestType: contestTypeSelection,
    };
    return JSON.stringify(currentData) !== JSON.stringify(originalData);
  };

  // Expand prize distribution from range to individual ranks
  // Expand prize distribution from range to individual ranks
  const expandPrizeDistribution = (prizes) => {
    let expanded = [];
    prizes.forEach((p) => {
      if (p.from && p.amount) {
        const from = parseInt(p.from, 10);
        const to = p.to ? parseInt(p.to, 10) : from; 
        for (let r = from; r <= to; r++) {
          expanded.push({ rank: r, amount: Number(p.amount) });
        }
      }
    });
    return expanded;
  };

  // Additional validation for prize distribution
  const validatePrizeDistribution = (prizes, totalSpots, prizePool) => {
    // 🟢 Allow empty 'to' fields by filtering only on 'from' and 'amount'
    const validPrizes = prizes.filter((p) => p.from && p.amount);

    if (validPrizes.length === 0) {
      return "At least one valid prize distribution is required";
    }

    // Check for overlapping ranges
    for (let i = 0; i < validPrizes.length; i++) {
      for (let j = i + 1; j < validPrizes.length; j++) {
        const iFrom = parseInt(validPrizes[i].from, 10);
        const iTo = validPrizes[i].to ? parseInt(validPrizes[i].to, 10) : iFrom;
        const jFrom = parseInt(validPrizes[j].from, 10);
        const jTo = validPrizes[j].to ? parseInt(validPrizes[j].to, 10) : jFrom;

        if (iFrom <= jTo && jFrom <= iTo) {
          return `Prize rows have overlapping rank ranges`;
        }
      }
    }

    // Check for continuous ranks
    const sortedPrizes = [...validPrizes].sort(
      (a, b) => parseInt(a.from, 10) - parseInt(b.from, 10)
    );

    for (let i = 0; i < sortedPrizes.length - 1; i++) {
      const currentTo = sortedPrizes[i].to
        ? parseInt(sortedPrizes[i].to, 10)
        : parseInt(sortedPrizes[i].from, 10);
      const nextFrom = parseInt(sortedPrizes[i + 1].from, 10);
      if (nextFrom !== currentTo + 1) {
        return `Ranks must be continuous — gap found between rank ${currentTo} and ${nextFrom}`;
      }
    }

    // Validate each prize row
    let totalPrizeAmount = 0;
    const ranksSet = new Set();

    for (let idx = 0; idx < validPrizes.length; idx++) {
      const p = validPrizes[idx];
      const from = parseInt(p.from, 10);
      const to = p.to ? parseInt(p.to, 10) : parseInt(p.from, 10);
      const amount = parseFloat(p.amount);

      if (Number.isNaN(from) || Number.isNaN(to) || Number.isNaN(amount)) {
        return `Row ${idx + 1}: All fields must be valid numbers`;
      }

      if (from <= 0) return `Row ${idx + 1}: From rank must be greater than 0`;
      if (to < from) return `Row ${idx + 1}: To rank must be >= From rank`;
      if (to > totalSpots)
        return `Row ${idx + 1}: To rank cannot exceed total spots`;
      if (amount <= 0) return `Row ${idx + 1}: Amount must be greater than 0`;

      // ✅ Multiply by rank count
      totalPrizeAmount += amount * (to - from + 1);

      for (let rank = from; rank <= to; rank++) {
        ranksSet.add(rank);
      }
    }

    // ✅ Validate total prize vs pool
    const diff = Math.abs(totalPrizeAmount - Number(prizePool));
    if (diff > 0.01) {
      return `Total prize distribution (${totalPrizeAmount.toFixed(
        2
      )}) must match prize pool (${prizePool})`;
    }

    return null;
  };

  const handleSubmit = async (values) => {
    if (contestData && !isFormChanged(values)) {
      toast("No changes made", { icon: "ℹ️" });
      return;
    }

    // Additional prize distribution validation
    const prizeError = validatePrizeDistribution(
      values.prize_distribution,
      values.total_spots,
      values.prize_pool
    );

    if (prizeError) {
      toast.error(prizeError);
      return;
    }

    const confirm = await Swal.fire({
      title: contestData ? "Update Contest?" : "Add Contest?",
      text: "Do you want to save this contest?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Save",
      cancelButtonText: "Cancel",
      buttonsStyling: false,
      customClass: {
        popup: "custom-swal-popup",
        title: "custom-swal-title",
        htmlContainer: "custom-swal-text",
        confirmButton: "custom-swal-confirm",
        cancelButton: "custom-swal-cancel",

      },
    });

    if (!confirm.isConfirmed) return;

    try {
      const validPrizes = values.prize_distribution.filter(
        (p) => p.from && p.amount
      );

      const cleanPrizeDistribution = expandPrizeDistribution(validPrizes);

      const payload = {
        add_by,
        name: values.name.trim(),
        description: values.description,
        entry_fee: Number(values.entry_fee),
        total_spots: Number(values.total_spots),
        prize_pool: Number(values.prize_pool),
        contest_type: "Mega", // Static value
        max_entry_per_user: 1,
        is_guaranteed: contestTypeSelection === "guaranteed",
        is_private: contestTypeSelection === "private",
        contest_code:
          contestTypeSelection === "private" ? generateContestCode() : "",
        status: "upcoming",
        prize_distribution: cleanPrizeDistribution,
      };

      if (tournamentId) {
        payload.tournament_id = tournamentId;
      }

      if (contestData) {
        payload.id = contestData._id;
      }

      setLoading(true);
      const res = contestData
        ? await UpdateContest(token, payload)
        : await AddContest(token, payload);

      if (res?.status) {
        toast.success(res?.message || "Contest saved successfully");
        navigate("/superadmin/contest");
      } else {
        toast.error(res?.message || "Failed to save contest");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const contestFields = [
    {
      name: "name",
      label: "Contest Name",
      type: "text",
      required: true,
      colClass: "col-span-4",
    },
    {
      name: "description",
      label: "Description",
      type: "ckeditor",
      colClass: "col-span-4",
      required: true,
    },
    {
      name: "entry_fee",
      label: "Entry Fee",
      type: "number",
      required: true,
      min: 0,
      colClass: "col-span-2",
    },
    {
      name: "total_spots",
      label: "Total Spots",
      type: "number",
      required: true,
      min: 1,
      colClass: "col-span-2",
    },
    {
      name: "prize_pool",
      label: "Prize Pool",
      type: "number",
      required: true,
      min: 0,
      colClass: "col-span-4",
    },
    {
      name: "prize_distribution",
      label: "Prize Distribution",
      type: "prizeDistribution",
      required: true,
      colClass: "col-span-4",
    },
    {
      name: "contest_type_selector",
      label: "Contest Type",
      type: "custom",
      colClass: "col-span-4",
      required: true,
      render: () => (
        <div className="space-y-2">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="contestTypeRadio"
                value="guaranteed"
                checked={contestTypeSelection === "guaranteed"}
                onChange={(e) => setContestTypeSelection(e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span>Guaranteed Contest</span>
            </label>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="contestTypeRadio"
                value="private"
                checked={contestTypeSelection === "private"}
                onChange={(e) => setContestTypeSelection(e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span>Flexible  Contest</span>
            </label>
          </div>
          {contestTypeSelection === "private" && (
            <p className="text-xs text-gray-500 mt-2">
              Contest code will be auto-generated for private contests
            </p>
          )}
        </div>
      ),
    },
  ];

  return (
    <Content
      Page_title={contestData ? "Edit Contest" : "Add Contest"}
      button_status={true}
      button_title="Back"
      route="/superadmin/contest"
    >
      <div className="bg-white p-6 rounded-xl shadow-md">
        <ReusableForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          fields={contestFields}
          SubmitBtn={contestData ? "Update Contest" : "Save Contest"}
          enableReinitialize={true}
          loading={loading}
        />
      </div>
    </Content>
  );
}
