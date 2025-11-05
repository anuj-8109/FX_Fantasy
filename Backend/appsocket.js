require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./App/connection/db');
const { connectRedis } = require('./App/connection/redis');
const routes = require('./App/Routes');
const { errorHandler } = require('./App/Middleware/errorHandler');
const db = require("./App/Models");
const http = require('http');
const socketIo = require('socket.io');
const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
var privateKey = fs.readFileSync('../crt/privkey.pem', 'utf8');
var certificate = fs.readFileSync('../crt/fullchain.pem', 'utf8');
var credentials = { key: privateKey, cert: certificate };
const httpsserver = https.createServer(credentials, app);

//const io = socketIo(server, { cors: { origin: '*' } });


// live code 

const io = socketIo(httpsserver, {
  cors: {
    origin: "*",
    credentials: true
  }
});



io.on("connection", (socket) => {
   console.log(`Client connected: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });

});

global.io = io;


app.get("/test", async (req, res) => {
  io.emit("notification", { message: "This is a test notification pppppp" });
  return res.send("Done");
});



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();
// connectRedis();


require("./App/Utils/ioSocketReturn")(app, io);
const LivePrice_Modal = db.LivePrice;

routes(app);
app.use(errorHandler);
require('./App/Routes/index')(app)
require('./App/api/Routes/index')(app)



const mongoose = require("mongoose");

const seedBasicSetting = require('./App/Scripts/seedBasicSetting');
const seedMailTemplates = require('./App/Scripts/seedMailTemplates');
const seedRoles = require('./App/Scripts/seedRoles');
const seedUsers = require('./App/Scripts/seedUsers');
const seedStates = require('./App/Scripts/seedStates');
const seedCities = require('./App/Scripts/seedCities');
const seedContent = require('./App/Scripts/seedContent');
const seedSmsProviders = require('./App/Scripts/seedSmsProviders');
const seedSmsTemplates = require('./App/Scripts/seedSmsTemplates');
async function runSeeds() {
  await seedRoles();
  await seedBasicSetting();
  await seedContent();
  await seedMailTemplates();
  await seedSmsProviders();
  await seedSmsTemplates();
  await seedUsers();
  await seedStates();
  await seedCities();
 
}

// ✅ 2️⃣ Connect Mongo FIRST
mongoose.connect(process.env.MONGO_URI, {
  dbName: process.env.DB_NAME,
})
  .then(() => {
    console.log("✅ MongoDB connected!");
  startFXSocket();
    // ✅ 3️⃣ Ab 5 min ke baad seeds run karo
    setTimeout(runSeeds, 1 * 60 * 1000); // 5 min = 300000 ms

  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });


  
  // WebSocket Connection to Tiingo FX
  const startFXSocket = () => {
    const ws = new WebSocket("wss://api.tiingo.com/fx");
  
    ws.onopen = () => {
      console.log("🌍 Connected to Tiingo FX WebSocket");
      ws.send(
        JSON.stringify({
          eventName: "subscribe",
          authorization: "b542cfc8a759a827655f47ebfed8f67b08915035",
          eventData: {
            tickers: [
              "eurusd",
              "jpyusd",
              "usdjpy",
              "gbpusd",
              "audusd",
              "usdcad",
              "usdchf",
              "nzdusd",
              "eurjpy",
              "gbpjpy",
              "eurgbp",
              "audjpy",
              "euraud",
              "eurchf",
              "audnzd",
              "nzdjpy",
              "gbpaud",
              "gbpcad",
              "eurnzd",
              "audcad",
              "gbpchf",
              "xauusd",
            ],
            thresholdLevel: 5,
          },
        })
      );
    };
  
    ws.onmessage = async (message) => {
      try {
        const response = JSON.parse(message.data);
  
        if (response.messageType === "A" && response.data?.length > 0) {
          const data = response.data;
  
          const formatted = {
            ticker: data[1],
            date: data[2],
            bidSize: data[3] || 0,
            bidPrice: data[4] || 0,
            midPrice: data[5] || 0,
            askPrice: data[7] || 0,
            askSize: data[6] || 0,
            createdAt: new Date(),
          };
  
          // Emit to frontend
          io.emit("forex_data", formatted);
  
          // Save / update to MongoDB
          await LivePrice_Modal.updateOne(
            { ticker: formatted.ticker },
            { $set: formatted },
            { upsert: true }
          );
        }
      } catch (err) {
        console.error("⚠️ FX WebSocket error:", err.message);
      }
    };
  
    ws.onclose = () => {
      console.log("❌ FX WebSocket disconnected. Reconnecting in 5s...");
      setTimeout(startFXSocket, 5000);
    };
  
    ws.onerror = (err) => console.error("💢 FX WebSocket Error:", err.message);
  };
  


httpsserver.listen(1001)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
