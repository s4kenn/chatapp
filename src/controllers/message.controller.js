import User from "../models/user.model.js"
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js"


export const getUsersForSidebar = async (req, res) => {

    try {

        const loggedInUser = req.user._id
        // find all the users where id is not equal to current user's id
        const filteredUsers = await User.find({ _id: { $ne: loggedInUser } }).select("-password")

        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            filteredUsers
        })


    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Error fetching users",
        })

    }


}

export const getMessages = async (req, res) => {

    try {

        const { id: userToChatId } = req.params

        const myId = req.user._id

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        })

        res.status(200).json({
            success: true,
            message: "Messages fetched successfully",
            messages
        })


    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Error fetching users",
        })

    }

}

export const sendMessage = async (req, res) => {

    try {

        const { text, image } = req.body
        const { id: receiverId } = req.params
        const senderId = req.user._id

        let imageUrl

        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        await newMessage.save()

        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            newMessage
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching users",
        })
    }

}