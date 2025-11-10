const db = require("../Models");
const upload = require("../Utils/multerHelper"); // Import the multer helper
const fs = require("fs");
const path = require("path");
const BasicSetting_Modal = db.BasicSetting;

class BasicSetting {
  async AddBasicSetting(req, res) {
    try {
      // Handle the image uploads
      upload("basicsetting").fields([
        { name: "favicon", maxCount: 1 },
        { name: "logo", maxCount: 1 },
       { name: "refer_image", maxCount: 1 },
      ])(req, res, async (err) => {
        if (err) {
          return res.status(500).json({
            status: false,
            message: "File upload error",
            error: err.message,
          });
        }

        const {
          website_title,
          email_address,
          contact_number,
          address,
          encryption,
          smtp_status,
          smtp_host,
          smtp_port,
          smtp_username,
          smtp_password,
          from_name,
          refer_title,
          refer_description,
          sender_earn,
          receiver_earn,
          refer_amount_used_percent,
          digio_client_id,
          digio_client_secret,
          digio_template_name,
          kyc,
          refer_status,
          refersendmsg,

        
        } = req.body;
        const existingSetting = await BasicSetting_Modal.findOne({});



       


        const favicon = req.files["favicon"]
          ? req.files["favicon"][0].filename
          : existingSetting
            ? existingSetting.favicon
            : null;
        const logo = req.files["logo"]
          ? req.files["logo"][0].filename
          : existingSetting
            ? existingSetting.logo
            : null;
       const refer_image = req.files["refer_image"]
          ? req.files["refer_image"][0].filename
          : existingSetting
            ? existingSetting.refer_image
            : null;


        // Define the update payload
        const update = {
          favicon,
          logo,
          refer_image,
          website_title: website_title,
          email_address,
          contact_number,
          address,
          encryption,
          smtp_status,
          smtp_host,
          smtp_port,
          encryption,
          smtp_username,
          smtp_password,
          from_name,
          refer_title,
          refer_description,
          sender_earn,
          receiver_earn,
          refer_amount_used_percent,
          digio_client_id,
          digio_client_secret,
          digio_template_name,
          kyc,
          refer_status,
          refersendmsg,
         
        };

        const options = {
          new: true,
          upsert: true,
          runValidators: true,
        };

        const result = await BasicSetting_Modal.findOneAndUpdate(
          {},
          update,
          options
        );


      

        return res.status(200).json({
          status: true,
          message: "Basic setting added/updated successfully",
          data: result,
        });
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }

  // Example method to get all settings
  async getSettings(req, res) {
    try {
      const settings = await BasicSetting_Modal.find();
      

      return res.json({
        status: true,
        message: "Settings retrieved successfully",
        data: settings,

      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }



}
module.exports = new BasicSetting();
