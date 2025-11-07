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

const Smstemplate_Modal = db.Smstemplate;
const Ticket_Modal = db.Ticket;
const Ticketmessage_Modal = db.Ticketmessage;
const Wallet_Modal = db.Wallet;
const Bank_Modal = db.Bank;
const ContestShare_Model = db.ContestShare;
const Contest_Model = db.Contest

const Tournament_Model = db.Tournament;
const Contestjoin_Modal = db.Contestjoin;
const Contesttrade_Modal = db.Contesttrade;
const Adminnotification_Modal = db.Adminnotification;
const Notification_Modal = db.Notification;

const { sendSMS } = require('../../Utils/smsHelper');
const upload = require('../../Utils/multerHelper');
const { generatePDF } = require('../../Utils/pdfGenerator');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const otpStore = new Map();


const ioSocket = require("../../Utils/ioSocketReturn");
const io = ioSocket.getIO();

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
      const image = `https://${req.headers.host}/uploads/clients/${client.image}`;

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



      
const titles = 'Important Update';
      const message = `User  ${client.FullName} requested withdrawal of ₹${amount}`;
      const resultnm = new Adminnotification_Modal({
        clientid: client._id,
        type: 'withdrawal',
        title: titles,
        message: message
      });


      await resultnm.save();

      io.emit("adminnotification", {
        clientid: client._id,
        title: titles,
        message: message,
        type: 'kyc Upload',
      });
	  
	  



      
        
   const notificationTitle = 'Important Update';
   const notificationBody =`Withdrawal request of ₹${amount} submitted for approval`;
   
 const resultn = new Notification_Modal({
        clientid: client._id,
        type: 'withdrawal',
        title: notificationTitle,
        message: notificationBody
      });

      await resultn.save();
   
           const clientIds = [client._id];
         
const socketData = {
  title: notificationTitle,
  message: notificationBody,
  type: 'kyc Upload',
  from: 'admin',
  clientIds: clientIds
};

 io.emit('clientnotification', socketData);  // ✅ Correct


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
        token: token,
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

  console.log("OTP",otp)
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




