import bcrypt from 'bcryptjs'
import User from "../models/user.model.js"
import { generateToken } from '../lib/utils.js'
import cloudinary from '../lib/cloudinary.js'

export const signup = async (req, res) => {

    const { fullName, email, password } = req.body
    try {

        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all fields"
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long"
            })
        }

        const isUserExisting = await User.findOne({ email })

        if (isUserExisting) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            })
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })


        if (newUser) {
            // generate jwt token here
            generateToken(newUser._id, res)
            await newUser.save()
            res.status(201).json({
                success: true,
                message: "User created successfully",
                data: newUser
            })

        } else {
            res.status(400).json({
                success: false,
                message: "Invalid user data"
            })
        }

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal server error"
        })

    }

}

export const login = async (req, res) => {

    const { email, password } = req.body
    try {

        const doesUserExist = await User.findOne({ email })

        if (!doesUserExist) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        const isValidPassword = await bcrypt.compare(password, doesUserExist.password)

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            })
        }

        generateToken(doesUserExist._id, res)
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: doesUserExist
        })


    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal server error"
        })

    }

}

export const logout = (req, res) => {

    try {
        res.cookie("jwt", "", {
            maxAge: 0
        })

        res.status(200).json({
            success: true,
            message: "User logged out successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }

}

export const updateProfile = async (req, res) => {

    try {

        const { profilePic } = req.body
        const userId = req.user._id

        if (!profilePic) {
            res.status(400).json({
                success: false,
                message: "Please provide a profile picture"
            })
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic)

        const updatedUser = await User.findByIdAndUpdate(userId, {
            profilePic: uploadResponse.secure_url
        }, {
            new: true
        })

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedUser
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }

}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "User authenticated",
            data: req.user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}