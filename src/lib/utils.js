import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

export const generateToken = (userId, res) => {

    const token = jwt.sign({
        userId: userId
    }, process.env.JWT_SECRET_KEY, {
        expiresIn: '7d'
    })

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // MS
        httpOnly: true, // Prevent JavaScript access (XSS attacks)
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development"
    })

    return token

}