const titles = 'Important Update';
      const message = `New user ${client.FullName} has signed up`;
      const resultnm = new Adminnotification_Modal({
        clientid: client._id,
        type: 'signed up',
        title: titles,
        message: message
      });


      await resultnm.save();

      io.emit("adminnotification", {
        clientid: client._id,
        title: titles,
        message: message,
        type: 'kyc Upload',
      });
	  
	  






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
    const client = await Clients_Modal.findByIdAndUpdate(
      client_id,
      { $inc: { wamount: amount } }, // increment balance
      { new: true }
    );

  const settings = await BasicSetting_Modal.findOne();
    if (!settings) {
      return res.status(500).json({ status: false, message: "Basic settings not found" });
    }


      const refertokens = await Refer_Modal.find({ user_id: client._id, status: 0 });

      if (client.refer_status && client.token) {
        if (refertokens.length > 0) {
        }
        else {

          const senderamount = (amount * settings.sender_earn) / 100;
          const receiveramount = (amount * settings.receiver_earn) / 100;

          const results = new Refer_Modal({
            token: client.token,
            user_id: client._id,
            senderearn: settings.sender_earn,
            receiverearn: settings.receiver_earn,
            senderamount: senderamount,
            receiveramount: receiveramount,
            status: 1
          })
          await results.save();
          client.referwamount+= receiveramount;
         // client.wamount += receiveramount;
          await client.save();


   const notificationTitle = 'Important Update';
   const  notificationBody =`₹${receiveramount} bonus credited to your Bonus`;
   
 const resultn = new Notification_Modal({
        clientid: client._id,
        type: 'bonus',
        title: notificationTitle,
        message: notificationBody
      });

      await resultn.save();
   
           const clientIds = [client._id];
                
const socketData = {
  title: notificationTitle,
  message: notificationBody,
  type: 'bonus',
  from: 'admin',
  clientIds: clientIds
};

 io.emit('clientnotification', socketData);  // ✅ Correct

          const sender = await Clients_Modal.findOne({ refer_token: client.token, del: 0, ActiveStatus: 1 });

          if (sender) {
            sender.referwamount+= senderamount;
           // sender.wamount += senderamount;
            await sender.save();

   const notificationTitleSender = 'Important Update';
   const  notificationBodySender =`₹${senderamount} bonus credited to your Bonus`;
   
 const resultn = new Notification_Modal({
        clientid: sender._id,
        type: 'bonus',
        title: notificationTitleSender,
        message: notificationBodySender
      });

      await resultn.save();
   
           const clientIds = [sender._id];
               
const socketData = {
  title: notificationTitle,
  message: notificationBody,
  type: 'bonus',
  from: 'admin',
  clientIds: clientIds
};

 io.emit('clientnotification', socketData);  // ✅ Correct

          } else {
            // console.error(`Sender not found or inactive for user_id: ${refertoken.user_id}`);
          }

        }

      }

      if (refertokens.length > 0) {
        for (const refertoken of refertokens) {
          const senderamount = (amount * refertoken.senderearn) / 100;
          const receiveramount = (amount * refertoken.receiverearn) / 100;

          refertoken.senderamount = senderamount;
          refertoken.receiveramount = receiveramount;
          refertoken.status = 1;

          await refertoken.save();

          // Update client's wallet amount
            client.referwamount+= receiveramount;
        //  client.wamount += receiveramount;
          await client.save();

   const notificationTitle = 'Important Update';
   const  notificationBody =`₹${receiveramount} bonus credited to your Bonus`;
   
 const resultn = new Notification_Modal({
        clientid: client._id,
        type: 'bonus',
        title: notificationTitle,
        message: notificationBody
      });

      await resultn.save();
   
           const clientIds = [client._id];
               
const socketData = {
  title: notificationTitle,
  message: notificationBody,
  type: 'bonus',
  from: 'admin',
  clientIds: clientIds
};

 io.emit('clientnotification', socketData);  // ✅ Correct

          // Update sender's wallet amount
          const sender = await Clients_Modal.findOne({ refer_token: refertoken.token, del: 0, ActiveStatus: 1 });

          if (sender) {
              sender.referwamount+= senderamount;
        //    sender.wamount += senderamount;
            await sender.save();


   const notificationTitleSender = 'Important Update';
   const  notificationBodySender =`₹${senderamount} bonus credited to your Bonus`;
   
 const resultn = new Notification_Modal({
        clientid: sender._id,
        type: 'bonus',
        title: notificationTitleSender,
        message: notificationBodySender
      });

      await resultn.save();
   
           const clientIds = [sender._id];
                
const socketData = {
  title: notificationTitle,
  message: notificationBody,
  type: 'bonus',
  from: 'admin',
  clientIds: clientIds
};

 io.emit('clientnotification', socketData);  // ✅ Correct

          } else {
            // console.error(`Sender not found or inactive for user_id: ${refertoken.user_id}`);
          }
        }
      } else {
        console.log('No referral tokens found.');
      }

   const notificationTitle = 'Important Update';
 
    const notificationBody =`₹${amount} added to your wallet successfully`;
  
 const resultn = new Notification_Modal({
        clientid: client_id,
        type: 'addmoney',
        title: notificationTitle,
        message: notificationBody
      });

      await resultn.save();
   
           const clientIds = [client_id];
               
