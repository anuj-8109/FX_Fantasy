require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./App/connection/db');
const { connectRedis } = require('./App/connection/redis');
const routes = require('./App/Routes');
const { errorHandler } = require('./App/Middleware/errorHandler');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: '*' } });
global.io = io;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();
connectRedis();

routes(app);
app.use(errorHandler);
require('./App/Routes/index')(app)



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
  console.log("🚀 Seeding started...");
  await seedRoles();
  await seedBasicSetting();
  await seedContent();
  await seedMailTemplates();
  await seedSmsProviders();
  await seedSmsTemplates();
  await seedUsers();
  await seedStates();
  await seedCities();
 
  console.log("✅ All seeds done!");
}

// ✅ 2️⃣ Connect Mongo FIRST
mongoose.connect(process.env.MONGO_URI, {
  dbName: process.env.DB_NAME,
})
  .then(() => {
    console.log("✅ MongoDB connected!");

    // ✅ 3️⃣ Ab 5 min ke baad seeds run karo
    setTimeout(runSeeds, 1 * 60 * 1000); // 5 min = 300000 ms

  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });



const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
