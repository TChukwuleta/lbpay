require("dotenv").config()

const hotWallet = process.env.HOT_WALLET || 'hotwallet'
const coldWallet = process.env.COLD_WALLET || 'coldwallet'


module.exports = {
    hotWallet,
    coldWallet
}  