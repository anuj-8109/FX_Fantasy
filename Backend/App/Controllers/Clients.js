const db = require("../Models");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { sendEmail } = require('../Utils/emailService');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const Clients_Modal = db.Clients;
const Mailtemplate_Modal = db.Mailtemplate;
const BasicSetting_Modal = db.BasicSetting;
const Payout_Modal = db.Payout;
const Bank_Modal = db.Bank;


class Clients {


  async AddClient(req, res) {

    try {

      const { FullName, Email, PhoneNo, dob, add_by, state, city } = req.body;
      if (!FullName) {
        return res.status(400).json({ status: false, message: "fullname is required" });
      }

      if (!Email) {
        return res.status(400).json({ status: false, message: "email is required" });
      } else if (!/^\S+@\S+\.\S+$/.test(Email)) {
        return res.status(400).json({ status: false, message: "Invalid email format" });
      }

      if (!PhoneNo) {
        return res.status(400).json({ status: false, message: "phone number is required" });
      } else if (!/^\d{10}$/.test(PhoneNo)) {
        return res.status(400).json({ status: false, message: "Invalid phone number format" });
      }
     
      if (!add_by) {
        return res.status(400).json({ status: false, message: "Added by field is required" });
      }

      if (!state) {
        return res.status(400).json({ status: false, message: "Please select state" });
      }

      if (!city) {
        return res.status(400).json({ status: false, message: "Please select city" });
      }




      const existingUser = await Clients_Modal.findOne({
        $and: [
          { del: "0" },
          {
            $or: [{ Email }, { PhoneNo }]
          }
        ]
      });

      if (existingUser) {
        if (existingUser.Email === Email) {
          return res.status(400).json({ status: false, message: "Email already exists" });
        } else if (existingUser.PhoneNo === PhoneNo) {
          return res.status(400).json({ status: false, message: "Phone number already exists" });
        }
      }



      let cleanedName = FullName.replace(/\s+/g, '');
      let referCode = cleanedName.substring(0, 7).toUpperCase();




      const characters = '0123456789';
      let refer_token = '';
      const length = 5; // Length of the token
      while (refer_token.length < length) {
        const byte = crypto.randomBytes(1);
        const index = byte[0] % characters.length;
        refer_token += characters[index];
      }
      let refer_tokenss = referCode + refer_token;




      const result = new Clients_Modal({
        FullName: FullName,
        Email: Email,
        PhoneNo: PhoneNo,
        add_by: add_by,
        refer_token: refer_tokenss,
        state: state,
        city: city,
        dob: dob,
        ActiveStatus: 1,
      })

      await result.save();



      const settings = await BasicSetting_Modal.findOne();
      if (!settings || !settings.smtp_status) {
        throw new Error('SMTP settings are not configured or are disabled');
      }
   

      const mailtemplate = await Mailtemplate_Modal.findOne({ mail_type: 'welcome_mail' }); // Use findOne if you expect a single document
      if (!mailtemplate || !mailtemplate.mail_body) {
        throw new Error('Mail template not found');
      }

      const templatePath = path.join(__dirname, '../../template', 'mailtemplate.html');

      fs.readFile(templatePath, 'utf8', async (err, htmlTemplate) => {
        if (err) {
          return;
        }

        let finalMailBody = mailtemplate.mail_body
          .replace('{username}', `${PhoneNo}/${Email}`)
          .replace('{password}', "Insert it wherever you need to send the OTP message.")
          .replace(/{company_name}/g, settings.website_title);

        const logo = `${req.protocol}://${req.headers.host}/uploads/basicsetting/${settings.logo}`;

        // Replace placeholders with actual values
        const finalHtml = htmlTemplate
          .replace(/{{company_name}}/g, settings.website_title)
          .replace(/{{body}}/g, finalMailBody)
          .replace(/{{logo}}/g, logo);

        const mailOptions = {
          to: result.Email,
          from: `${settings.from_name} <${settings.from_mail}>`, // Include business name
          subject: `${mailtemplate.mail_subject}`,
          html: finalHtml // Use the HTML template with dynamic variables
        };

        // Send email
        await sendEmail(mailOptions);
      });

      return res.json({
        status: true,
        message: "Client Added Successfully",
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }




  async getClientWithFilter(req, res) {
    try {
    const { status = "", kyc_verification = "",  search = "", add_by = "", page = 1 } = req.body;
    const limit = 10;
    const skip = (parseInt(page) - 1) * limit;

    // Base condition
    const matchConditions = { del: 0 };

    // KYC verification filter
    if (kyc_verification !== "") {
      matchConditions.kyc_verification = parseInt(kyc_verification);
    }
    // Active/Inactive status filter
    if (status !== "") {
      matchConditions.ActiveStatus = parseInt(status);
    }

    if (add_by !== "") {
      matchConditions.add_by = add_by;
    }

    if (search && search.trim() !== "") {
      matchConditions.$or = [
        { FullName: { $regex: search, $options: "i" } },
        { Email: { $regex: search, $options: "i" } },
        { PhoneNo: { $regex: search, $options: "i" } },
      ];
    }
    // Fetch total count for pagination
    const totalCount = await Clients_Modal.countDocuments(matchConditions);

    // Fetch paginated data
    const clients = await Clients_Modal.find(matchConditions)
      .sort({ createdAt: -1 }) // Latest first
      .skip(skip)
      .limit(limit);

    return res.json({
      status: true,
      message: "Client data fetched successfully",
      data: clients,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalRecords: totalCount,
      },
    });
  } catch (error) {
    return res.json({ status: false, message: "Server error", data: [] });
  }
  }



  async getDeleteClientWithFilter(req, res) {
   try {
    const { status = "", kyc_verification = "", search = "", add_by = "", page = 1 } = req.body;

    const limit = 10;
    const skip = (parseInt(page) - 1) * limit;

    // Base condition
    const matchConditions = { del: 1 };

    // KYC verification filter
    if (kyc_verification !== "") {
      matchConditions.kyc_verification = parseInt(kyc_verification);
    }


    // Active/Inactive status filter
    if (status !== "") {
      matchConditions.ActiveStatus = parseInt(status);
    }

    // add_by specific filter
    if (add_by !== "") {
      matchConditions.add_by = add_by;
    }

    // Search filter (FullName, Email, PhoneNo)
    if (search && search.trim() !== "") {
      matchConditions.$or = [
        { FullName: { $regex: search, $options: "i" } },
        { Email: { $regex: search, $options: "i" } },
        { PhoneNo: { $regex: search, $options: "i" } },
      ];
    }

    // Fetch total count for pagination
    const totalCount = await Clients_Modal.countDocuments(matchConditions);

    // Fetch paginated data
    const clients = await Clients_Modal.find(matchConditions)
      .sort({ createdAt: -1 }) // Latest first
      .skip(skip)
      .limit(limit);

    return res.json({
      status: true,
      message: "Client data fetched successfully",
      data: clients,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalRecords: totalCount,
      },
    });
  } catch (error) {
    return res.json({ status: false, message: "Server error", data: [] });
  }
  }


  async getClientWithFilterExcel(req, res) {
    try {
    const { status = "", kyc_verification = "",  search = "", add_by = "", page = 1 } = req.body;

    const limit = 10;
    const skip = (parseInt(page) - 1) * limit;

    // Base condition
    const matchConditions = { del: 0 };

    // KYC verification filter
    if (kyc_verification !== "") {
      matchConditions.kyc_verification = parseInt(kyc_verification);
    }

    // Active/Inactive status filter
    if (status !== "") {
      matchConditions.ActiveStatus = parseInt(status);
    }

    // add_by specific filter
    if (add_by !== "") {
      matchConditions.add_by = add_by;
    }

    // Search filter (FullName, Email, PhoneNo)
    if (search && search.trim() !== "") {
      matchConditions.$or = [
        { FullName: { $regex: search, $options: "i" } },
        { Email: { $regex: search, $options: "i" } },
        { PhoneNo: { $regex: search, $options: "i" } },
      ];
    }

    // Fetch total count for pagination
    const totalCount = await Clients_Modal.countDocuments(matchConditions);

    // Fetch paginated data
    const clients = await Clients_Modal.find(matchConditions)
      .sort({ createdAt: -1 }) // Latest first
      .skip(skip)
      .limit(limit);

    return res.json({
      status: true,
      message: "Client data fetched successfully",
      data: clients,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalRecords: totalCount,
      },
    });
  } catch (error) {
    return res.json({ status: false, message: "Server error", data: [] });
  }
  }


