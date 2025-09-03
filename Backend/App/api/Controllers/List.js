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
        showstatus: 1,
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
            status: "upcoming" 
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

// Get contests by tournament id + tournament data (no pagination)
async getContestsByTournamentId(req, res) {
    try {
        const { tournament_id } = req.params;  // URL param
        const { status, contest_type, search } = req.query;

        // Tournament find करो
        const tournament = await Tournament_Model.findOne({ 
            _id: tournament_id, 
            del: false 
        });

        if (!tournament) {
            return res.status(404).json({
                status: false,
                message: "Tournament not found"
            });
        }

        // Contest filter conditions
        const matchConditions = { 
            del: false, 
            tournament_id: tournament_id 
        };

        const contests = await Contest_Model.find(matchConditions)
            .sort({ created_at: -1 });

        return res.status(200).json({
            status: true,
            message: "Tournament contests retrieved successfully",
            tournament: tournament,  // full tournament data
            contests: contests
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



module.exports = new List();