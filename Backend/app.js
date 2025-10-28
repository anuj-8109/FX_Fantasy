require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./App/connection/db.js');
const { connectRedis } = require('./App/connection/redis.js');
const routes = require('./App/Routes/index.js');
const { errorHandler } = require('./App/Middleware/errorHandler.js');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*", // Allow all origins
    credentials: true
  }
});

global.io = io;



io.on("connection", (socket) => {

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });

});

require("./App/Utils/ioSocketReturn.js")(app, io);




app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();
// connectRedis();

routes(app);
app.use(errorHandler);
require('./App/Routes/index')(app)
require('./App/api/Routes/index')(app)



const mongoose = require("mongoose");

const seedBasicSetting = require('./App/Scripts/seedBasicSetting.js');
const seedMailTemplates = require('./App/Scripts/seedMailTemplates.js');
const seedRoles = require('./App/Scripts/seedRoles.js');
const seedUsers = require('./App/Scripts/seedUsers.js');
const seedStates = require('./App/Scripts/seedStates.js');
const seedCities = require('./App/Scripts/seedCities.js');
const seedContent = require('./App/Scripts/seedContent.js');
const seedSmsProviders = require('./App/Scripts/seedSmsProviders.js');
const seedSmsTemplates = require('./App/Scripts/seedSmsTemplates.js');
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

    // ✅ 3️⃣ Ab 5 min ke baad seeds run karo
    setTimeout(runSeeds, 1 * 60 * 1000); // 5 min = 300000 ms

  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });



const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
