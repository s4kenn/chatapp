import bcrypt from 'bcryptjs'
import User from "../models/user.model.js"
import { generateToken } from '../lib/utils.js'

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

export const login = (req, res) => {
}

export const logout = (req, res) => {
}