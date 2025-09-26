const db = require("../../Models");

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


mongoose = require('mongoose');

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


 if (client.wamount < total) {
      return res.status(400).json({
        status: false,
        message: "Insufficient wallet balance"
      });
    }

    // ✅ Deduct from wallet
    client.wamount -= total;
    await client.save();



    // Save new join entry
    const joinEntry = new Contestjoin_Modal({
      contest_id,
      client_id,
      price,
      discount,
      total,
      entry_count: 1,
      wallet_balance: contest.useamount,
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


     const price = 100; // live stock price
   
         const tradeAmount = price * quantity;

    // 3. Update wallet balance based on trade_type
    let updatedWalletBalance = joinData.wallet_balance;

    if (trade_type.toUpperCase() === "BUY") {
      if (updatedWalletBalance < tradeAmount) {
        return res.status(400).json({ status: false, message: "Insufficient wallet balance" });
      }
      updatedWalletBalance -= tradeAmount;
    } else if (trade_type.toUpperCase() === "SELL") {
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



module.exports = new List();