const socketData = {
  title: notificationTitle,
  message: notificationBody,
  type: 'bonus',
  from: 'admin',
  clientIds: clientIds
};

 io.emit('clientnotification', socketData);  // ✅ Correct






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


  async clientKycAndAgreement(req, res) {
    try {
      // Extract data from the request body
      const email = req.body.email;
      const name = req.body.name;
      const phone = req.body.phone;
      const panno = req.body.panno;
      const aadhaarno = req.body.aadharno;
      const id = req.body.id;

      const refid = Math.floor(10000 + Math.random() * 90000); // Generate a random reference ID

      const client = await Clients_Modal.findOne({ _id: id });

      if (!client) {
        return res.json({
          status: false,
          message: "Client not found",
        });
      }

      const settings = await BasicSetting_Modal.findOne();
      if (!settings || !settings.digio_client_id || !settings.digio_client_secret) {
        return res.status(500).json({ error: 'Digio settings are not configured or are disabled' });
      }

      const company_name = settings.website_title;
      const company_address = settings.address;

      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours() % 12 || 12).padStart(2, '0'); // 12-hour format
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const ampm = now.getHours() >= 12 ? 'pm' : 'am';
      const datetime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}${ampm}`;

     
      let htmlContent = settings.pdf_template || '';
      let pdf_header = settings.pdf_header || '<div style="height:0;"></div>';
      let pdf_footer = settings.pdf_footer || '<div style="height:0;"></div>';


      let state;
      let city;

      if (client.state) {
        state = client.state;
      }

      if (client.city) {
        city = client.city;
      }


      // Replace placeholders with actual values
      htmlContent = htmlContent
        .replace(/{{name}}/g, name)
        .replace(/{{email}}/g, email)
        .replace(/{{phone}}/g, phone)
        .replace(/{{panno}}/g, panno)
        .replace(/{{datetime}}/g, datetime)
        .replace(/{{company_name}}/g, company_name)
        .replace(/{{company_address}}/g, company_address)
        .replace(/{{state}}/g, state)
        .replace(/{{city}}/g, city)
        .replace(/{{aadhaarno}}/g, aadhaarno);


      const pdfresponse = await generatePDF({
        htmlContent,
        fileName: `kyc-agreement-${phone}.pdf`,
        folderPath: 'uploads/pdf',
        baseBackPath: '../../../',
        headerTemplate: pdf_header,
        footerTemplate: pdf_footer
      });


      if (pdfresponse.status !== true) {
        return res.json({
          status: false,
          message: 'Error in PDF generation',
        });
      }




      client.panno = panno;
      client.aadhaarno = aadhaarno;
      client.pdf = `kyc-agreement-${phone}.pdf`;
      await client.save();

      // Aadhaar verification API token
      const digio_client_id = settings.digio_client_id;
      const digio_client_secret = settings.digio_client_secret;
      const digio_template_name = settings.digio_template_name;
      const authToken = Buffer.from(`${digio_client_id}:${digio_client_secret}`).toString('base64');

      const payload = JSON.stringify({
        customer_identifier: phone,
        customer_name: name,
        reference_id: refid,
        template_name: digio_template_name,
        notify_customer: false,
        request_details: {},
        transaction_id: refid,
        generate_access_token: true
      });

      // Make the POST request to Digio API using Axios
      const response = await axios.post(
        'https://api.digio.in/client/kyc/v2/request/with_template',
        payload,
        {
          headers: {
            'Authorization': `Basic ${authToken}`,
            'Content-Type': 'application/json'
          },
          timeout: 300000,
        }
      );


      const resData = response.data;

      if (resData && resData.status === 'requested') {
        const kid = resData.id;
        const customer_identifier = resData.customer_identifier;
        const gid = resData.access_token.id;

        const data = {
          kid,
          customer_identifier,
          gid,
          refid
        };

        return res.json(data);

      } else {
        return res.json({ status: false, message: 'Digio status is not requested' });
      }

    } catch (error) {
      return res.json({
        status: false,
        error: 'Error during PDF generation or API request',
        message: error?.response?.data?.message || error?.message || 'Unknown error',
      });
    }

  }
  
  
    async uploadDocuments(req, res) {
      const id = req.query.id;
      const type = req.query.type || "";


      const client = await Clients_Modal.findOne({ _id: id });
      if (!client) {
        return res.status(400).json({
          status: false,
          message: "Client not found",
        });
      }
  
      // Fetch Digio settings
      const settings = await BasicSetting_Modal.findOne();
      if (!settings || !settings.digio_client_id || !settings.digio_client_secret) {
        return res.status(500).json({
          status: false,
          message: 'Digio settings are not configured or missing',
        });
      }
  
      // Extract Digio credentials
      const digio_client_id = settings.digio_client_id;
      const digio_client_secret = settings.digio_client_secret;
  
      // Path to the PDF document
      const filename = client.pdf;
      const dir = path.join(__dirname, `../../../../${process.env.DOMAIN}/uploads/pdf`, filename);
  
      if (!fs.existsSync(dir)) {
        return res.status(400).json({
          status: false,
          message: 'PDF file not found',
        });
      }
  
      // Create form-data with the PDF file
      const form = new FormData();
      form.append('file', fs.createReadStream(dir), {
        filename: filename,
        contentType: 'application/pdf'
      });
  
      // Prepare the request body for signing
      const noof_pdf_pages = settings.noof_pdf_pages; // Number of pages in the PDF
  
      // Generate sign_coordinates dynamically
      const signCoordinates = {};
      signCoordinates[client.PhoneNo] = {}; // Initialize the phone number key
  
      for (let i = 1; i <= noof_pdf_pages; i++) {
        signCoordinates[client.PhoneNo][i] = [{ llx: 290, lly: 170, urx: 520, ury: 70 }];
      }
  
      const requestBody = {
        signers: [{
          identifier: client.PhoneNo,
          aadhaar_id: client.aadhaarno,
          reason: 'Contract'
        }],
        sign_coordinates: signCoordinates, // Use dynamically generated object
        expire_in_days: 10,
        display_on_page: "custom",
        notify_signers: true,
        send_sign_link: true
      };
  
      // Add the request payload to the form
      form.append('request', JSON.stringify(requestBody));
  
      // Prepare the Authorization header
      const authToken = Buffer.from(`${digio_client_id}:${digio_client_secret}`).toString('base64');
  
      try {
        // Send the request to upload the document and get Digio response
        const response = await axios.post('https://api.digio.in/v2/client/document/upload', form, {
          headers: {
            ...form.getHeaders(),
            'Authorization': `Basic ${authToken}`
          }
        });
  
        // Process the response data
        const refid = Math.floor(10000 + Math.random() * 90000); // Generate a random reference ID
        const doc_id = response.data.id;
        const email = client.Email;
        const PhoneNo = client.PhoneNo;
        // Define the redirect URL
        const baseUrl = "https://app.digio.in/#/gateway/login/";
  
       
          const redirectUrl = encodeURIComponent(`https://${req.headers.host}/backend/api/client/downloaddocuments?id=${client._id}&doc_id=${doc_id}&type=${type}`);
  
          const fullUrl = `${baseUrl}${doc_id}/${refid}/${PhoneNo}?redirect_url=${redirectUrl}`;
          const dynamicUrl = `${req.protocol}://${req.headers.host}`;
          return res.redirect(fullUrl);

      } catch (error) {
  
        return res.status(500).json({
          status: false,
          error: 'Error during PDF generation or API request',
          message: error?.response?.data?.message || error?.message || 'Unknown error',
        });
  
      }
    }
  
    async downloadDocuments(req, res) {
      try {
        const { id, doc_id, type = ""} = req.query;
  
        const client = await Clients_Modal.findById(id);
        if (!client) {
          return res.status(404).json({
            status: false,
            message: "Client not found",
          });
        }
  
        // Fetch Digio settings
        const settings = await BasicSetting_Modal.findOne();
        if (!settings || !settings.digio_client_id || !settings.digio_client_secret) {
          return res.status(500).json({
            status: false,
            message: 'Digio settings are not configured or missing',
          });
        }
  
        // Prepare the authentication token
        const authToken = Buffer.from(`${settings.digio_client_id}:${settings.digio_client_secret}`).toString('base64');
  
        const checkUrl = `https://api.digio.in/v2/client/document/${doc_id}`;
        const checkResponse = await axios.get(checkUrl, {
          headers: {
            'Authorization': `Basic ${authToken}`,
            'Content-Type': 'application/json'
          }
        });
  
        const isSigned = checkResponse.data.signing_parties?.[0]?.status === 'signed';
  
        if (!isSigned) {
          
           if (type == "dashboard") {
            redirectUrl = `https://${req.headers.host}/#/user/dashboard`;
  
          }
          else {
            redirectUrl = `https://${req.headers.host}/#/user/dashboard`;
          }
        }
  
  
        // Define the API endpoint with the document ID
        const url = `https://api.digio.in/v2/client/document/download?document_id=${doc_id}`;
  
        // Make a GET request to download the document
        const response = await axios.get(url, {
          headers: {
            'Authorization': `Basic ${authToken}`,
            'Content-Type': 'application/json'
          },
          responseType: 'arraybuffer'  // Handle binary data like PDF
        });
  
        // Generate a unique filename
        const fileName = `kyc-agreement-${client.PhoneNo}.pdf`;
        const tempPath = path.join(__dirname, `../../../../${process.env.DOMAIN}/uploads/pdf`, fileName);
  
        // Ensure the directory exists
        await fs.promises.mkdir(path.dirname(tempPath), { recursive: true });
  
        // Write the downloaded content to a PDF file
        await fs.promises.writeFile(tempPath, response.data);
        const pdfText = response.data.toString('utf8'); // Or 'latin1' if utf8 fails
  
  
  
        client.kyc_verification = 1;
        client.pdf = fileName; 
        await client.save();
  
        const titles = 'Important Update';
        const message = `Congratulations! ${client.FullName} KYC Verified successfully.`;
        const resultnm = new Adminnotification_Modal({
          clientid: client._id,
          type: 'kyc verification',
          title: titles,
          message: message
        });
  
  
        await resultnm.save();
  
   /*     io.emit("adminnotification", {
          clientid: client._id,
          title: titles,
          message: message,
          type: 'kyc verification',
        });
        */
        //////////////////// send mail sign document ///////////// 
        const mailtemplate = await Mailtemplate_Modal.findOne({ mail_type: 'kyc' });
        if (mailtemplate) {
          let finalMailBody = mailtemplate.mail_body.replace(/{clientName}/g, client.FullName);
  
          const logo = `https://${req.headers.host}/uploads/basicsetting/${settings.logo}`;
          const finalHtml = finalMailBody
            .replace(/{{company_name}}/g, settings.website_title)
            .replace(/{{body}}/g, finalMailBody)
            .replace(/{{logo}}/g, logo);
  
          const mailOptions = {
            to: client.Email,
            from: `${settings.from_name} <${settings.from_mail}>`,
            subject: `${mailtemplate.mail_subject}`,
            html: finalHtml,
            attachments: [{ filename: fileName, path: tempPath }]
          };
  
          await sendEmail(mailOptions);
        }
  
        //////////////////// send mail sign document ///////////// 
  
  
  
        let redirectUrl;
          if (type == "dashboard") {
            redirectUrl = `https://${req.headers.host}/#/user/dashboard`;
  
          }
          else {
            redirectUrl = `https://${req.headers.host}/#/user/dashboard`;
          }
        return res.redirect(redirectUrl);
  
  
  
      } catch (error) {
        const redirectUrl = `https://${req.headers.host}/#/user/dashboard`;
        return res.redirect(redirectUrl);
  
      }
    }
  async updateClientManualkyc(req, res) {
  try {
    // 📂 File Upload Process
    await new Promise((resolve, reject) => {
      upload("clients").fields([
        { name: "adhaarphotofront", maxCount: 1 },
        { name: "adhaarphotoback", maxCount: 1 },
        { name: "pancard", maxCount: 1 }
      ])(req, res, (err) => {
        if (err) return reject(err);
        if (!req.files) {
          return res.status(400).json({ status: false, message: "No files uploaded." });
        }
        resolve();
      });
    });

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

    // ✅ Update documents if uploaded
    if (req.files["adhaarphotofront"]) {
      client.adhaarphotofront = req.files["adhaarphotofront"][0].filename;
    }
    if (req.files["adhaarphotoback"]) {
      client.adhaarphotoback = req.files["adhaarphotoback"][0].filename;
    }
    if (req.files["pancard"]) {
      client.pancard = req.files["pancard"][0].filename;
    }

    client.kyc_type = 1; // Manual KYC
    client.kyc_verification=0;
    await client.save();




   const notificationTitle = 'Important Update';
const notificationBody = `Your KYC documents are under review.`;
 const resultn = new Notification_Modal({
        clientid: client._id,
        type: 'kyc Upload',
        title: notificationTitle,
        message: notificationBody
      });

      await resultn.save();
   
           const clientIds = [client._id];
              
const socketData = {
  title: notificationTitle,
  message: notificationBody,
  type: 'kyc Upload',
  from: 'admin',
  clientIds: clientIds
};

 io.emit('clientnotification', socketData);  // ✅ Correct

        


const titles = 'Important Update';
      const message = `User ${client.FullName} submitted KYC for verification`;
      const resultnm = new Adminnotification_Modal({
        clientid: client._id,
        type: 'kyc Upload',
        title: titles,
        message: message
      });


      await resultnm.save();

      /*io.emit("adminnotification", {
        clientid: client._id,
        title: titles,
        message: message,
        type: 'kyc Upload',
      });
	  */
	  




    return res.json({
      status: true,
      message: "Client documents updated successfully",
      data: {
        id: client._id,
        adhaarphotofront: client.adhaarphotofront,
        adhaarphotoback: client.adhaarphotoback,
        pancard: client.pancard,
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


async  addBankDetail(req, res) {
  try {
    const { name, branch, accountno, ifsc, client_id } = req.body;

    // 🔒 Validation
    if (!client_id) {
      return res.status(400).json({
        status: false,
        message: "Client ID is required"
      });
    }

const client = await Clients_Modal.findOne({
      _id: client_id,
      del: 0,
      ActiveStatus: 1
    });

    if (!client) {
      return res.status(404).json({ status: false, message: "Client not found or inactive" });
    }

    if (!accountno || !ifsc) {
      return res.status(400).json({
        status: false,
        message: "Account number and IFSC are required"
      });
    }

    // ✅ New bank entry
    const newBank = new Bank_Modal({
      name,
      branch,
      accountno,
      ifsc,
      client_id,
    });

    await newBank.save();

    return res.status(201).json({
      status: true,
      message: "Bank detail added successfully",
      data: newBank
    });
  } catch (error) {
    console.error("Add Bank Error:", error);
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message
    });
  }
}


async  listBankDetails(req, res) {
  try {
    const { client_id } = req.query;

    let filter = { del: false };
    if (client_id) filter.client_id = client_id; // Client wise filter

    const banks = await Bank_Modal.find(filter).sort({ created_at: -1 });

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

async deleteBank(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ status: false, message: "Bank id is required" });
    }

    const bank = await Bank_Modal.findOne({ _id: id, del: false });

    if (!bank) {
      return res.status(404).json({ status: false, message: "Bank not found or already deleted" });
    }

    bank.del = true; // Soft delete
    await bank.save();

    return res.status(200).json({
      status: true,
      message: "Bank deleted successfully",
      data: bank
    });
  } catch (error) {
    console.error("Delete Bank Error:", error);
    return res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
}


 async AddContestPrivate(req, res) {
        try {
            const {
                name,
                description,
                contest_type,
                entry_fee,
                total_spots,
                prize_pool,
                prize_distribution,
                is_guaranteed,
                is_private,
                contest_code,
                add_by,
                tournament_id,
                client_id,
            } = req.body;

            // Basic validations
            if (!name) return res.status(400).json({ status: false, message: "name is required" });
            if (!contest_type) return res.status(400).json({ status: false, message: "contest_type is required" });
            if (!entry_fee && entry_fee !== 0) return res.status(400).json({ status: false, message: "entry_fee is required" });
            if (!total_spots) return res.status(400).json({ status: false, message: "total_spots is required" });
            if (!prize_pool && prize_pool !== 0) return res.status(400).json({ status: false, message: "prize_pool is required" });
            if (!client_id) return res.status(400).json({ status: false, message: "client_id is required" });



 const client = await Clients_Modal.findOne({ _id: client_id });

      if (!client) {
        return res.json({
          status: false,
          message: "Client not found",
        });
      }


         // Fetch tournament
    const tournament = await Tournament_Model.findOne({ _id: tournament_id });
    if (!tournament) {
      return res.json({
        status: false,
        message: "Tournament not found",
      });
    }


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
                total_spots,
                prize_pool,
                prize_distribution: prizeDist,
                is_guaranteed,
                is_private,
                contest_code,
                add_by,
                client_id,
                tournament_id,
                is_private: true,
            });

            await contest.save();



             
const titles = 'Important Update';
      const message = `New Private contest ‘${name}’ created in tournament ‘${tournament.name}’`;
      const resultnm = new Adminnotification_Modal({
        clientid: client._id,
        type: 'contest',
        title: titles,
        message: message
      });


      await resultnm.save();

      /*io.emit("adminnotification", {
        clientid: client._id,
        title: titles,
        message: message,
        type: 'contest',
      });
	  */
	  


            return res.status(200).json({
                status: true,
                message: "Contest added successfully"
            });

        } catch (error) {
            return res.status(500).json({ status: false, message: "Server error", error: error.message });
        }
    }

