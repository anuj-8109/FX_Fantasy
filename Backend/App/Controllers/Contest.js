"use strict";

const db = require("../Models");
const Contest_Model = db.Contest;
const Stock_Modal = db.Stock;

class ContestController {

    // Add new contest
    async AddContest(req, res) {
        try {
            const {
                name,
                description,
                contest_type,
                entry_fee,
                useamount,
                total_spots,
                max_entry_per_user,
                prize_pool,
                prize_distribution,
                stocks,
                is_guaranteed,
                is_private,
                contest_code,
                startdate,
                enddate,
                add_by
            } = req.body;

            // Basic validations
            if (!name) return res.status(400).json({ status: false, message: "name is required" });
            if (!contest_type) return res.status(400).json({ status: false, message: "contest_type is required" });
            if (!entry_fee && entry_fee !== 0) return res.status(400).json({ status: false, message: "entry_fee is required" });
            if (!total_spots) return res.status(400).json({ status: false, message: "total_spots is required" });
            if (!prize_pool && prize_pool !== 0) return res.status(400).json({ status: false, message: "prize_pool is required" });
            if (!startdate || !enddate) return res.status(400).json({ status: false, message: "startdate and enddate are required" });

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
                useamount,
                total_spots,
                max_entry_per_user,
                prize_pool,
                prize_distribution: prizeDist,
                stocks,
                is_guaranteed,
                is_private,
                contest_code,
                startdate,
                enddate,
                add_by
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
                useamount,
                total_spots,
                max_entry_per_user,
                prize_pool,
                prize_distribution,
                stocks,
                is_guaranteed,
                is_private,
                contest_code,
                startdate,
                enddate
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
                useamount,
                total_spots,
                max_entry_per_user,
                prize_pool,
                prize_distribution: prizeDist,
                stocks,
                is_guaranteed,
                is_private,
                contest_code,
                startdate,
                enddate
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

            const deletedContest = await Contest_Model.findByIdAndUpdate(
                id,
                { del: true },
                { new: true }
            );

            if (!deletedContest) {
                return res.status(404).json({
                    status: false,
                    message: "Contest not found"
                });
            }

            return res.status(200).json({
                status: true,
                message: "Contest deleted successfully"
            });
        } catch (error) {
            return res.status(500).json({ status: false, message: "Server error", error: error.message });
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
                    message: "Invalid status value"
                });
            }

            const result = await Contest_Model.findByIdAndUpdate(
                id,
                { status: status },
                { new: true }
            );

            if (!result) {
                return res.status(404).json({
                    status: false,
                    message: "Contest not found"
                });
            }

            return res.json({
                status: true,
                message: "Status updated successfully",
                data: result
            });

        } catch (error) {
            return res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message
            });
        }
    }


      async statusChangeActive(req, res) {
        try {
            const { id, status } = req.body;

            const validStatuses = ['true', 'false'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    status: false,
                    message: "Invalid status value"
                });
            }

            const result = await Contest_Model.findByIdAndUpdate(
                id,
                { activestatus: status },
                { new: true }
            );

            if (!result) {
                return res.status(404).json({
                    status: false,
                    message: "Contest not found"
                });
            }

            return res.json({
                status: true,
                message: "Status updated successfully",
                data: result
            });

        } catch (error) {
            return res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message
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

}

module.exports = new ContestController();
