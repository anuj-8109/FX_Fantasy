const db = require("../../Models");
const axios = require('axios');
const Papa = require('papaparse');
const BasicSetting_Modal = db.BasicSetting;
const Banner_Modal = db.Banner;
const Blogs_Modal = db.Blogs;
const News_Modal = db.News;
const Coupon_Modal = db.Coupon;
const Faq_Modal = db.Faq;
const Content_Modal = db.Content;
const Clients_Modal = db.Clients;
const Tournament_Model = db.Tournament;
const Contest_Model = db.Contest;
const Contestjoin_Modal = db.Contestjoin;
const Contesttrade_Modal = db.Contesttrade;
const States = db.States;
const City = db.City;


const mongoose = require('mongoose');

class List {

  async Bannerlist(req, res) {


    try {
      // const banners = await Banner_Modal.find({ del: false, status: true });
      const banners = await Banner_Modal.find({
        del: false,
        status: true,
        offer_status: { $ne: 1 }
      }).sort({ created_at: -1 });


      const protocol = req.protocol; // Will be 'http' or 'https'
      const baseUrl = `https://${req.headers.host}`;

      const bannerWithImageUrls = banners.map(banner => {
        return {
          ...banner._doc, // Spread the original bannerss document
          image: banner.image ? `${baseUrl}/uploads/banner/${banner.image}` : null // Append full image URL
        };
      });



      return res.status(200).json({
        status: true,
        message: "Banner retrieved successfully",
        data: bannerWithImageUrls
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message
      });
    }
  }