// Share Private Contest
async SharePrivateContest(req, res) {

try {

const { contest_id, shared_by_client_id,PhoneNo } = req.body;

if (!contest_id || !shared_by_client_id || !PhoneNo) {
return res.status(400).json({
status: false,
message: "contest_id, shared_with_client_id and shared_by_client_id are required"

});

}


const recipient = await Clients_Modal.findOne({
PhoneNo: PhoneNo
});


if (!recipient) {
return res.status(404).json({
status: false,
message: "Recipient not found for provided PhoneNo"
});
}


const shared_with_client_id = recipient._id;

const contest = await Contest_Model.findOne({ _id: contest_id, is_private: true });
if (!contest) {
return res.status(404).json({ status: false, message: "Private contest not found" });
}


// Save share entry

const shareEntry = new ContestShare_Model({
contest_id,
shared_with_client_id,
shared_by_client_id,
PhoneNo,
});


await shareEntry.save();



             
const titles = 'Important Update';
      const message = `Private contest ‘${contest.name}’ invitation sent/accepted`;
      const resultnm = new Adminnotification_Modal({
        clientid: shared_by_client_id,
        type: 'contest',
        title: titles,
        message: message
      });


      await resultnm.save();

      /*io.emit("adminnotification", {
        clientid: shared_by_client_id,
        title: titles,
        message: message,
        type: 'contest',
      });
	  */



        
   const notificationTitle = 'Important Update';
   const notificationBody =`You are invited to join private contest ‘${contest.name}’`;
   
 const resultn = new Notification_Modal({
        clientid: shared_with_client_id,
        type: 'contest',
        title: notificationTitle,
        message: notificationBody
      });

      await resultn.save();
   
           const clientIds = [shared_with_client_id];
              
const socketData = {
  title: notificationTitle,
  message: notificationBody,
  type: 'kyc Upload',
  from: 'admin',
  clientIds: clientIds
};

 io.emit('clientnotification', socketData);  // ✅ Correct

        
	  

return res.status(200).json({
status: true,
message: "Contest shared successfully"
});

} catch (error) {

return res.status(500).json({
status: false,
message: "Server error",
error: error.message
});

}

}

