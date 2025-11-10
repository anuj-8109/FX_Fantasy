"use strict";

require('dotenv').config();
const mongoose = require('mongoose');

const db = require("../Models"); // Make sure App/models/index.js exports Role
const BasicSetting = db.BasicSetting;

async function seedBasicSetting() {
  try {
    // ✅ Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    });

    // 2️⃣ Define default BasicSetting
    const basicSetting = {
      _id: "66bb3c19542b26b6357bbf4f",
      address: "abc test sadada",
      contact_number: "99912312311",
      email_address: "demo@gmail.com",
      encryption: "SSL",
      favicon: "",
      from_mail: "",
      from_name: "WEB",
      logo: "",
      smtp_host: "",
      smtp_password: "",
      smtp_port: 465,
      smtp_status: 1,
      smtp_username: "",
      receiver_earn: "0",
      refer_description: "",
      refer_title: "Refer and Earn",
      sender_earn: "0",
      digio_client_id: "",
      digio_client_secret: "",
      refer_image: "",
      digio_template_name: "",
      kyc: 0,
      refer_status: 0,
      noof_pdf_pages: "3",
      pdf_footer: `<div style="height:0;"></div>`,
      pdf_header: `<div style="height:0;"></div>`,
      pdf_template: `<fieldset id="SecondStep">
                 <div class="form-step" id="SecondStep11">
         
                     <div class="experiences-group">
                         <div class="experience-item">
                             <h3 class="new-service-agreement" style="text-align:center;">{{company_name}} Services Agreement</h3>
                             <div style="padding: 20px 0px 40px 0px;">
                             <div>
                     <p>This Services Agreement (this “Agreement”) is made and entered into as of the  <span id="dateee" style="margin-right: 12px;">{{datetime}}</span>, by and between the <b>{{company_name}}</b> having its registered office at {{company_address}}
                                 </p>
                                 <p>And</p>
                                 <p>Mr./Mrs./Miss: <b>{{name}}</b>&nbsp; Email: <b>{{email}}</b>&nbsp; UID/Aadhaar: <span id="adharnumber" style="margin-right: 12px;"><b>{{aadhaarno}}</span></b>&nbsp; MOBILE No: <b>{{phone}}</b>&nbsp; <span id="contactNo" style="margin-right: 12px;"></span></b>
                                 <p>Whereas Client is an active investor or trader in share market & having it’s an active D-mate account, he/she wish to obtain Algo Platform. Resulting which <b>{{company_name}}</b> ready to serve its platform services and client ready to receive and enjoy Algo Platform services on following term and conditions.
                                 </p>
                                 <div class="now-therefore">
                             <h2>Now Therefore, The Parties Agree as Follows…. </h2>
                             <p>Please Find the attached files of Disclaimer as well as Terms and Conditions of the company and read it Carefully.</p>
                             <h3>Disclaimer:-</h3>
                             <p><span>1.</span><span></span><span></span>
                                 <span>All subscription fees paid to <b>{{company_name}}</b> Non-refundable. We do not provide trading tips, nor we are investment adviser. Nor we provide any advice or guidance or recommendations in stock market.
                             </span>
                             </p>
                             <p><span>2.</span><span></span>
                                 <span><b>{{company_name}}</b> Trades or its associates are not liable or responsible for any loss or shortfall arising from operations and affected by the market condition.
                                 </span>
                             </p>
                            
                             <p><span>3.</span><span></span>
                                 <span>The investor is requested to take into consideration all the risk factors including their financial condition, suitability to risk return profile and take professional advice before investing. Such representations are not indicative of future results.
                                 </span>
                             </p>
                           
                             <p><span>4.</span><span></span>
                                 <span></span>
                                 <span><b>{{company_name}}</b> orits executives never ask for client De -Mat credentials. We do not provide any De-mat account handling services.
                             </span>
                             </p>
                             <p><span class="now-therefore1">5.</span> <span></span>
                                 <span><b>{{company_name}}</b> onlyprovides 1 time software login credentials to clients on their registered email id provided to the company after that client need to change the software credentials also. Kindly do not Share Your Email Credentials to any executive and other person. If even though you share, then any financial loss is not out responsibility.</span>
                             </p>
                             
                             <p><span class="now-therefore1">6.</span> <span></span>
                                 <span>Past performance of signal does not indicate the future performance of any current or future strategy/model or advise by {{company_name}} Trades and actual returns may differ significantly from that depicted herein due to various factors including but not limited to impact costs, expense charged, timing of entry/exit, timing of additional flows/redemptions, individual client mandates, specific portfolio construction characteristics etc.</span>
                             </p>
                           
                             <p><span class="now-therefore1">7.</span> <span></span>
                                 <span><b>{{company_name}}</b> takes the subscription charges for providing the platform for automatic trading and not for the strategies inbuilt...Strategies are Free of cost.</span>
                             </p>
                             <p><span class="now-therefore1">8.</span> <span></span>
                                 <span>Client need to pay the charges for the strategy modification or creating or developing new strategy.</span>
                             </p>
                             <p><span class="now-therefore1">9.</span> <span></span>
                                 <span>Under no circumstances shall the Company be responsible to the Customer for any costs, expenses, or damages, including but not limited to direct losses, consequential, special or indirect losses, loss of profits, loss of opportunities (including those related to ensuing market movements), costs, or expenses.</span>
                             </p>
                             <p><span class="now-therefore1">10.</span> <span></span>
                                 <span>Subscription amount paid to <b>{{company_name}}</b> is not refundable under any circumstances.{{company_name}} does not commit nor guarantee safety of client’s investment because that purely depends on market factors which is unavoidable.</span>
                             </p>
                             <p><span class="now-therefore1">11.</span> <span></span>
                                 <span>Beware of fixed/guaranteed/regular returns/ capital protection schemes. We Don’t provide any type of offer fixed/guaranteed/regular returns/ capital protection on your investment.</span>
                             </p>
                         
                             <h3>Terms and Conditions :-</h3>
                             <p><span>1.</span><span></span><span></span>
                                 <span>Use of this website and the information contained here (the "Content") is subject to your compliance with the terms and conditions outlined in this Terms of Service agreement. By using <b>{{company_name}}</b> Sites and Services, you are confirming your acceptance of our Terms of Services. Your ability to use this website and its content is also governed by any signed content licence agreements you may have with <b>{{company_name}}.</b>
                             </span>
                             </p>
                             <p><span>2.</span><span></span>
                                 <span>Absent is investment advice. Only the needs of the clients are taken into consideration when designing the technology. Any stock advisory or financial advisor is completely unrelated to us. <b>{{company_name}}</b> and its employees do not advise you to purchase, sell, or hold any particular security. We don't provide any type of investment advice, personalised or not. <b>{{company_name}}</b> advises that you perform your own research and seek specialised financial advice from a licenced financial professional.
                                 </span>
                             </p>
                            
                             <p><span>3.</span><span></span>
                                 <span>The username or password that has been given to you may only be used by one person to access this website. If the Terms of Service are broken, <b>{{company_name}}</b> maintains the right to terminate an ID or IDs at any time. You are not permitted to access or retrieve Content from this website using an automated computer programme. Also, neither the Content nor your password or username may be copied, redistributed, disclosed, forwarded (by email or otherwise), furnished, or sold to any third party. <b>{{company_name}}</b> and its information and content providers are strictly reserved for all rights not expressly granted herein.
                                 </span>
                             </p>
                           
                             <p><span>4.</span><span></span>
                                 <span></span>
                                 <span>Limitations of Responsibility; Warranties Disclaimed. <b>{{company_name}}</b> is not an investment adviser. You acknowledge that the information on this website and its content is provided solely for your personal, non-commercial informational needs and that it does not constitute a recommendation to buy, sell, or hold any particular security or to engage in any particular transaction, investment strategy, or portfolio of securities for any person. You also accept that <b>{{company_name}}</b> and <b>{{company_name}}</b> services won't give your personal advice about the characteristics, worth, suitability, or transactional implications of any specific security, portfolio of securities, financial decision, or other issue. You admit that you oversee making your own financial decisions.
                             </span>
                             </p>
                             <p><span class="now-therefore1">5.</span> <span></span>
                                 <span>We provide a FREE opportunity to experience the world of <b>{{company_name}}</b> with no fees attached during our no-obligation, free trial. There can only be one free trial per customer. Purchases of subscriptions are all final. There will be no refunds, partial or otherwise.</span>
                             </p>
                             
                             <p><span class="now-therefore1">6.</span> <span></span>
                                 <span> We are not an investment adviser. It is a purely service and support industry for software development. <b>{{company_name}}</b> develops algorithms-based strategies. We don't offer stock market advice, calls, or information. Just software, support, maintenance, services, strategy, and formula development are built by us.</span>
                             </p>
                           
                             <p><span class="now-therefore1">7.</span> <span></span>
                                 <span>That the first party is only going to just provide User/Client with the software once. Because the User/Client is fully aware of the information, the profits that will be reduced from them- The loss liability will be of your User/Client only. The person to whom the ID will be purchased by the User/Client, and all incidents, profit and loss from the said software will be the responsibility of the User/Client. The <b>{{company_name}}</b> will not be held liable in this situation.</span>
                             </p>
                             <p><span class="now-therefore1">8.</span> <span></span>
                                 <span>That whatever the User/Client to the first party asks us to build, we won't share it with anyone else by the <b>{{company_name}}</b>, and we won't breach the privacy requested by the first party.</span>
                             </p>
                             <p><span class="now-therefore1">9.</span> <span></span>
                                 <span>In order to provide the User/Client with the necessary technical resources for the mentioned programme, it is the <b>{{company_name}}</b> obligation; nonetheless, if the software must be shut down for any technical reason, you are still liable for any resulting financial loss.</span>
                             </p>
                             <p><span class="now-therefore1">10.</span> <span></span>
                                 <span>The responsibility of the User/Client is that the <b>{{company_name}}</b> will not be liable for any harm or trouble caused by the data security breach caused by the programme if it is hacked by someone.</span>
                             </p>
                             <p>
                                 <span>I undertake to abide by all Exchange rules, byelaws, regulations, and circulars as well as SEBI rules, byelaws, and any other applicable notifications of the Government authorities as they may be in effect at any given time.</span>
                             </p>
                             <p>
                                 <span>I give the permission to <b>{{company_name}}</b> to take any necessary action against me or us. If I/We carry out a strategy that deceives any investor and contravenes all current and future Exchange and SEBI rules and regulations. Notifications from the government authorities as they may be current.</span>
                             </p>
                             <h5 style="text-align:left; padding: 40px 0px 10px 0px;">Client Agreement Declaration</h5>
                         <h6 style="text-align:left;"><span></span><span>Client Consent</span></h6>
                         <p class="para_text">
                             <span></span>
                             <span>This is our standard client agreement upon which we intend to rely, for your own benefit and protection you should read the term of this agreement, disclosures, disclaimer and term and conditions, refund policy carefully before signing. As by signing you consent to the terms contained. I/we understand and consent to the above terms and I hereby authorize <b>{{company_name}}</b> to provide me Algo Platform. The Liabilities and responsibilities of <b>{{company_name}}</b> will be limited to its Algo Platform provided. I/we read and understand all the above said documents. I/we agree that the client agreement will come into effect from the date of issue.</span>
                         </p>
                     
                         <div class="d-flex" style="margin-top: 10px;">
                             <div style="float: left; width: 50px;">
                                <span></span>
                                <span><img src="assets/img/new-right.png" width="30px"></span>
                             </div>
                             <div style="float: left; width: 950px;">
                                 <p style="width: 100%; margin: 0px;">
                                 <span></span> 
                                 <span>I know well and agree the risk involved in the market.</span>
                                 </p>
                             </div>
                             <div style="clear:both;"></div>
                         </div>
                         
                         <div class="d-flex" style="margin-top: 10px;">
                             <div style="float: left; width: 50px;">
                                <span></span>
                                <span><img src="assets/img/new-right.png" width="30px"></span>
                             </div>
                             <div style="float: left; width: 950px;">
                             <p style="width: 100%; margin: 0px;">
                                 <span></span>
                                 <span>I know well and agree on that the risk nature of services.</span>
                             </p>
                             </div>
                             <div style="clear:both;"></div>
                         </div>
                         
                         <div class="d-flex" style="margin-top: 10px;">
                             <div style="float: left; width: 50px;">
                                 <span></span>
                                 <span><img src="assets/img/new-right.png" width="30px"></span>
                             </div>
                             <div style="float: left; width: 950px;">
                             <p style="width:100%; margin: 0px;">
                                 <span></span>
                                 <span>I have visited <b>{{company_name}}</b> Website and gone through and understood the Disclosures, Disclaimer and term and conditions, Refund Policy and hereby agreed with same.</span>
                             </p>
                             </div>
                             <div style="clear:both;"></div>
                         </div>
                         
                         <div class="d-flex" style="margin-top: 10px;">
                             <div style="float: left; width: 50px;">
                                 <span></span><span>
                                 <img src="assets/img/new-right.png" width="30px">
                                 </span>
                             </div>
                             <div style="float: left; width: 950px;">
                             <p style="width:100%; margin: 0px;">
                                 <span><span>
                                 <span>I understood English language well, I do understand the transaction of English made & explained in vernacular/my mother tongue language by the executive of firm/company.</span>
                             </p>
                             </div>
                             <div style="clear:both;"></div>
                         </div>
                         
                         <h4>{{company_name}}</h4>
                         <h5 style="text-align:left; margin-bottom: 20px;">(Authorized)</h5>
                         </div>
                         
                             </div>
                     </div>
                         </div>
                     </div>
                     
                 </div>
                 </fieldset>`,
    };

    // 3️⃣ Insert or update if not exists
    const exists = await BasicSetting.findById(basicSetting._id);
    if (!exists) {
      await BasicSetting.create(basicSetting);
    } else {
    }

  } catch (err) {
  } finally {
    // mongoose.disconnect();
  }
}

module.exports = seedBasicSetting;


