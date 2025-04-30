// import { Conversation } from "../Model/conversation.model.js";
// import { Message } from "../Model/message.model.js";

// export const sendMessage = async (req, res) => {
//   try {
//     const senderId = req.id;
//     const receiverId = req.params.id;
//     const { message } = req.body;

//     let conversation = await Conversation.findOne({
//       participants: { $all: [senderId, receiverId] },
//     });

//     //establish the conversation if it doesn't exist

//     if (!conversation) {
//       conversation = await Conversation.create({
//         participants: [senderId, receiverId],
//       });
//     }
//     const newMessage = await Message.create({
//       senderId,
//       receiverId,
//       message,
//     });
//     if (newMessage) conversation.messages.push(newMessage._id);
//     await Promise.all([newMessage.save(), conversation.save()]);
//     //implement socket.io here to send a notification to the client
//     return res.status(201).json({ success: true, newMessage });
//   } catch (error) {
//     console.error(error);
//   }
// };

// export const getMessages = async (req, res) => {
//   try {
//     const senderId = req.id;
//     const receiverId = req.params.id;
//     const conversation = await Conversation.findOne({
//       participants: { $all: [senderId, receiverId] },
//     })
//     // .populate({
//     //   path: "messages",
//     //   populate: {
//     //     path: "senderId receiverId",
//     //     select: "username profilePic",
//     //   },
//     // });
//     if(!conversation) return res.status(200).json({ message: [], success: false });
//     return res.status(200).json({ success: true,message: conversation?.messages });
//   } catch (error) {
//     console.log(error);
//   }
// };


import { Conversation } from "../Model/conversation.model.js";
import { Message } from "../Model/message.model.js";
import { User } from "../Model/user.model.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { message } = req.body;

    // Validate receiver existence
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "Receiver not found"
      });
    }

    // Find or create conversation
    let conversation = await Conversation.findOneAndUpdate(
      { participants: { $all: [senderId, receiverId] } },
      { $setOnInsert: { participants: [senderId, receiverId], messages: [] } },
      { upsert: true, new: true }
    );

    // Create and add message
    const newMessage = await Message.create({
      senderId,
      receiverId,
      message
    });

    // Update conversation with atomic operation
    await Conversation.findByIdAndUpdate(conversation._id, {
      $push: { messages: newMessage._id }
    });

    // Populate sender details for response
    const populatedMessage = await Message.findById(newMessage._id)
      .populate("senderId", "username profilePic")
      .populate("receiverId", "username profilePic");

    return res.status(201).json({
      success: true,
      message: populatedMessage
    });

  } catch (error) {
    console.error("Message send error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    }).populate({
      path: "messages",
      populate: [{
        path: "senderId",
        select: "username profilePic"
      }, {
        path: "receiverId",
        select: "username profilePic"
      }]
    });

    return res.status(200).json({
      success: true,
      messages: conversation?.messages || []
    });

  } catch (error) {
    console.error("Get messages error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve messages"
    });
  }
};