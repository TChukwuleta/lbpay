const qrcode = require("qrcode")
const cloudinary = require("cloudinary")
require("dotenv").config()

const generateQrCodeUrl = async (text) => {
    const url = await qrcode.toDataURL(text)
    return url
}

const uploadFile = async (text) => {
    const qrcodeUrl = await generateQrCodeUrl(text)
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const { uploader } = cloudinary
    const res = await uploader.upload(qrcodeUrl)
    return res.secure_url
}

module.exports = {
    generateQrCodeUrl,
    uploadFile
}