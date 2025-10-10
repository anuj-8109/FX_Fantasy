const db = require("../Models");
const axios = require('axios');
var dateTime = require('node-datetime');
const mongoose = require("mongoose");

const Tournament_Model = db.Tournament;
const Contestjoin_Modal = db.Contestjoin;
const Contesttrade_Modal = db.Contesttrade;
const Contest_Model = db.Contest;

const Stock_Modal = db.Stock;
const returnstockcloseprice = require("../api/Controllers/List");

async function AddBulkStockCron(req, res) {
    try {
      const config = {
          method: 'get',
          url: 'https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json',
      };
  
      const response = await axios(config);


      if (response.data.length > 0) {
  
  
          const filteredDataO = response.data.filter(element =>
              (element.instrumenttype === 'OPTIDX' || element.instrumenttype === 'OPTSTK') &&
              element.exch_seg === "NFO" && element.name != ""
          );
      
          const filteredDataF = response.data.filter(element =>
              (element.instrumenttype === 'FUTSTK' || element.instrumenttype === 'FUTIDX') &&
              element.exch_seg === "NFO" && element.name != ""
          );
  
       
          const filteredDataC = response.data.filter(element =>
              (element.symbol.slice(-3) === '-EQ' || element.symbol.slice(-3) === '-BE') && element.name != ""
          );
  
        
          const userDataSegment_O = await createUserDataArray(filteredDataO, "O");
          await insertData(userDataSegment_O);
       
          const userDataSegment_F = await createUserDataArray(filteredDataF, "F");
          await insertData(userDataSegment_F);
         
          const userDataSegment_C = await createUserDataArray(filteredDataC, "C");
          await insertData(userDataSegment_C);
  
      
          res.json({ 
            status: true, 
        });
      } else {
        res.json({ 
            status: true, 
        });
      }
  } catch (error) {
    res.json({ 
        status: false, 
    });
  }
  }
  
const DeleteTokenAliceToken = async (req, res) => {

    const pipeline = [
        {
            $match: {
                expiry: { $type: "string", $ne: "", $regex: /^[0-9]{8}$/ } // Ensures expiry is exactly 8 digits (DDMMYYYY)
            }
        },
        {
            $addFields: {
                expiryDate: {
                    $dateFromString: {
                        dateString: {
                            $concat: [
                                { $substr: ["$expiry", 4, 4] }, // Year (YYYY)
                                "-",
                                { $substr: ["$expiry", 2, 2] }, // Month (MM)
                                "-",
                                { $substr: ["$expiry", 0, 2] } // Day (DD)
                            ]
                        },
                        format: "%Y-%m-%d",
                        onError: null, // If conversion fails, set expiryDate to null
                        onNull: null
                    }
                }
            }
        },
        {
            $match: {
                expiryDate: { $lt: new Date() } // Delete expired tokens
            }
        },
        {
            $group: {
                _id: null,
                idsToDelete: { $push: "$_id" } // Collecting all matching _id values
            }
        },
        {
            $project: {
                _id: 0,
                idsToDelete: 1
            }
        }
    ];

    const result = await Stock_Modal.aggregate(pipeline)
    if (result.length > 0) {
        const idsToDelete = result.map(item => item._id);
        await Stock_Modal.deleteMany({ _id: { $in: result[0].idsToDelete } });
        res.json({ 
            status: true, 
            message: `${result[0].idsToDelete.length} expired tokens deleted.` 
        });
    } else {
        res.json({ 
            status: true, 
            message: 'No expired tokens found.' 
        });
       }
  
  }
  
  function createUserDataArray(data, segment) {
    let count = 0
    return data.map(element => {
     
        const option_type = element.symbol.slice(-2);
        const expiry_s = dateTime.create(element.expiry);
        const expiry = expiry_s.format('dmY');
        const strike_s = parseInt(element.strike);
        const strike = parseInt(strike_s.toString().slice(0, -2));
        const day_start = element.expiry.slice(0, 2);
        const moth_str = element.expiry.slice(2, 5);
        const year_end = element.expiry.slice(-2);
        const Dat = new Date(element.expiry);
        const moth_count = Dat.getMonth() + 1;
  
        const tradesymbol_m_w = `${element.name}${year_end}${moth_count}${day_start}${strike}${option_type}`;
  
        return {
            symbol: element.name,
            expiry: segment === "C" ? null : expiry,
            expiry_date: segment === "C" ? null : expiry.slice(0, -6),
            expiry_month_year: segment === "C" ? null : expiry.slice(2),
            expiry_str: segment === "C" ? null : element.expiry,
            strike: strike,
            option_type: option_type,
            segment: segment,  // Default segment
            instrument_token: element.token,
            lotsize: element.lotsize,
            tradesymbol: element.symbol,
            tradesymbol_m_w: tradesymbol_m_w,
            exch_seg: element.exch_seg
        }; 
    });
  }
  async function insertData(dataArray) {
    try {
        const existingTokens = await Stock_Modal.distinct("instrument_token", {});
        const filteredDataArray = dataArray.filter(userData => {
            return !existingTokens.includes(userData.instrument_token);
        });
        await Stock_Modal.insertMany(filteredDataArray);
    } catch (error) {
    }
  
  }
