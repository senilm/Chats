const { BadRequestError } = require("../errors");
const Message = require("../model/messageModel");

const addMsg = async (req, res) => {
  const { from, to, message } = req.body;
  const data = await Message.create({
    message: { text: message },
    users: [from, to],
    sender: from,
  });
  if (!data) {
    throw new BadRequestError("Can't send message");
  }
  return res.status(200).json({ msg: "message added successfully" });
};
const getAllMsg = async (req, res) => {
  const { from, to } = req.body;
  const messages = await Message.find({ users: { $all: [from, to] } }).sort({
    updatedAt: 1,
  });

  const projectedMessages = messages.map((msg)=>{
    const returnVal = () =>{
      if (msg.sender.toString() === from) {
        return true
      }
      return false
    }
    return {
        fromSelf:returnVal(),
        message:msg.message.text
    }
  }) 
  res.status(200).json(projectedMessages)
};

module.exports = { addMsg, getAllMsg };