// 📌 List Private Contests API
async ListPrivateContests(req, res) {
  try {
    const { client_id, page = 1, status, tournament_id } = req.query;

    if (!client_id) {
      return res.status(400).json({
        status: false,
        message: "client_id is required",
      });
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = 10;
    const skip = (pageNum - 1) * limitNum;
    const now = new Date();

    // 1️⃣ Contests created by client
    let ownContestsFilter = { client_id, is_private: true };
    if (status) {
      if (status === "upcoming") ownContestsFilter.startdate = { $gt: now };
      else if (status === "live") ownContestsFilter.startdate = { $lte: now, enddate: { $gte: now } };
      else if (status === "completed") ownContestsFilter.enddate = { $lt: now };
    }
    if (tournament_id) ownContestsFilter.tournament_id = tournament_id;

    const ownContests = await Contest_Model.find(ownContestsFilter)
      .populate("tournament_id") // 👈 Include tournament data
      .lean();

    // 2️⃣ Contests shared with client
    const sharedEntries = await ContestShare_Model.find({ shared_with_client_id: client_id });
    const sharedContestIds = sharedEntries.map(e => e.contest_id);

    let sharedContestsFilter = { _id: { $in: sharedContestIds }, is_private: true };
    if (status) {
      if (status === "upcoming") sharedContestsFilter.startdate = { $gt: now };
      else if (status === "live") sharedContestsFilter.startdate = { $lte: now, enddate: { $gte: now } };
      else if (status === "completed") sharedContestsFilter.enddate = { $lt: now };
    }
    if (tournament_id) sharedContestsFilter.tournament_id = tournament_id;

    const sharedContests = await Contest_Model.find(sharedContestsFilter)
      .populate("tournament_id") // 👈 Include tournament data
      .lean();

    // Combine both
    const allContests = [...ownContests, ...sharedContests];

    // Pagination manually
    const totalCount = allContests.length;
    const paginatedContests = allContests.slice(skip, skip + limitNum);

    return res.status(200).json({
      status: true,
      message: "Private contests fetched successfully",
      page: pageNum,
      limit: limitNum,
      total: totalCount,
      data: paginatedContests,
    });

  } catch (error) {
    console.error("Error fetching private contests:", error);
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
}


async Refer(req, res) {
  try {
    const { refertoken } = req.query;   

    if (!refertoken) {
      return res.status(400).json({
        status: false,
        message: "refertoken is required in URL",
      });
    }

    // Example: find referrer user from token
       const referrer = await Clients_Modal.findOne({ refer_token: refertoken, del: 0, ActiveStatus: 1 });
    if (!referrer) {
      return res.status(404).json({
        status: false,
        message: "Invalid referral token",
      });
    }


     return res.status(200).json({
        status: true,
      refertoken: refertoken,
     });
  

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
}


// ✅ My Joined Contests (Without tournament_id filter)
async myContestsWithoutTournament(req, res) {
  try {
    const { client_id, page = 1, status } = req.body;

    if (!client_id) {
      return res.status(400).json({ status: false, message: "client_id is required" });
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = 10;
    const skip = (pageNum - 1) * limitNum;

    const now = new Date();

    // Base filter (sirf client_id ke basis par)
    const filter = { client_id };

    // Status wise filtering
    let dateFilter = {};
    if (status === "upcoming") {
      dateFilter = { startdate: { $gt: now } };
    } else if (status === "live") {
      dateFilter = { startdate: { $lte: now }, enddate: { $gte: now } };
    } else if (status === "completed") {
      dateFilter = { enddate: { $lt: now } };
    }

    // Main query (contest join ke data ke साथ contest aur tournament dono populate)
    const contests = await Contestjoin_Modal.find(filter)
      .populate({
        path: "contest_id",
        model: "Contest",
        match: dateFilter, // status ke according filter
        populate: {
          path: "tournament_id",
          model: "Tournament",
        },
      })
      .populate("client_id") // optional: client details
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limitNum)
      .exec();

    // Filter out null contests (agar match filter ke wajah se contest null ho gaya)
    const validContests = contests.filter(c => c.contest_id);

    const totalCount = validContests.length;

    return res.status(200).json({
      status: true,
      message: "My contests fetched successfully",
      page: pageNum,
      limit: limitNum,
      total: totalCount,
      data: validContests,
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


async googleAuth(req, res, next) {
 try {
    // Trigger the Google authentication flow
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
  } catch (error) {
    console.error("Error in googleAuth:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
  }

async googleCallback(req, res, next) {
 try {
    // Call passport authenticate (this part stays synchronous for authentication)
    passport.authenticate('google', { session: false }, async (err, user, info) => {
      if (err) {
        console.error("Error in Google Authentication:", err);
        return next(err);
      }

      if (!user) {
        return res.redirect(`${process.env.DOMAIN}`);
      }


      // Create JWT token
      const payload = {
        id: user._id,
        googleId: user.googleId,
        email: user.Email,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET_CLIENT, { expiresIn: '7d' });

      // Option 1: Redirect with token as URL parameter (less secure)
      // return res.redirect(`${DOMAIN}/auth/success?token=${token}`);

      // Option 2: Send the token as an HTTPOnly cookie (more secure)
      res.cookie('token', token, {
        httpOnly: true,  // Ensures cookie can't be accessed via JS (XSS protection)
        secure: process.env.NODE_ENV === 'production', // Enable in production (HTTPS)
        maxAge: 7 * 24 * 60 * 60 * 1000, // Token expiry: 7 days
      });

      // Redirect to success page

const dynamicUrl = `${req.protocol}://${req.headers.host}`;

return res.redirect(
  `${dynamicUrl}?token=${token}&FullName=${encodeURIComponent(user.FullName)}&email=${encodeURIComponent(user.Email)}&createdAt=${encodeURIComponent(user.createdAt)}&id=${user._id}`
);


})(req, res, next);
  } catch (err) {
    console.error("Error in googleCallback:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }

}

}



module.exports = new Clients();