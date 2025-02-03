import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

export const connectToDB = async () => {

    try {

        await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.9yny4.mongodb.net/chatapp`);
        console.log(`MongoDB connection successful`);

    } catch (error) {
        console.log(`MongoDB connection failed -> ${error.message}`);
    }

}