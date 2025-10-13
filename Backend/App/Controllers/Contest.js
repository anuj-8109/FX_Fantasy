"use strict";

const db = require("../Models");
const Contest_Model = db.Contest;
const Stock_Modal = db.Stock;
const Contestjoin_Modal = db.Contestjoin;
const Clients_Modal = db.Clients;

class ContestController {

    // Add new contest
    async AddContest(req, res) {
        try {
            const {
                name,
                description,
                contest_type,
                entry_fee,
                total_spots,
                prize_pool,
                prize_distribution,
                is_guaranteed,
                is_private,
                contest_code,
                add_by,
                tournament_id,
            } = req.body;

            // Basic validations
            if (!name) return res.status(400).json({ status: false, message: "name is required" });
            if (!contest_type) return res.status(400).json({ status: false, message: "contest_type is required" });
            if (!entry_fee && entry_fee !== 0) return res.status(400).json({ status: false, message: "entry_fee is required" });
            if (!total_spots) return res.status(400).json({ status: false, message: "total_spots is required" });
            if (!prize_pool && prize_pool !== 0) return res.status(400).json({ status: false, message: "prize_pool is required" });

            // Convert prize_distribution from JSON string if needed
            let prizeDist = prize_distribution;
            if (typeof prize_distribution === "string") {
                try {
                    prizeDist = JSON.parse(prize_distribution);
                } catch (err) {
                    return res.status(400).json({ status: false, message: "Invalid prize_distribution JSON" });
                }
            }

            const contest = new Contest_Model({
                name,
                description,
                contest_type,
                entry_fee,
                total_spots,
                prize_pool,
                prize_distribution: prizeDist,
                is_guaranteed,
                is_private,
                contest_code,
                add_by,
                tournament_id
            });

            await contest.save();

            return res.status(200).json({
                status: true,
                message: "Contest added successfully"
            });

        } catch (error) {
            return res.status(500).json({ status: false, message: "Server error", error: error.message });
        }
    }

