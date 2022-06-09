require('dotenv').config()

export const settings = {
    mongoUri: process.env.MONGO_URI || '',
    PORT : process.env.PORT || 5001,
    JWT_SECRET: process.env.JWT_SECRET || '',
    EMAIL_FROM: process.env.EMAIL_FROM || '',
    EMAIL_FROM_PASSWORD: process.env.EMAIL_FROM_PASSWORD || '',

}