  async detailClient(req, res) {
    try {
      // Extract ID from request parameters
      const { id } = req.params;
      // Check if ID is provided
      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Client ID is required"
        });
      }

      const client = await Clients_Modal.findById(id);
      // If client not found
      if (!client) {
        return res.status(404).json({
          status: false,
          message: "Client not found"
        });
      }

      return res.json({
        status: true,
        message: "Client details fetched successfully",
        data: client
      });

    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error",
        data: []
      });
    }
  }



  async updateClient(req, res) {
    try {
      const { id, FullName, Email, PhoneNo, state, city, dob } = req.body;

      // Check if the required fields are provided
      if (!FullName) {
        return res.json({ status: false, message: "Fullname is required" });
      }

      if (!Email) {
        return res.json({ status: false, message: "Email is required" });
      } else if (!/^\S+@\S+\.\S+$/.test(Email)) {
        return res.json({ status: false, message: "Invalid Email format" });
      }

      if (!PhoneNo) {
        return res.json({ status: false, message: "Phone Number is required" });
      } else if (!/^\d{10}$/.test(PhoneNo)) {
        return res.json({ status: false, message: "Invalid Phone Number format" });
      }


      if (!state) {
        return res.status(400).json({ status: false, message: "Please select state" });
      }

      if (!city) {
        return res.status(400).json({ status: false, message: "Please select city" });
      }


      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Client ID is required",
        });
      }

      // Check if the email is already in use by any other client (excluding the current client)
      const existingEmail = await Clients_Modal.findOne({
        Email,
        _id: { $ne: id }, // Exclude the current client
        del: 0 // Assuming 'del' marks deleted clients
      });
      if (existingEmail) {
        return res.status(400).json({ status: false, message: "Email is already Exist" });
      }

      // Check if the phone number is already in use by any other client (excluding the current client)
      const existingPhoneNo = await Clients_Modal.findOne({
        PhoneNo,
        _id: { $ne: id }, // Exclude the current client
        del: 0 // Assuming 'del' marks deleted clients
      });
      if (existingPhoneNo) {
        return res.status(400).json({ status: false, message: "Phone Number is already Exist" });
      }


      // Proceed with the update
      const updatedClient = await Clients_Modal.findByIdAndUpdate(
        id,
        {
          FullName,
          Email,
          PhoneNo,
          state,
          city,
          dob,
        },
        { new: true, runValidators: true } // Options: return the updated document and run validators
      );

      // If the client is not found
      if (!updatedClient) {
        return res.status(404).json({
          status: false,
          message: "Client not found",
        });
      }

      return res.json({
        status: true,
        message: "Client updated successfully",
        data: updatedClient,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }


  async deleteClient(req, res) {
    try {
      const { id } = req.params; // Extract ID from URL params

      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Client ID is required",
        });
      }

      const deletedClient = await Clients_Modal.findByIdAndUpdate(
        id,
        { del: 1 }, // Set del to true
        { new: true }  // Return the updated document
      );
      if (!deletedClient) {
        return res.status(404).json({
          status: false,
          message: "Client not found",
        });
      }

      return res.json({
        status: true,
        message: "Client deleted successfully",
        data: deletedClient,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }

  async statusChange(req, res) {
    try {
      const { id, status } = req.body;

      const validStatuses = ['1', '0'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          status: false,
          message: "Invalid status value"
        });
      }

      // Find and update the plan
      const result = await Clients_Modal.findByIdAndUpdate(
        id,
        { ActiveStatus: status },
        { new: true }
      );

      if (!result) {
        return res.status(404).json({
          status: false,
          message: "Client not found"
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
        data: []
      });
    }
  }


  async processPayoutRequest(req, res) {
      try {
        const { payoutRequestId, status, remark } = req.body;
  
        // Validate input
        if (!payoutRequestId || !['1', '2'].includes(status)) {
          return res.json({ status: false, message: 'Invalid payout request ID or status.' });
        }
  
        // Fetch the payout request record
        const payoutRequest = await Payout_Modal.findById(payoutRequestId);
  
        if (!payoutRequest) {
          return resolve.json({ status: false, message: 'Payout request not found.' });
        }
  
        // Fetch the client record
        const client = await Clients_Modal.findOne({ _id: payoutRequest.clientid, del: 0, ActiveStatus: 1 });
  
        if (!client) {
          return res.json({ status: false, message: 'Client not found or inactive.' });
        }
       
  
        if (status === '1') {
          // Approve the payout request
          payoutRequest.status = '1';
  
        } else if (status === '2') {
          // Logic to reject the payout request
          payoutRequest.status = '2';
          payoutRequest.remark = remark;
          client.wamount += payoutRequest.amount; // Refund amount back to client's wamount
          await client.save();

  
        }
  
        await payoutRequest.save();
        
        return res.json({
          status: true,
          message: 'Payout request updated successfully.',
          data: payoutRequest,
        });
  
      } catch (error) {
        // console.error('Error processing payout request:', error);
        return res.json({ status: false, message: 'Server error while processing payout request.' });
      }
    }
  
    async payoutList(req, res) {
  
      try {
        // const { } = req.body; // Not needed unless you plan to use body data
  
        const result = await Payout_Modal.aggregate([
          {
            $lookup: {
              from: "clients", // The collection to join
              let: { clientId: { $toObjectId: "$clientid" } }, // Convert clientid to ObjectId for matching
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$_id", "$$clientId"] }, // Match _id with clientId
                    ActiveStatus: 1, // Ensure client is active
                    del: 0 // Ensure client is not deleted
                  }
                },
                {
                  $project: { FullName: 1, Email: 1, PhoneNo: 1, wamount: 1 } // Get only required fields
                }
              ],
              as: "client_details" // The resulting array of matched documents from clients
            }
          },
          {
            $unwind: { path: "$client_details", preserveNullAndEmptyArrays: false } // Exclude documents where client_details is empty or null
          },
          {
            $project: {
              _id: 1,
              clientid: 1,
              amount: 1,
              status: 1,
              del: 1,
              created_at: 1,
              updated_at: 1,
              client_details: 1 // Include client details
            }
          }
        ]);
  
        // Log the result for debugging
  
        return res.json({
          status: true,
          message: "get",
          data: result
        });
  
      } catch (error) {
        return res.json({ status: false, message: "Server error", data: [] });
      }
    }
  

async  listBankDetails(req, res) {
  try {
    const { client_id } = req.query;

    let filter = { del: false };
    if (client_id) filter.client_id = client_id; // Client wise filter

    const banks = await Bank_Modal.find(filter).sort({ created_at: -1,del: false });

    return res.status(200).json({
      status: true,
      message: "Bank details fetched successfully",
      data: banks
    });
  } catch (error) {
    console.error("List Bank Error:", error);
    return res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
}


}
module.exports = new Clients();