    // Get all contests
 async getContests(req, res) {
    try {
        const { 
            status, 
            contest_type, 
            search, 
            page = 1
        } = req.query;  // Query params use करें ताकि GET request clean रहे

        const limit = 10;  // Default limit to 10 if not provided
        // Pagination calculation
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const limitValue = parseInt(limit);

        // Base filter
        const matchConditions = { del: false };

        // Optional filters
        if (status && status.trim() !== "") {
            matchConditions.status = status;
        }

        if (contest_type && contest_type.trim() !== "") {
            matchConditions.contest_type = contest_type;
        }

        // Search by contest name, code etc.
        if (search && search.trim() !== "") {
            matchConditions.$or = [
                { name: { $regex: search, $options: "i" } },
                { contest_code: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        // Fetch data + total count for pagination
        const [contests, totalCount] = await Promise.all([
            Contest_Model.find(matchConditions)
              .populate({
            path: "tournament_id",
            select: "name" // सिर्फ tournament का नाम चाहिए
        })
                .sort({ created_at: -1 })
                .skip(skip)
                .limit(limitValue),
            Contest_Model.countDocuments(matchConditions)
        ]);

        return res.status(200).json({
            status: true,
            message: "Contests retrieved successfully",
            data: contests,
            pagination: {
                total: totalCount,
                page: parseInt(page),
                limit: limitValue,
                totalPages: Math.ceil(totalCount / limitValue)
            }
        });

    } catch (error) {
        return res.status(500).json({ 
            status: false, 
            message: "Server error", 
            error: error.message 
        });
    }
}


    // Get a single contest by ID
    async detailContest(req, res) {
        try {
            const { id } = req.params;
            const contest = await Contest_Model.findById(id);

            if (!contest) {
                return res.status(404).json({
                    status: false,
                    message: "Contest not found"
                });
            }

            return res.status(200).json({
                status: true,
                message: "Contest retrieved successfully",
                data: contest
            });
        } catch (error) {
            return res.status(500).json({ status: false, message: "Server error", error: error.message });
        }
    }

    // Update contest
    async updateContest(req, res) {
        try {
            const {
                id,
                name,
                description,
                contest_type,
                entry_fee,
                total_spots,
                prize_pool,
                prize_distribution,
                is_guaranteed,
                is_private,
                contest_code,
            } = req.body;

            if (!id) return res.status(400).json({ status: false, message: "Contest ID is required" });

            let prizeDist = prize_distribution;
            if (typeof prize_distribution === "string") {
                try {
                    prizeDist = JSON.parse(prize_distribution);
                } catch (err) {
                    return res.status(400).json({ status: false, message: "Invalid prize_distribution JSON" });
                }
            }


          
            const updateFields = {
                name,
                description,
                contest_type,
                entry_fee,
                total_spots,
                prize_pool,
                prize_distribution: prizeDist,
                is_guaranteed,
                is_private,
                contest_code,
             };

            const updatedContest = await Contest_Model.findByIdAndUpdate(
                id,
                updateFields,
                { new: true, runValidators: true }
            );

            if (!updatedContest) {
                return res.status(404).json({ status: false, message: "Contest not found" });
            }

            return res.json({
                status: true,
                message: "Contest updated successfully",
                data: updatedContest
            });

        } catch (error) {
            return res.status(500).json({ status: false, message: "Server error", error: error.message });
        }
    }

    // Delete contest
   async deleteContest(req, res) {
  try {
    const { id } = req.params;

    // 🧾 Find contest first
    const contest = await Contest_Model.findOne({ _id: id, del: false });
    if (!contest) {
      return res.status(404).json({
        status: false,
        message: "Contest not found",
      });
    }

    // ⚙️ Refund before deleting
    const totalRefunded = await processContestRefund(id);

    // 🔥 After refund, mark contest deleted
    contest.del = true;
    contest.status = "cancelled";
    await contest.save();

    return res.status(200).json({
      status: true,
      message: `Contest deleted successfully. ${totalRefunded} refunds processed.`,
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
}
    // Change contest status
   async statusChange(req, res) {
  try {
    const { id, status } = req.body;

    const validStatuses = ['upcoming', 'live', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: false,
        message: "Invalid status value",
      });
    }

    const contest = await Contest_Model.findById(id);
    if (!contest) {
      return res.status(404).json({
        status: false,
        message: "Contest not found",
      });
    }

    // 🚫 If contest cancelled → refund users
    if (status === "cancelled") {
      const totalRefunded = await processContestRefund(id);
      return res.status(200).json({
        status: true,
        message: `Contest cancelled successfully. ${totalRefunded} refunds processed.`,
      });
    }

    // ✅ Normal update
    const result = await Contest_Model.findByIdAndUpdate(id, { status }, { new: true });

    return res.json({
      status: true,
      message: "Status updated successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
}


async statusChangeActive(req, res) {
  try {
    const { id, status } = req.body;

    // Convert string to boolean if needed
    const isActive = status === true || status === "true";

    const contest = await Contest_Model.findById(id);
    if (!contest) {
      return res.status(404).json({
        status: false,
        message: "Contest not found",
      });
    }

    let totalRefunded = 0;

    // 🔕 If contest is being deactivated, refund users
    if (!isActive) {
      totalRefunded = await processContestRefund(id);
    }

    const result = await Contest_Model.findByIdAndUpdate(
      id,
      { activestatus: isActive },
      { new: true }
    );

    return res.json({
      status: true,
      message: isActive
        ? "Contest activated successfully"
        : `Contest deactivated successfully. ${totalRefunded} refunds processed.`,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
}

    
  async getStock(req, res) {
    try {

      const result = await Stock_Modal.find({ segment: "C" });

      return res.json({
        status: true,
        message: "get",
        data: result
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }
  
async getContestsByTournamentId(req, res) {
    try {
        const { tournament_id } = req.params;

        const contests = await Contest_Model.find({ 
            del: false, 
            tournament_id: tournament_id 
        })
        .populate("tournament_id")  // tournament का पूरा object ले आएगा
        .sort({ created_at: -1 });

        if (!contests || contests.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No contests found for this tournament"
            });
        }

        return res.status(200).json({
            status: true,
            message: "Tournament contests retrieved successfully",
            contests: contests  // हर contest में tournament_id field पूरा object होगा
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Server error",
            error: error.message
        });
    }
}

}

// 🧩 Helper for contest refund
async function processContestRefund(contestId) {
  const contest = await Contest_Model.findOne({ _id: contestId, del: false });
  if (!contest) return 0;

  const joinedUsers = await Contestjoin_Modal.find({
    contest_id: contestId,
    refunded: { $ne: true }
  });

  let totalRefunded = 0;

  for (const join of joinedUsers) {
    const client = await Clients_Modal.findOne({ _id: join.client_id, del: 0 });
    if (!client) continue;

    // Refund both wallet & refer wallet
    if (join.wallet_used > 0) client.wamount += join.wallet_used;
    if (join.refer_used > 0) client.referwamount += join.refer_used;
    await client.save();

    // Mark join as refunded
    join.refunded = true;
    join.refund_date = new Date();
    await join.save();

    totalRefunded++;
  }

  // Mark contest as cancelled/deleted
  contest.del = true;
  contest.status = "cancelled";
  await contest.save();

  return totalRefunded;
}


module.exports = new ContestController();
