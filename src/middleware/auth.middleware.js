import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import dotenv from "dotenv"

export const protectRoute = async (req, res, next) => {

    try {

        // to grab token from cookies we will use cookie parser
        const token = req.cookies.jwt
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "You are not authorized"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "You are not authorized. Token is invalid"
            })
        }

        const user = await User.findById(decoded.userId).select("-password")
        if (!user) {
            return res.status(404).status({
                success: false,
                message: "User not found"
            })
        }

        req.user = user
        next()

    } catch (error) {

        res.status(500).json({
            success: false,
            message: `Internal server error -> ${error.message}`
        })

    }

}