const db = require("../Models");

const Clients_Modal = db.Clients;
const Tournament_Model = db.Tournament;
const Contest_Model = db.Contest




class Dashboard {
  async getCount(req, res) {
    try {
      // Count documents in the Clients_Modal collection where del is false
      const client = await Clients_Modal.countDocuments({ del: 0 });
    
      const clientactive = await Clients_Modal.countDocuments({ del: 0, ActiveStatus: 1 });
      const clientinactive = await Clients_Modal.countDocuments({ del: 0, ActiveStatus: 0 });


         const tournamentTotal = await Tournament_Model.countDocuments({ del: false });
    const tournamentUpcoming = await Tournament_Model.countDocuments({ del: false, status: "upcoming" });
    const tournamentLive = await Tournament_Model.countDocuments({ del: false, status: "live" });
    const tournamentCompleted = await Tournament_Model.countDocuments({ del: false, status: "completed" });
    const tournamentCancelled = await Tournament_Model.countDocuments({ del: false, status: "cancelled" });


       const contestTotal = await Contest_Model.countDocuments({ del: false });
      const contestActive = await Contest_Model.countDocuments({ del: false, activestatus: true });
      const contestInactive = await Contest_Model.countDocuments({ del: false, activestatus: false });
     
      return res.json({
        status: true,
        message: "Count retrieved successfully",
        data: {
          clientCountTotal: client,
          clientCountActive: clientactive,
          clientCountInactive: clientinactive,
          tournamentTotal: tournamentTotal,
          tournamentUpcoming: tournamentUpcoming,
          tournamentLive: tournamentLive,
          tournamentCompleted: tournamentCompleted,
          tournamentCancelled: tournamentCancelled,
          contestTotal: contestTotal,
          contestActive: contestActive,
          contestInactive: contestInactive,
        
        }
      });

    } catch (error) {
      console.error(error); // <-- always log error
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }
}

module.exports = new Dashboard();