async function TournamentStatusChange(req, res) {
  try {
    const now = new Date();
    // 1️⃣ upcoming → live
    const makeLive = await Tournament_Model.updateMany(
      {
        activestatus: true,
        del: false,
        startdate: { $lte: now },
        enddate: { $gt: now },
        status: "upcoming"
      },
      { $set: { status: "live", updated_at: now } }
    );

    // 2️⃣ live → completed
    const makeCompleted = await Tournament_Model.updateMany(
      {
        activestatus: true,
        del: false,
        enddate: { $lte: now },
        status: "live"
      },
      { $set: { status: "completed", updated_at: now } }
    );

    return res.status(200).json({
      status: true,
      message: "✅ Tournament status updated successfully",
      time: now,
      updated: {
        madeLive: makeLive.modifiedCount || 0,
        completed: makeCompleted.modifiedCount || 0
      }
    });

  } catch (error) {
    console.error("TournamentStatusChange Error:", error);
    return res.status(500).json({
      status: false,
      message: "❌ Internal Server Error",
      error: error.message
    });
  }
}

async function getLivePrice(symbol) {
  try {
      
        const csvFilePath = "https://docs.google.com/spreadsheets/d/1wwSMDmZuxrDXJsmxSIELk1O01F0x1-0LEpY03iY1tWU/export?format=csv";
        const { data } = await axios.get(csvFilePath);
        
        // Return a promise that resolves with the CPrice after parsing
        return new Promise((resolve, reject) => {
            Papa.parse(data, {
                header: true,
                complete: (result) => {
                    let sheetData = result.data;

                    // Map symbol names as needed
                    sheetData.forEach(item => {
                        switch (item.SYMBOL) {
                            case "NIFTY_BANK":
                                item.SYMBOL = "BANKNIFTY";
                                break;
                            case "NIFTY_50":
                                item.SYMBOL = "NIFTY";
                                break;
                            case "NIFTY_FIN_SERVICE":
                                item.SYMBOL = "FINNIFTY";
                                break;
                        }
                    });

                    // Find the requested symbol and return its CPrice
                   // const stockData = sheetData.find(item => item.SYMBOL === symbol);

                      const stockData = sheetData.find(item => 
                        item.SYMBOL === symbol.trim() || 
                        item.SYMBOL === `NSE:${symbol.trim()}`
                    );

                    // console.log("Searching for Symbol:", symbol.trim());
                    // console.log("Matched Stock Data:", stockData);

                    if (stockData && stockData.CPrice && stockData.CPrice !== "#N/A") {
                        resolve(stockData.CPrice);
                    } else {
                        reject(new Error("CPrice unavailable or symbol not found."));
                    }
                },
                error: (error) => {
                    reject(error);
                }
            });
        });
    } catch (error) {
       
       return;
    }
  }
