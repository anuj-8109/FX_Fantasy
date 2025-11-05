"use strict";

const db = require("../Models");
const Tournament_Model = db.Tournament;
const Clients_Modal = db.Clients;
const Contest_Model = db.Contest;
const Contestjoin_Modal = db.Contestjoin;

class TournamentController {

    // Add new tournament
    async AddTournament(req, res) {
        try {
            const {
                name,
                description,
                startdate,
                enddate,
                useamount,
                stocks,
                add_by,
                status
            } = req.body;

            // Basic validations
            if (!name) return res.status(400).json({ status: false, message: "name is required" });
            if (!startdate || !enddate) return res.status(400).json({ status: false, message: "startdate and enddate are required" });

            const tournament = new Tournament_Model({
                name,
                description,
                startdate,
                enddate,
                useamount,
                stocks,
                add_by,
                status
            });

            await tournament.save();

            return res.status(200).json({
                status: true,
                message: "Tournament added successfully",
                data: tournament
            });

        } catch (error) {
            return res.status(500).json({ status: false, message: "Server error", error: error.message });
        }
    }

    // Get all tournaments with pagination and search
    async getTournaments(req, res) {
        try {
            const { status, search, page = 1 } = req.query;

            const limit = 10;
            const skip = (parseInt(page) - 1) * parseInt(limit);

            const matchConditions = { del: false };

            if (status && status.trim() !== "") {
                matchConditions.status = status;
            }

            if (search && search.trim() !== "") {
                matchConditions.$or = [
                    { name: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } }
                ];
            }

            const [tournaments, totalCount] = await Promise.all([
                Tournament_Model.find(matchConditions)
                    .sort({ created_at: -1 })
                    .skip(skip)
                    .limit(limit),
                Tournament_Model.countDocuments(matchConditions)
            ]);

            return res.status(200).json({
                status: true,
                message: "Tournaments retrieved successfully",
                data: tournaments,
                pagination: {
                    total: totalCount,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(totalCount / limit)
                }
            });

        } catch (error) {
            return res.status(500).json({ status: false, message: "Server error", error: error.message });
        }
    }

    // Get a single tournament by ID
    async detailTournament(req, res) {
        try {
            const { id } = req.params;
            const tournament = await Tournament_Model.findById(id);

            if (!tournament) {
                return res.status(404).json({
                    status: false,
                    message: "Tournament not found"
                });
            }

            return res.status(200).json({
                status: true,
                message: "Tournament retrieved successfully",
                data: tournament
            });
        } catch (error) {
            return res.status(500).json({ status: false, message: "Server error", error: error.message });
        }
    }

    // Update tournament
    async updateTournament(req, res) {
        try {
            const { id, name, description, startdate, enddate, stocks,useamount,status } = req.body;

            if (!id) return res.status(400).json({ status: false, message: "Tournament ID is required" });

            const updateFields = {
                name,
                description,
                startdate,
                enddate,
                stocks,
                useamount,
                status
            };

            const updatedTournament = await Tournament_Model.findByIdAndUpdate(
                id,
                updateFields,
                { new: true, runValidators: true }
            );

            if (!updatedTournament) {
                return res.status(404).json({ status: false, message: "Tournament not found" });
            }

            return res.json({
                status: true,
                message: "Tournament updated successfully",
                data: updatedTournament
            });

        } catch (error) {
            return res.status(500).json({ status: false, message: "Server error", error: error.message });
        }
    }

    // Delete tournament
    async deleteTournament(req, res) {
        try {
            const { id } = req.params;

            const deletedTournament = await Tournament_Model.findByIdAndUpdate(
                id,
                { del: true },
                { new: true }
            );

            if (!deletedTournament) {
                return res.status(404).json({
                    status: false,
                    message: "Tournament not found"
                });
            }


                const totalRefunded = await processTournamentRefund(id);

            return res.status(200).json({
                status: true,
                message: "Tournament deleted successfully"
            });
        } catch (error) {
            return res.status(500).json({ status: false, message: "Server error", error: error.message });
        }
    }

    // Change tournament status
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


  const tournament = await Tournament_Model.findById(id);
    if (!tournament) {
      return res.status(404).json({ status: false, message: "Tournament not found" });
    }

    if (status === "cancelled") {
      const totalRefunded = await processTournamentRefund(id);
      return res.status(200).json({
        status: true,
        message: `Tournament cancelled successfully. ${totalRefunded} refunds processed.`,
      });
    }
            const result = await Tournament_Model.findByIdAndUpdate(
                id,
                { status: status },
                { new: true }
            );

            if (!result) {
                return res.status(404).json({
                    status: false,
                    message: "Tournament not found"
                });
            }

            return res.json({
                status: true,
                message: "Status updated successfully",
                data: result
            });

        } catch (error) {
            return res.status(500).json({ status: false, message: "Server error", error: error.message });
        }
    }

    // Change tournament active/inactive
    async statusChangeActive(req, res) {
        try {
            const { id, status } = req.body;

            if (typeof status !== "boolean") {
                return res.status(400).json({
                    status: false,
                    message: "Invalid status value"
                });
            }

               const tournament = await Tournament_Model.findById(id);
    if (!tournament) {
      return res.status(404).json({ status: false, message: "Tournament not found" });
    }

    // ❗ If tournament made inactive => refund everyone (before live)
    let totalRefunded = 0;
    if (status === false) {
    //  totalRefunded = await processTournamentRefund(id);
    }


            const result = await Tournament_Model.findByIdAndUpdate(
                id,
                { activestatus: status },
                { new: true }
            );

            if (!result) {
                return res.status(404).json({
                    status: false,
                    message: "Tournament not found"
                });
            }

            return res.json({
                status: true,
                message: "Active status updated successfully",
                data: result
            });

        } catch (error) {
            return res.status(500).json({ status: false, message: "Server error", error: error.message });
        }
    }

    
}



// ✅ Refund Helper Function
async function processTournamentRefund(tournamentId) {
  const contests = await Contest_Model.find({ tournament_id: tournamentId, del: false });
  let totalRefunded = 0;

  for (const contest of contests) {
    const joinedUsers = await Contestjoin_Modal.find({ contest_id: contest._id, refunded: { $ne: true } });

    for (const join of joinedUsers) {
      const client = await Clients_Modal.findOne({ _id: join.client_id, del: 0 });
      if (!client) continue;

      // Refund both wallet and refer wallet
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
   // contest.del = true;
    contest.status = "cancelled";
    await contest.save();
  }

  // Finally, cancel the tournament itself
  await Tournament_Model.updateOne(
    { _id: tournamentId },
    { $set: {  status: "cancelled" } }
  );

  return totalRefunded;
}

module.exports = new TournamentController();