  async BlogslistwithPagination(req, res) {
    try {
      const { page = 1 } = req.query; // Default page is 1, and limit is 10
      let limit = 10;
      // Parse page and limit as integers
      const pageNumber = parseInt(page, 10);
      const pageSize = parseInt(limit, 10);

      // Ensure page and limit are valid
      if (pageNumber < 1 || pageSize < 1) {
        return res.status(400).json({
          status: false,
          message: "Invalid page or limit value. Both must be positive integers.",
        });
      }

      // Get total count of blogs
      const totalBlogs = await Blogs_Modal.countDocuments({ del: false, status: true });

      // Fetch paginated blogs
      const blogs = await Blogs_Modal.find({ del: false, status: true })
        .sort({ created_at: -1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize);

      const protocol = req.protocol; // 'http' or 'https'
      const baseUrl = `https://${req.headers.host}`;

      const blogsWithImageUrls = blogs.map(blog => {
        return {
          ...blog._doc, // Spread the original blog document
          image: blog.image ? `${baseUrl}/uploads/blogs/${blog.image}` : null, // Append full image URL
        };
      });

      return res.status(200).json({
        status: true,
        message: "Blogs retrieved successfully",
        data: blogsWithImageUrls,
        pagination: {
          totalBlogs,
          currentPage: pageNumber,
          totalPages: Math.ceil(totalBlogs / pageSize),
          pageSize,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }

  async NewslistwithPagination(req, res) {
    try {
      const { page = 1 } = req.query; // Default page is 1, and limit is 10
      let limit = 10;
      // Parse page and limit as integers
      const pageNumber = parseInt(page, 10);
      const pageSize = parseInt(limit, 10);

      // Ensure page and limit are valid
      if (pageNumber < 1 || pageSize < 1) {
        return res.status(400).json({
          status: false,
          message: "Invalid page or limit value. Both must be positive integers.",
        });
      }

      // Get total count of news
      const totalNews = await News_Modal.countDocuments({ del: false, status: true });

      // Fetch paginated news
      const news = await News_Modal.find({ del: false, status: true })
        .sort({ created_at: -1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize);

      const protocol = req.protocol; // 'http' or 'https'
      const baseUrl = `https://${req.headers.host}`;

      const newsWithImageUrls = news.map(newss => {
        return {
          ...newss._doc, // Spread the original news document
          image: newss.image ? `${baseUrl}/uploads/news/${newss.image}` : null, // Append full image URL
        };
      });

      return res.status(200).json({
        status: true,
        message: "News retrieved successfully",
        data: newsWithImageUrls,
        pagination: {
          totalNews,
          currentPage: pageNumber,
          totalPages: Math.ceil(totalNews / pageSize),
          pageSize,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }

  async Couponlist(req, res) {
    try {

      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);

      const result = await Coupon_Modal.find({
        del: false,
        status: true,
     //   showstatus: 1,
        startdate: { $lte: endOfToday },
        enddate: { $gte: startOfToday }
      });
      const protocol = req.protocol; // Will be 'http' or 'https'
      const baseUrl = `https://${req.headers.host}`;

      const resultWithImageUrls = result.map(results => {
        return {
          ...results._doc, // Spread the original bannerss document
          image: results.image ? `${baseUrl}/uploads/coupon/${results.image}` : null,
        };
      });

      return res.json({
        status: true,
        message: "get",
        data: resultWithImageUrls
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }

  async Faqlist(req, res) {
    try {

      const faq = await Faq_Modal.find({ del: false, status: true });


      return res.status(200).json({
        status: true,
        message: "Faq retrieved successfully",
        data: faq
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message
      });
    }
  }
  async detailContent(req, res) {
    try {
      // Extract ID from request parameters
      const { id } = req.params;

      // Check if ID is provided
      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Content ID is required"
        });
      }

      const Content = await Content_Modal.findById(id);

      if (!Content) {
        return res.status(404).json({
          status: false,
          message: "Content not found"
        });
      }

      return res.json({
        status: true,
        message: "Content details fetched successfully",
        data: Content
      });

    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error",
        data: []
      });
    }
  }


  async basicSetting(req, res) {
    try {

      const baseUrl = `https://${req.headers.host}`;

   const result = await BasicSetting_Modal.findOne().exec();

      if (result) {
        result.logo = `${baseUrl}/uploads/basicsetting/${result.logo}`;
        result.favicon = `${baseUrl}/uploads/basicsetting/${result.favicon}`;
      }

      return res.json({
        status: true,
        message: "details retrieved successfully",
        data: result
      });

    } catch (error) {
      return res.status(500).json({ status: false, message: 'Server error', data: [] });
    }
  }
async getUpcomingTournaments(req, res) {
    try {
        const { search } = req.query;

        const matchConditions = { 
            del: false,
         //   status: "upcoming" 
        };

        if (search && search.trim() !== "") {
            matchConditions.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        const tournaments = await Tournament_Model.find(matchConditions)
            .sort({ created_at: -1 });

        return res.status(200).json({
            status: true,
            message: "Upcoming tournaments retrieved successfully",
            data: tournaments
        });

    } catch (error) {
        return res.status(500).json({ 
            status: false, 
            message: "Server error", 
            error: error.message 
        });
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


async  joinContest(req, res) {
  try {
    const { contest_id, client_id, price, discount = 0 } = req.body;

    // Validate inputs
    if (!contest_id || !client_id) {
      return res.status(400).json({ status: false, message: "contest_id and client_id are required" });
    }

    // Validate contest exists
    const contest = await Contest_Model.findOne({ _id: contest_id, del: false });
    if (!contest) {
      return res.status(404).json({ status: false, message: "Contest not found" });
    }

if (contest.total_spots <= contest.filled_spots) {
      return res.status(400).json({ status: false, message: "Contest is full" });
    }


const tournament = await Tournament_Model.findOne({ _id: contest.tournament_id, del: false });
if (!tournament) {
  return res.status(404).json({ status: false, message: "Tournament not found" });
}


    // Validate client exists
    const client = await Clients_Modal.findOne({ _id: client_id, del: 0 });
    if (!client) {
      return res.status(404).json({ status: false, message: "Client not found" });
    }


    

    // Check if already joined
    const existingJoin = await Contestjoin_Modal.findOne({ contest_id, client_id });
    if (existingJoin) {
      return res.status(400).json({ status: false, message: "You have already joined this contest" });
    }

    // Calculate total price
    const total = price - discount;
    if (total < 0) {
      return res.status(400).json({ status: false, message: "Invalid discount" });
    }


   const result = await BasicSetting_Modal.findOne().exec();

// Take dynamic percent, default 0
const referPercent = result?.refer_amount_used_percent || 0; // default 0%

let referUsed = 0;

if (client.referwamount && client.referwamount > 0 && referPercent > 0) {
  // Convert percent to decimal
  const referPercentDecimal = referPercent / 100;

  // Use referPercent% of total from refer wallet, but not more than available
  referUsed = Math.min(client.referwamount, total * referPercentDecimal);
}

     const remaining = total - referUsed;


 if (client.wamount < remaining) {
      return res.status(400).json({
        status: false,
        message: "Insufficient wallet balance"
      });
    }

    // ✅ Deduct from wallets
    if (referUsed > 0) client.referwamount -= referUsed;
    client.wamount -= remaining;
    await client.save();


 contest.filled_spots += 1;
    await contest.save();
    // Save new join entry
    const joinEntry = new Contestjoin_Modal({
      contest_id,
      client_id,
      price,
      discount,
      total,
      refer_used: referUsed,
      wallet_used: remaining,
      entry_count: 1,
      wallet_balance: tournament.useamount,
      joined_at: new Date()
    });

    await joinEntry.save();

    return res.status(200).json({
      status: true,
      message: "Contest joined successfully",
      data: joinEntry
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message
    });
  }
}
/*
async  addTrade(req, res) {
  try {
    const { contest_id, client_id, stock_symbol, trade_type, quantity } = req.body;

    // Validate
    if (!contest_id || !client_id || !stock_symbol || !trade_type || !quantity) {
      return res.status(400).json({ status: false, message: "All fields are required" });
    }

   const joinData = await Contestjoin_Modal.findOne({ contest_id, client_id });
    if (!joinData) {
      return res.status(404).json({ status: false, message: "Client has not joined this contest" });
    }

     const cPrice = await returnstockcloseprice(stock_symbol);
     const price = cPrice; // live stock price
   
         const tradeAmount = price * quantity;

    // 3. Update wallet balance based on trade_type
    let updatedWalletBalance = joinData.wallet_balance;

    if (trade_type.toUpperCase() === "BUY") {
      if (updatedWalletBalance < tradeAmount) {
        return res.status(400).json({ status: false, message: "Insufficient wallet balance" });
      }
      updatedWalletBalance -= tradeAmount;
    } else if (trade_type.toUpperCase() === "SELL") {


  const contestObjId = new mongoose.Types.ObjectId(contest_id);
  const clientObjId = new mongoose.Types.ObjectId(client_id);

  const totalBuys = await Contesttrade_Modal.aggregate([
    {
      $match: {
        contest_id: contestObjId,
        client_id: clientObjId,
        stock_symbol: { $regex: new RegExp(`^${stock_symbol}$`, "i") }, // case-insensitive stock symbol
        trade_type: { $regex: /^buy$/i }
      }
    },
    { $group: { _id: null, totalQty: { $sum: "$quantity" } } }
  ]);

  const totalSells = await Contesttrade_Modal.aggregate([
    {
      $match: {
        contest_id: contestObjId,
        client_id: clientObjId,
        stock_symbol: { $regex: new RegExp(`^${stock_symbol}$`, "i") },
        trade_type: { $regex: /^sell$/i }
      }
    },
    { $group: { _id: null, totalQty: { $sum: "$quantity" } } }
  ]);


    const boughtQty = totalBuys[0]?.totalQty || 0;
    const soldQty = totalSells[0]?.totalQty || 0;
    const availableQty = boughtQty - soldQty; // Stocks currently held

  if (quantity > availableQty) {
        return res.status(400).json({
          status: false,
          message: `Cannot sell ${quantity} shares. You only hold ${availableQty} shares of ${stock_symbol}.`
        });
      }


      updatedWalletBalance += tradeAmount;
    } else {
      return res.status(400).json({ status: false, message: "Invalid trade type" });
    }



    const trade = new Contesttrade_Modal({ contest_id, client_id, stock_symbol, trade_type, quantity, price });
    await trade.save();


      joinData.wallet_balance = updatedWalletBalance;
      await joinData.save();

    return res.status(200).json({
      status: true,
      message: "Trade added successfully",
      data: trade
    });

  } catch (error) {
    return res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
}
*/
async addTrade(req, res) {
  try {
    const { contest_id, client_id, stock_symbol, trade_type, quantity } = req.body;

    // Validate input
    if (!contest_id || !client_id || !stock_symbol || !trade_type || !quantity) {
      return res.status(400).json({ status: false, message: "All fields are required" });
    }

    // Check if user joined contest
    const joinData = await Contestjoin_Modal.findOne({ contest_id, client_id });
    if (!joinData) {
      return res.status(404).json({ status: false, message: "Client has not joined this contest" });
    }

    let wallet = Number(joinData.wallet_balance || 0);
    let locked = Number(joinData.locked_balance || 0);
    const price = await returnstockcloseprice(stock_symbol);
    const qty = Number(quantity);

    const contestObjId = new mongoose.Types.ObjectId(contest_id);
    const clientObjId = new mongoose.Types.ObjectId(client_id);

    // Aggregate existing trades for this stock
    const agg = await Contesttrade_Modal.aggregate([
      {
        $match: {
          contest_id: contestObjId,
          client_id: clientObjId,
          stock_symbol: { $regex: new RegExp(`^${stock_symbol}$`, "i") }
        }
      },
      {
        $group: {
          _id: null,
          buyQty: { $sum: { $cond: [{ $eq: [{ $toUpper: "$trade_type" }, "BUY"] }, "$quantity", 0] } },
          buyValue: { $sum: { $cond: [{ $eq: [{ $toUpper: "$trade_type" }, "BUY"] }, { $multiply: ["$quantity", "$price"] }, 0] } },
          sellQty: { $sum: { $cond: [{ $eq: [{ $toUpper: "$trade_type" }, "SELL"] }, "$quantity", 0] } },
          sellValue: { $sum: { $cond: [{ $eq: [{ $toUpper: "$trade_type" }, "SELL"] }, { $multiply: ["$quantity", "$price"] }, 0] } }
        }
      }
    ]);

    const stats = agg[0] || { buyQty: 0, buyValue: 0, sellQty: 0, sellValue: 0 };
    const boughtQty = stats.buyQty || 0;
    const soldQty = stats.sellQty || 0;
    const netQty = boughtQty - soldQty; // positive => long, negative => short

    const longAvg = boughtQty > 0 ? stats.buyValue / boughtQty : null;
    const shortAvg = soldQty > 0 ? stats.sellValue / soldQty : null;
    let realizedPnL = 0;
    const tradesToInsert = [];

    // ==========================
    // BUY Trade Handling
    // ==========================
    if (trade_type.toUpperCase() === "BUY") {
      if (netQty < 0) {
        // Cover existing short
        const shortOpenQty = Math.abs(netQty);
        const closeQty = Math.min(qty, shortOpenQty);
        const pnlClose = (shortAvg - price) * closeQty;
        realizedPnL += pnlClose;

        const release = shortAvg * closeQty;
        locked -= release;
        wallet += release;

        tradesToInsert.push({
          contest_id,
          client_id,
          stock_symbol,
          trade_type: "buy",
          quantity: closeQty,
          price,
          position_type: "CLOSE",
          realizedPnL: pnlClose,
          wallet_balance_after_trade: wallet,
          locked_balance_after_trade: locked
        });

        const remainingQty = qty - closeQty;
        if (remainingQty > 0) {
          const amtRem = price * remainingQty;
          if (wallet < amtRem) {
            return res.status(400).json({ status: false, message: "Insufficient wallet to open new long after covering short" });
          }
          wallet -= amtRem;
          locked += amtRem;

          tradesToInsert.push({
            contest_id,
            client_id,
            stock_symbol,
            trade_type: "buy", // ✅ corrected (was SELL before)
            quantity: remainingQty,
            price,
            position_type: "OPEN",
            realizedPnL: 0,
            wallet_balance_after_trade: wallet,
            locked_balance_after_trade: locked
          });
        }
      } else {
        // Open new long position
        const tradeAmount = price * qty;
        if (wallet < tradeAmount) {
          return res.status(400).json({ status: false, message: "Insufficient wallet balance for BUY" });
        }
        wallet -= tradeAmount;
        locked += tradeAmount;

        tradesToInsert.push({
          contest_id,
          client_id,
          stock_symbol,
          trade_type: "buy",
          quantity: qty,
          price,
          position_type: "OPEN",
          realizedPnL: 0,
          wallet_balance_after_trade: wallet,
          locked_balance_after_trade: locked
        });
      }

    // ==========================
    // SELL Trade Handling
    // ==========================
    } else if (trade_type.toUpperCase() === "SELL") {
      if (netQty > 0) {
        // Close existing long
        const closeQty = Math.min(qty, netQty);
        const pnlClose = (price - longAvg) * closeQty;
        realizedPnL += pnlClose;

        const release = longAvg * closeQty;
        locked -= release;
        wallet += release;

        tradesToInsert.push({
          contest_id,
          client_id,
          stock_symbol,
          trade_type: "sell",
          quantity: closeQty,
          price,
          position_type: "CLOSE",
          realizedPnL: pnlClose,
          wallet_balance_after_trade: wallet,
          locked_balance_after_trade: locked
        });

        const remainingQty = qty - closeQty;
        if (remainingQty > 0) {
          const amtRem = price * remainingQty;
          if (wallet < amtRem) {
            return res.status(400).json({ status: false, message: "Insufficient wallet to open short after closing long" });
          }
          wallet -= amtRem;
          locked += amtRem;

          tradesToInsert.push({
            contest_id,
            client_id,
            stock_symbol,
            trade_type: "sell",
            quantity: remainingQty,
            price,
            position_type: "OPEN",
            realizedPnL: 0,
            wallet_balance_after_trade: wallet,
            locked_balance_after_trade: locked
          });
        }
      } else {
        // Open new short position
        const tradeAmount = price * qty;
        if (wallet < tradeAmount) {
          return res.status(400).json({ status: false, message: "Insufficient wallet balance to open short" });
        }
        wallet -= tradeAmount;
        locked += tradeAmount;

        tradesToInsert.push({
          contest_id,
          client_id,
          stock_symbol,
          trade_type: "buy",
          quantity: qty,
          price,
          position_type: "OPEN",
          realizedPnL: 0,
          wallet_balance_after_trade: wallet,
          locked_balance_after_trade: locked
        });
      }

    } else {
      return res.status(400).json({ status: false, message: "Invalid trade type" });
    }

    // Apply realized P&L
    if (realizedPnL !== 0) wallet += realizedPnL;

    // Save trades
    await Contesttrade_Modal.insertMany(tradesToInsert);

    // Update balances in joinData
    joinData.wallet_balance = wallet;
    joinData.locked_balance = locked;
    await joinData.save();

    return res.status(200).json({
      status: true,
      message: "Trade executed successfully",
      data: {
        trades: tradesToInsert,
        wallet_balance: wallet,
        locked_balance: locked,
        realizedPnL
      }
    });

  } catch (err) {
    console.error("Error in addTrade:", err);
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: err.message
    });
  }
}



// 📌 My Contests List API
async myContests(req, res) {
  try {
    const { client_id, page = 1, status, tournament_id } = req.body;

    if (!client_id) {
      return res.status(400).json({ status: false, message: "client_id is required" });
    }

    // Pagination
    const pageNum = parseInt(page) || 1;
    const  limitNum = 10;
    const skip = (pageNum - 1) * limitNum;

    // Filters
    const filter = { client_id };

    if (status) {
      // status filter = upcoming, running, completed
      const now = new Date();
      if (status === "upcoming") {
        filter["contest_id.startdate"] = { $gt: now };
      } else if (status === "live") {
        filter["contest_id.startdate"] = { $lte: now };
        filter["contest_id.enddate"] = { $gte: now };
      } else if (status === "completed") {
        filter["contest_id.enddate"] = { $lt: now };
      }
    }

    if (tournament_id) {
      filter["contest_id.tournament_id"] = tournament_id;
    }

    // Query with populate
    const contests = await Contestjoin_Modal.find({ client_id })
      .populate({
        path: "contest_id",
        model: "Contest",
        populate: {
          path: "tournament_id", // contest → tournament
          model: "Tournament",
        },
      })
      .populate("client_id") // client detail
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalCount = await Contestjoin_Modal.countDocuments({ client_id });

    return res.status(200).json({
      status: true,
      message: "My contests fetched successfully",
      page: pageNum,
      limit: limitNum,
      total: totalCount,
      data: contests,
    });

  } catch (error) {
    console.error("Error fetching my contests:", error);
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
}


async  getTradeHistory(req, res) {
  try {
    const { client_id, contest_id, page = 1 } = req.body;
const limit = 10;
    // कम से कम एक filter चाहिए
    if (!client_id && !contest_id) {
      return res.status(400).json({
        status: false,
        message: "Either client_id or contest_id is required",
      });
    }

    // Base filter बनाओ
    const filter = {};
    if (client_id) filter.client_id = client_id;
    if (contest_id) filter.contest_id = contest_id;

    // Pagination setup
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Fetch trades
    const trades = await Contesttrade_Modal.find(filter)
      .populate("contest_id", "name startdate enddate") // contest detail
      .populate("client_id", "FullName Email PhoneNo") // client detail
      .sort({ trade_time: -1 }) // latest first
      .skip(skip)
      .limit(limitNum);

    const total = await Contesttrade_Modal.countDocuments(filter);

    return res.status(200).json({
      status: true,
      message: "Trade history fetched successfully",
      page: pageNum,
      limit: limitNum,
      total,
      data: trades,
    });
  } catch (error) {
    console.error("Error fetching trade history:", error);
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
}



async getOpenPositions(req, res) {
  try {
    const { client_id, contest_id, page = 1 } = req.body;
    const limit = 10;

    if (!client_id && !contest_id) {
      return res.status(400).json({
        status: false,
        message: "Either client_id or contest_id is required",
      });
    }

    const filter = { position_type: "OPEN" };
    if (client_id) filter.client_id = client_id;
    if (contest_id) filter.contest_id = contest_id;

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const trades = await Contesttrade_Modal.find(filter)
      .populate("contest_id", "name startdate enddate")
      .populate("client_id", "FullName Email PhoneNo")
      .sort({ trade_time: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Contesttrade_Modal.countDocuments(filter);

    return res.status(200).json({
      status: true,
      message: "Trade history fetched successfully",
      page: pageNum,
      limit: limitNum,
      total,
      data: trades,
    });
  } catch (error) {
    console.error("Error fetching trade history:", error);
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
}

async getContestRanking(req, res) {
  try {
    const { contest_id, page = 1 } = req.body;
    const limit = 10;

    if (!contest_id) {
      return res.status(400).json({
        status: false,
        message: "contest_id is required",
      });
    }

    // Pagination setup
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Contest join data fetch with user details
    const participants = await Contestjoin_Modal.find({ contest_id })
      .populate("client_id", "FullName Email PhoneNo") // client details
      .populate("contest_id", "name") // contest details
      .sort({ points: -1 }) // Highest points first
      .skip(skip)
      .limit(limitNum);

    // Total joined users
    const total = await Contestjoin_Modal.countDocuments({ contest_id });

    // Ranking assign manually (1st, 2nd, ...)
    const allParticipants = await Contestjoin_Modal.find({ contest_id })
      .sort({ points: -1 })
      .select("client_id points");

    // Map userId => rank
    const rankMap = {};
    allParticipants.forEach((p, index) => {
      rankMap[p.client_id.toString()] = index + 1;
    });

    // Add rank into response
    const rankedParticipants = participants.map((p) => {
      const obj = p.toObject();
      obj.rank = rankMap[p.client_id._id.toString()];
      return obj;
    });

    return res.status(200).json({
      status: true,
      message: "Contest ranking fetched successfully",
      contest_id,
      total_users: total,
      page: pageNum,
      limit: limitNum,
      data: rankedParticipants,
    });
  } catch (error) {
    console.error("Error fetching contest ranking:", error);
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
}


  async getAllStates(req, res) {
    try {
      const states = await States.find({}).toArray(); // MongoDB native driver ka use ho raha hai
      res.status(200).json(states);
    } catch (error) {
      res.status(500).json({ error: "Something went wrong" });
    }
  }

  async getCityByStates(req, res) {
    try {
      const stateName = decodeURIComponent(req.params.stateName); // "Madhya Pradesh"

      const cities = await City.find({ state: stateName }).toArray(); // nativ
      res.status(200).json(cities);
    } catch (error) {
      res.status(500).json({ error: "Something went wrong" });
    }
  }



}


async function returnstockcloseprice(symbol) {
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



module.exports = new List();