async function updateContestRanks(req, res) {
  try {
    // 1️⃣ Get all live tournaments
    const tournaments = await Tournament_Model.find({
      status: "live",
      activestatus: true,
      del: false
    });

    for (const tournament of tournaments) {
      // 2️⃣ Get contests under each tournament
      const contests = await Contest_Model.find({
        tournament_id: tournament._id,
        activestatus: true,
        del: false
      });

      for (const contest of contests) {
        // 3️⃣ Get all joined users
        const joins = await Contestjoin_Modal.find({ contest_id: contest._id });

        for (const join of joins) {
          let totalPoints = 0;

          // 4️⃣ Get all trades of this user in this contest
          const trades = await Contesttrade_Modal.find({
            contest_id: contest._id,
            client_id: join.client_id
          });

          // Group trades by stock
          const stockGroups = {};
          for (const trade of trades) {
            if (!stockGroups[trade.stock_symbol]) {
              stockGroups[trade.stock_symbol] = {
                buyQty: 0,
                buyValue: 0,
                sellQty: 0,
                realizedPL: 0
              };
            }

            if (trade.trade_type.toUpperCase() === "BUY") {
              stockGroups[trade.stock_symbol].buyQty += trade.quantity;
              stockGroups[trade.stock_symbol].buyValue += trade.price * trade.quantity;
            } else if (trade.trade_type.toUpperCase() === "SELL") {
              // Calculate realized P&L directly on sell
              const avgBuyPrice =
                stockGroups[trade.stock_symbol].buyValue /
                  stockGroups[trade.stock_symbol].buyQty || 0;

              const pl = (trade.price - avgBuyPrice) * trade.quantity;

              stockGroups[trade.stock_symbol].sellQty += trade.quantity;
              stockGroups[trade.stock_symbol].realizedPL += pl;

              stockGroups[trade.stock_symbol].buyQty -= trade.quantity;
              stockGroups[trade.stock_symbol].buyValue -= avgBuyPrice * trade.quantity;
            }
          }

          // 5️⃣ Calculate total points
          for (const symbol of Object.keys(stockGroups)) {
            const { buyQty, buyValue, realizedPL } = stockGroups[symbol];

            // Add realized P&L
            totalPoints += realizedPL;

            // If open position left → calculate unrealized P&L
            if (buyQty > 0) {
              const avgBuyPrice = buyValue / buyQty;
              const livePrice = await getLivePrice(symbol); // 🔥 API से live price
              if (livePrice) {
                const unrealizedPL = (livePrice - avgBuyPrice) * buyQty;
                totalPoints += unrealizedPL;
              }
            }
          }

          // Save user points
          join.points = totalPoints;
          await join.save();
        }

        // 6️⃣ Update ranking inside contest
        const allParticipants = await Contestjoin_Modal.find({
          contest_id: contest._id
        }).sort({ points: -1 });

        for (let i = 0; i < allParticipants.length; i++) {
          allParticipants[i].rank = i + 1;
          await allParticipants[i].save();
        }
      }
    }

    return res.status(200).json({
      status: true,
      message: "✅ Contest rankings updated successfully"
    });
  } catch (error) {

    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
}

async function closeOpenPositionsForEndedTournaments(req, res) {
  try {
    const now = new Date();

    // 1️⃣ Find tournaments that ended but not yet processed
    const endedTournaments = await Tournament_Model.find({
      enddate: { $lte: now },
      closed_positions: { $ne: true } 
    });

    for (const tour of endedTournaments) {
      const contest_id = tour._id;

      // 2️⃣ Get all participants
      const participants = await Contestjoin_Modal.find({ contest_id });

      for (const join of participants) {
        const client_id = join.client_id;

        // 3️⃣ Aggregate open positions per stock
        const positions = await Contesttrade_Modal.aggregate([
          { $match: { contest_id, client_id } },
          {
            $group: {
              _id: "$stock_symbol",
              buyQty: { $sum: { $cond: [{ $eq: ["$trade_type", "buy"] }, "$quantity", 0] } },
              buyValue: { $sum: { $cond: [{ $eq: ["$trade_type", "buy"] }, { $multiply: ["$quantity", "$price"] }, 0] } },
              sellQty: { $sum: { $cond: [{ $eq: ["$trade_type", "sell"] }, "$quantity", 0] } },
              sellValue: { $sum: { $cond: [{ $eq: ["$trade_type", "sell"] }, { $multiply: ["$quantity", "$price"] }, 0] } }
            }
          },
          {
            $project: {
              stock_symbol: "$_id",
              netQty: { $subtract: ["$buyQty", "$sellQty"] },
              longAvg: { $cond: [{ $gt: ["$buyQty", 0] }, { $divide: ["$buyValue", "$buyQty"] }, null] },
              shortAvg: { $cond: [{ $gt: ["$sellQty", 0] }, { $divide: ["$sellValue", "$sellQty"] }, null] }
            }
          },
          { $match: { netQty: { $ne: 0 } } } // only open positions
        ]);

        let wallet = Number(join.wallet_balance || 0);
        let locked = Number(join.locked_balance || 0);

        for (const pos of positions) {
          const { stock_symbol, netQty, longAvg, shortAvg } = pos;
          const currentPrice = await returnstockcloseprice(stock_symbol);

          const tradesToInsert = [];
          let realizedPnL = 0;

          if (netQty > 0) {
            // Close long positions
            const pnlClose = (currentPrice - longAvg) * netQty;
            realizedPnL += pnlClose;

            const release = longAvg * netQty;
            locked -= release;
            wallet += release;

            tradesToInsert.push({
              contest_id,
              client_id,
              stock_symbol,
              trade_type: "sell",
              quantity: netQty,
              price: currentPrice,
              position_type: "CLOSE",
              realizedPnL
            });
          } else if (netQty < 0) {
            // Close short positions
            const qtyAbs = Math.abs(netQty);
            const pnlClose = (shortAvg - currentPrice) * qtyAbs;
            realizedPnL += pnlClose;

            const release = shortAvg * qtyAbs;
            locked -= release;
            wallet += release;

            tradesToInsert.push({
              contest_id,
              client_id,
              stock_symbol,
              trade_type: "buy",
              quantity: qtyAbs,
              price: currentPrice,
              position_type: "CLOSE",
              realizedPnL
            });
          }

          // Apply realized P&L
          wallet += realizedPnL;

          // Save closing trades
          if (tradesToInsert.length > 0) {
            await Contesttrade_Modal.insertMany(tradesToInsert);
          }
        }

        // Update participant wallet and locked balance
        join.wallet_balance = wallet;
        join.locked_balance = locked;
        await join.save();
      }

      // Mark tournament as processed
      tour.closed_positions = true;
      await tour.save({ validateBeforeSave: false }); // Skip validation for required fields
    }

    console.log("✅ All open positions for ended tournaments closed successfully.");
     return res.status(200).json({ status: true, message: "Positions closed successfully" });

  } catch (err) {
    console.error("❌ Error closing positions for ended tournaments:", err);
     return res.status(500).json({ status: false, message: "Server error", error: err.message });
  }
}




  module.exports = { AddBulkStockCron,DeleteTokenAliceToken,TournamentStatusChange,updateContestRanks, closeOpenPositionsForEndedTournaments };
