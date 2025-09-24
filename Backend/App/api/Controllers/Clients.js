const db = require("../../Models");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const BasicSetting_Modal = db.BasicSetting;
const Clients_Modal = db.Clients;
const { sendEmail } = require('../../Utils/emailService');
const path = require('path');
const fs = require('fs');
const Mailtemplate_Modal = db.Mailtemplate;
const Refer_Modal = db.Refer;
const Payout_Modal = db.Payout;
const Adminnotification_Modal = db.Adminnotification;
const Smstemplate_Modal = db.Smstemplate;
const Ticket_Modal = db.Ticket;
const Ticketmessage_Modal = db.Ticketmessage;
const Wallet_Modal = db.Wallet;

const { sendSMS } = require('../../Utils/smsHelper');
const upload = require('../../Utils/multerHelper');
const jwt = require('jsonwebtoken');
const otpStore = new Map();

class Clients {


  async detailClient(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Client ID is required"
        });
      }

      // Find client by ID
      const client = await Clients_Modal.findById(id);

      // If client not found
      if (!client) {
        return res.status(404).json({
          status: false,
          message: "Client not found"
        });
      }
      const image = `https://${req.headers.host}/uploads/basicsetting/${client.image}`;

      const clientData = {
        ...client._doc,
        image: client.image ? image : null
      };

      return res.json({
        status: true,
        message: "Client details fetched successfully",
        data: clientData
      });

    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error",
        data: []
      });
    }
  }


  async Logout(req, res) {
    try {
      const { id } = req.params;

      const client = await Clients_Modal.findOne({ _id: id, del: 0, ActiveStatus: 1 });

      if (!client) {
        return console.error('Client not found or inactive.');
      }

      client.devicetoken = "";
      await client.save();

      return res.json({
        status: true,
        message: "Logout successfully",
      });

    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error",
        data: []
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

      const client = await Clients_Modal.findOne({
        _id: id,
      });

      const deletedClient = await Clients_Modal.findByIdAndUpdate(
        id,
        { del: 1 },
        { new: true }
      );

      if (!deletedClient) {
        return res.status(404).json({
          status: false,
          message: "Client not found",
        });
      }

/*
      const titles = 'Important Update';
      const message = `${client.FullName} ,has successfully deleted the account.`;
      const resultnm = new Adminnotification_Modal({
        clientid: id,
        type: 'delete client',
        title: titles,
        message: message
      });


      await resultnm.save();

      io.emit("adminnotification", {
        clientid: id,
        title: titles,
        message: message,
        type: 'delete client',
      });
*/

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

  async requestPayout(req, res) {
    try {
      const { clientId, amount } = req.body;

      // Validate input
      if (!clientId) {
        return res.status(400).json({ status: false, message: 'Invalid client ID' });
      }
      if (amount <= 0) {
        return res.status(400).json({ status: false, message: 'Enter Invalid Amount' });
      }

      // Fetch the client record
      const client = await Clients_Modal.findOne({ _id: clientId, del: 0, ActiveStatus: 1 });

      if (!client) {
        return res.status(404).json({ status: false, message: 'Client not found or inactive.' });
      }

      // Check if the requested amount is below the minimum withdrawal limit
      const minimumWithdrawal = 500;
      if (amount < minimumWithdrawal) {
        return res.status(400).json({ status: false, message: `Minimum withdrawal amount is ${minimumWithdrawal}.` });
      }

      // Check if the client has enough wamount
      if (client.wamount < amount) {
        return res.status(400).json({ status: false, message: 'Insufficient funds in wallet.' });
      }

      // Deduct the amount from client's wamount
      client.wamount -= amount;
      await client.save();

      // Create a new payout request
      const payoutRequest = new Payout_Modal({
        clientid: clientId,
        amount: amount,
      });

      await payoutRequest.save();

      return res.status(201).json({
        status: true,
        message: 'Payout request submitted successfully.',
        data: payoutRequest,
      });

    } catch (error) {
      // console.error('Error processing payout request:', error);
      return res.status(500).json({ status: false, message: 'Server error while processing payout request.' });
    }
  }


  async payoutList(req, res) {
    try {

      const { id } = req.body;  // Extract the client ID from the request parameters
      const result = await Payout_Modal.find({ clientid: id }).sort({ created_at: -1 }); // Sort by _id in descending order
      return res.json({
        status: true,
        message: "get",
        data: result  // Return the fetched payouts
      });
    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });  // Error handling
    }
  }

  async referEarn(req, res) {
    try {
      const { id } = req.body;  // Extract the client ID from the request parameters

      const client = await Clients_Modal.findById(id);

      // If client not found
      if (!client) {
        return res.status(404).json({
          status: false,
          message: "Client not found"
        });
      }

      const result = await Refer_Modal.find({
        $or: [
          { user_id: id }, // Check if user_id matches
          { token: client.refer_token } // Check if token matches
        ]
      }).sort({ created_at: -1 });
      // Process result to show receiveramount or senderamount based on the condition
      const processedResult = await Promise.all(result.map(async (entry) => {
        let amountType = null;
        let clientName = null;

        // Check if user_id matched, show receiveramount
        if (entry.user_id.toString() === id.toString()) {
          // Fetch the client based on the token
          const relatedClient = await Clients_Modal.findOne({ refer_token: entry.token, ActiveStatus: 1 });
          clientName = relatedClient ? relatedClient.FullName : "";

          amountType = {
            type: 'receiver',
            amount: entry.receiveramount
          };
        }
        else if (entry.token === client.refer_token) {
          const relatedClient = await Clients_Modal.findById(entry.user_id);
          clientName = relatedClient ? relatedClient.FullName : "";

          amountType = {
            type: 'sender',
            amount: entry.senderamount
          };
        }

        return {
          ...entry.toObject(),
          amountType,
          clientName
        };
      }));

      return res.json({
        status: true,
        message: "Data retrieved successfully",
        data: processedResult
      });
    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });  // Error handling
    }
  }


  async getTickets(req, res) {
    try {
      const { page = 1, clientId } = req.body;
      const limit = 10;
      const skip = (parseInt(page) - 1) * limit;

      if (!clientId) {
        return res.json({
          status: false,
          message: "Unauthorized. Client not found.",
        });
      }

      const client = await Clients_Modal.findOne({ _id: clientId, del: 0, ActiveStatus: 1 });

      if (!client) {
        return res.json({ status: false, message: 'Client not found or inactive.' });
      }

      // Total count for pagination
      const total = await Ticket_Modal.countDocuments({
        client_id: clientId,
        del: false
      });

      // Fetch paginated tickets
      let tickets = await Ticket_Modal.find({
        client_id: clientId,
        del: false
      })
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const BASE_URL = `https://${req.headers.host}/uploads/ticket/`; // Construct the base URL

      tickets = tickets.map(ticket => {
        if (ticket.attachment) {
          ticket.attachment = BASE_URL + ticket.attachment;
        }
        return ticket;
      });

      return res.json({
        status: true,
        data: tickets,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      });

    } catch (error) {
      return res.json({
        status: false,
        message: "Server Error",
        error: error.message
      });
    }
  }

  async detailTicket(req, res) {
    try {
      const { ticketid } = req.params;

      if (!ticketid) {
        return res.json({
          status: false,
          message: "ticketid is required",
        });
      }
      let ticket = await Ticket_Modal.findOne({ _id: ticketid, del: false }).lean();

      if (!ticket) {
        return res.json({
          status: false,
          message: "Ticket not found",
        });
      }

      const BASE_URL = `https://${req.headers.host}/uploads/ticket/`;

      if (ticket.attachment) {
        ticket.attachment = BASE_URL + ticket.attachment;
      }

      // Fetch related messages
      let messages = await Ticketmessage_Modal.find({ ticket_id: ticketid, del: false })
        .sort({ created_at: -1 }) // oldest to newest
        .lean();

      messages = messages.map(message => {
        if (message.attachment) {
          message.attachment = BASE_URL + message.attachment;
        }
        return message;
      });

      return res.json({
        status: true,
        data: {
          ticket,
          messages
        }
      });

    } catch (error) {
      return res.json({
        status: false,
        message: "Server Error",
        error: error.message
      });
    }
  }

  async rePly(req, res) {
    try {

      await new Promise((resolve, reject) => {
        upload('ticket').fields([{ name: 'attachment', maxCount: 1 }])(req, res, (err) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });

      const { ticket_id, message, client_id } = req.body;

      if (!ticket_id) {
        return res.json({ status: false, message: "Ticket Id is required" });
      }
      if (!message) {
        return res.json({ status: false, message: "Message is required" });
      }
      if (!client_id) {
        return res.json({ status: false, message: "Client Id is required" });
      }
      const client = await Clients_Modal.findOne({ _id: client_id, del: 0, ActiveStatus: 1 });

      if (!client) {
        return res.json({ status: false, message: 'Client not found or inactive.' });
      }

      const ticket = await Ticket_Modal.findOne({ _id: ticket_id, del: false });

      if (!ticket) {
        return res.json({ status: false, message: 'Ticket not found' });
      }

      const attachment = req.files['attachment'] ? req.files['attachment'][0].filename : null;

      // Create a new News record
      const result = new Ticketmessage_Modal({
        ticket_id: ticket_id,
        client_id: client_id,
        message: message,
        attachment: attachment,
      });

      // Save the result to the database
      await result.save();


/*
      const adminnotificationTitle = "Important Update";
      const adminnotificationBody = `${client.FullName} replied on ticket #${ticket.ticketnumber}`;
      const newNotification = new Adminnotification_Modal({
        clientid: client._id,
        segmentid: result._id,
        type: 'help request',
        title: adminnotificationTitle,
        message: adminnotificationBody
      });


      await newNotification.save();

      io.emit("adminnotification", {
        clientid: client._id,
        title: adminnotificationTitle,
        message: adminnotificationBody,
        type: 'help request',
      });

*/

      return res.json({
        status: true,
        message: "reply successfully",
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }


  async addTicket(req, res) {
    try {
      // File upload
      await new Promise((resolve, reject) => {
        upload('ticket').fields([{ name: 'attachment', maxCount: 1 }])(req, res, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });

      const { subject, message, client_id } = req.body;

      if (!subject || !message || !client_id) {
        return res.json({
          status: false,
          message: "Subject, Message, and Client ID are required"
        });
      }

      const client = await Clients_Modal.findOne({ _id: client_id, del: 0, ActiveStatus: 1 });

      if (!client) {
        return res.json({ status: false, message: 'Client not found or inactive.' });
      }

      const existingOpenTicket = await Ticket_Modal.findOne({
        client_id,
        status: { $in: [0, 1] },  // Match if status is 0 OR 1
        del: false
      });

      if (existingOpenTicket) {
        return res.json({
          status: false,
          message: "An open ticket already exists. Please wait for a response before creating a new one.",
          ticket_id: existingOpenTicket.ticketnumber
        });
      }

      const attachment = req.files && req.files['attachment']
        ? req.files['attachment'][0].filename
        : null;

      // Generate ticket number
      const prefix = "TKT";
      const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 12);
      const randomStr = Math.random().toString(36).substr(2, 5).toUpperCase();
      const ticketnumber = `${prefix}-${timestamp}-${randomStr}`;

      // Create ticket
      const newTicket = new Ticket_Modal({
        client_id,
        subject,
        message,
        attachment,
        ticketnumber,
        status: 0, // assuming 'false' means ticket is open
      });

      await newTicket.save();

      return res.json({
        status: true,
        message: "Ticket added successfully",
        data: newTicket
      });

    } catch (error) {
      return res.json({
        status: false,
        message: "Server error",
        error: error.message
      });
    }
  }


async LoginWithOTP(req, res) {
  try {
    const { PhoneNo, token = "" } = req.body;

    // --- Input Validation ---
    if (!PhoneNo) {
      return res.status(400).json({ status: false, message: "Please enter phone number" });
    }
    if (!/^\d{10}$/.test(PhoneNo)) {
      return res.status(400).json({ status: false, message: "Please enter a valid 10-digit phone number" });
    }

    // --- Load Settings ---
    const settings = await BasicSetting_Modal.findOne();
    if (!settings) {
      return res.status(500).json({ status: false, message: "Basic settings not found" });
    }

    // --- Check if client exists ---
    let client = await Clients_Modal.findOne({ PhoneNo, del: 0 });
    let isNewUser = false;

    if (!client) {
      // --- Validate referral token if provided ---
      if (token) {
        const refUser = await Clients_Modal.findOne({ refer_token: token, del: 0, ActiveStatus: 1 });
        if (!refUser) {
          return res.status(400).json({ status: false, message: "Referral code doesn't exist" });
        }
      }

      // --- Generate unique refer token ---
      const referTokenPrefix = PhoneNo.substring(0, 4).toUpperCase();
      const refer_token_suffix = Math.floor(1000 + Math.random() * 9000).toString();
      const refer_token = referTokenPrefix + refer_token_suffix;

      // --- Create new client (Registration) ---
      client = new Clients_Modal({
        PhoneNo,
        refer_token,
        refer_status: token ? (settings.refer_status || 0) : 0,
        del: 0,
        ActiveStatus: 0,
        createdAt: new Date()
      });
      await client.save();
      isNewUser = true;

      // --- Save referral entry if token valid ---
      if (token) {
        await new Refer_Modal({
          token: token,
          user_id: client._id,
          senderearn: settings.sender_earn || 0,
          receiverearn: settings.receiver_earn || 0
        }).save();
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
      otpStore.set(PhoneNo, { otp, expires: Date.now() + 5 * 60 * 1000 });

  
    if (String(settings.smsprovider) === '1') {
      const smstemplate = await Smstemplate_Modal.findOne({ sms_type: "otp" });

      if (!smstemplate?.sms_body || !smstemplate?.templateid) {
        return res.status(400).json({ status: false, message: "SMS template not configured" });
      }

      const message = smstemplate.sms_body.replace(/{#var#}/g, otp);
      await sendSMS(PhoneNo, message, smstemplate.templateid);
    }

    console.log('otp', otp);

    // --- Response ---
    return res.json({
      status: true,
     // otp, // remove in production
      PhoneNo,
      type: isNewUser ? "register" : "login",  // <-- Added explicit type
      message: isNewUser 
        ? "OTP sent successfully" 
        : "OTP sent successfully"
    });

  } catch (error) {
    return res.status(500).json({ status: false, message: "Server error. Please try again later." });
  }
}

async otpSubmitWithPhone(req, res) {
  try {
    const { otp, PhoneNo, devicetoken = "" } = req.body;

    if (!otp) {
      return res.status(400).json({
        status: false,
        message: "Please enter OTP",
      });
    }

  const record = otpStore.get(PhoneNo);
  
  if (!record) {
    return res.status(400).json({ status: false, message: "OTP not found" });
  }

  if (record.expiry < Date.now()) {
    otpStore.delete(PhoneNo);
    return res.status(400).json({ status: false, message: "OTP expired" });
  }

  if (record.otp != otp) {
    return res.status(400).json({ status: false, message: "Invalid OTP" });
  }

    if (!PhoneNo) {
      return res.status(400).json({
        status: false,
        message: "Phone number is required",
      });
    }

    const client = await Clients_Modal.findOne({
      PhoneNo,
      del: 0,
    });

    if (!client) {
      return res.status(400).json({
        status: false,
        message: "Client not found",
      });
    }

    client.devicetoken = devicetoken;

    let isNewSignup = false;

    // ✅ First-time activation
    if (client.ActiveStatus !== 1) {
      client.ActiveStatus = 1;
      isNewSignup = true;
    }

    await client.save();

    const tokenjwt = jwt.sign(
    { id: client._id},
    process.env.JWT_SECRET_CLIENT,
    { expiresIn: "7d" }
  );
  
   otpStore.delete(PhoneNo); 
 
    return res.json({
      status: true,
      message: isNewSignup ? "Registration successful." : "OTP verified. Login successful.",
      data: {
        FullName: client.FullName,
        Email: client.Email,
        PhoneNo: client.PhoneNo,
        id: client.id,
        jwtToken: tokenjwt, 
        createdAt: client.createdAt,
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


async  updateClientProfile(req, res) {
  try {
    const { id, FullName, Email, state, city, dob } = req.body;

    // 🔒 Validation
    if (!FullName) {
      return res.status(400).json({ status: false, message: "Please enter full name" });
    }

    if (!Email) {
      return res.status(400).json({ status: false, message: "Please enter email" });
    } else if (!/^\S+@\S+\.\S+$/.test(Email)) {
      return res.status(400).json({ status: false, message: "Please enter a valid email" });
    }

    if (!state) {
      return res.status(400).json({ status: false, message: "Please select state" });
    }

    if (!city) {
      return res.status(400).json({ status: false, message: "Please select city" });
    }

    if (!dob) {
      return res.status(400).json({ status: false, message: "Please enter DOB" });
    }
    // 🔎 Find client
    const client = await Clients_Modal.findOne({
      _id: id,
      del: 0,
      ActiveStatus: 1
    });

    if (!client) {
      return res.status(404).json({ status: false, message: "Client not found or inactive" });
    }

    // ✅ Check for duplicate email (other clients only)
    const existingEmailClient = await Clients_Modal.findOne({
      Email,
      _id: { $ne: id },
      del: 0
    });

    if (existingEmailClient) {
      return res.status(400).json({
        status: false,
        message: "This email is already in use by another account"
      });
    }

    // ✅ Update fields
    client.FullName = FullName;
    client.Email = Email;
    client.state = state;
    client.city = city;
    client.dob = dob;

    await client.save();

    return res.json({
      status: true,
      message: "Profile updated successfully",
      data: {
        id: client._id,
        FullName: client.FullName,
        Email: client.Email,
        state: client.state,
        city: client.city,
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




async  updateClientName(req, res) {
  try {
    const { id, FullName } = req.body;

    // 🔒 Validation
    if (!FullName) {
      return res.status(400).json({ status: false, message: "Please enter full name" });
    }

    // 🔎 Find client
    const client = await Clients_Modal.findOne({
      _id: id,
      del: 0,
      ActiveStatus: 1
    });

    if (!client) {
      return res.status(404).json({ status: false, message: "Client not found or inactive" });
    }

    // ✅ Check for duplicate email (other clients only)

    // ✅ Update fields
    client.FullName = FullName;
   

    await client.save();

    return res.json({
      status: true,
      message: "Profile updated successfully",
      data: {
        id: client._id,
        FullName: client.FullName,
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

async updateClientImage(req, res) {
  try {
    const { id } = req.body;

    // 🔒 Validation
    if (!id) {
      return res.status(400).json({ status: false, message: "Client id is required" });
    }

    // 🔎 Find client
    const client = await Clients_Modal.findOne({
      _id: id,
      del: 0,
      ActiveStatus: 1
    });

    if (!client) {
      return res.status(404).json({ status: false, message: "Client not found or inactive" });
    }

    // 📂 File Upload Process
    await new Promise((resolve, reject) => {
      upload("clients").fields([{ name: "image", maxCount: 1 }])(req, res, (err) => {
        if (err) return reject(err);

        if (!req.files || !req.files["image"]) {
          return res.status(400).json({ status: false, message: "No file uploaded." });
        }

        resolve();
      });
    });

    // ✅ Update image field
    if (req.files && req.files["image"]) {
      client.image = req.files["image"][0].filename; // ya req.files["image"][0].path
    }

    await client.save();

    return res.json({
      status: true,
      message: "Profile image updated successfully",
      data: {
        id: client._id,
        image: client.image,
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



async  addMoneyInWallet(req, res) {
  try {
    const { client_id, amount, remark } = req.body;

    if (!client_id || !amount) {
      return res.status(400).json({
        status: false,
        message: "client_id and amount are required",
      });
    }

    // Transaction create in wallet history
    const walletEntry = new Wallet_Modal({
      client_id,
      amount,
      type: "credit",
      remark: remark || "Money added",
    });
    await walletEntry.save();

    // Update client balance
    await Clients_Modal.findByIdAndUpdate(
      client_id,
      { $inc: { wamount: amount } }, // increment balance
      { new: true }
    );

    return res.status(200).json({
      status: true,
      message: "Money added to wallet successfully",
      data: walletEntry,
    });
  } catch (error) {
    console.error("Error adding money in wallet:", error);
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
}

async getWalletHistory(req, res) {
  try {
    const { client_id, page = 1 } = req.body;
    const limit = 10;

    if (!client_id) {
      return res.status(400).json({
        status: false,
        message: "client_id is required",
      });
    }

    const pageNum = parseInt(page) || 1;
    const skip = (pageNum - 1) * limit;

    const history = await Wallet_Modal.find({ client_id })
      .populate("client_id", "FullName Email PhoneNo wamount")
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Wallet_Modal.countDocuments({ client_id });

    return res.status(200).json({
      status: true,
      message: "Wallet history fetched successfully",
      page: pageNum,
      limit,
      total,
      data: history,
    });
  } catch (error) {
    console.error("Error fetching wallet history:", error);
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
}



}



module.exports = new Clients();