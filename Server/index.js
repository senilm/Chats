// packages
require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const socket = require('socket.io')

// modules
const conDB = require("./connectDB/connectDB");
const authRouter = require("./routes/auth");
const messageRouter = require("./routes/message")
const errorHandlerMiddleware = require("./middlewares/errorHandlerMiddleware");
const authMiddleware = require('./middlewares/authorization')
const { BadRequestError } = require("./errors");
const app = express();

// middlewares

app.use(express.json());
app.use(express.urlencoded({ limit: "30mb", extended: true }));
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(morgan("dev"));

// Routers && endpoints
app.use("/auth", authRouter);
app.use("/message",authMiddleware, messageRouter);

app.get("/", (req, res) => {
  res.status(200).json("hi");
});

// middlewares
app.use(errorHandlerMiddleware);

// Connection
const PORT = process.env.PORT;
const connect = async () => {
  try {
    await conDB(process.env.MONGO_URL);

    const server = app.listen(PORT, () => {
      console.log(`running on ${PORT}`);
    });

    const io = socket(server,{
      cors:{
        origin:"*",
        credentials:true,

      }
    });

    global.onlineUsers = new Map();
    
    io.on("connection",(socket)=>{
      global.chatSocket = socket;
      socket.on("add-user",(userId)=>{
        onlineUsers.set(userId,socket.id)
      })

      socket.on("send-msg",(data)=>{
        const sendUserSocket = onlineUsers.get(data.to)
        if(sendUserSocket){
          socket.to(sendUserSocket).emit("msg-receive",data.message)
        }
      })
    })

  } catch (error) {
    console.log(error);
  }
};
connect();
