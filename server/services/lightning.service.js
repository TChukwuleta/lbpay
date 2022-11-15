const lnrpc = require("@radar/lnrpc")
const ApiError = require("../helper/ApiError")
require("dotenv").config()

const connectRpc = async () => {
    try {
        const lnRpcClient = await lnrpc.createLnRpc({
            server: process.env.LND_RPC_URL,
            tls: process.env.LND_RPC_PATH,
            macaroon: process.env.LND_MACAROON
            // there is macaroon path
        })
        
        const routerClient = await lnrpc.createRouterRpc({
            server: process.env.LND_RPC_URL,
            tls: process.env.LND_RPC_PATH,
            macaroon: process.env.LND_MACAROON
            // there is macaroon path
        })
        return { lnRpcClient, routerClient }
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error)
    }
}

const createInvoice = async (amount) => {
    try {
        const { lnRpcClient, routerClient } = await connectRpc()
        const invoice = await lnRpcClient.addInvoice({ value: amount.toString() })
        var invoiceData = {
            PaymentRequest: invoice.paymentRequest,
            Hash: (invoice.rHash).toString('base64'),
            Amount: amount
        }
        return JSON.parse(JSON.stringify(invoiceData))
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error)
    }
}

const lookUpInvoiceHash = async (hash) => {
    try {
        const { lnRpcClient, routerClient } = await connectRpc()
        const rHash = Buffer.from(hash, 'base64')
        const { settled } = await lnRpcClient.lookupInvoice({ rHash })
        if(!settled) throw new ApiError(400, "Payment has not been made")
        return settled
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error)
    }
}

const decodeInvoice = async (invoice) => {
    try {
        const { lnRpcClient, routerClient } = await connectRpc()
        const decodedInvoice = await lnRpcClient.decodePayReq({ payReq: invoice })
        return decodedInvoice
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error)
    }
}

const invoiceLookup = async (invoice) => {
    try {
        const { lnRpcClient, routerClient } = await connectRpc()
        const decoded = await decodeInvoice(invoice)
        const lookUp = await lnRpcClient.lookupInvoice({ rHashStr: decoded.paymentHash })
        return lookUp
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error)
    }
}

const getFeeReport = async () => {
    try {
        const { lnRpcClient, routerClient } = await connectRpc()
        return await lnRpcClient.feeReport()
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error)
    }
}

const payInvoice = async (invoice) => {
    try {
        const { lnRpcClient, routerClient } = await connectRpc()
        const invoicePay = await routerClient.sendPaymentV2({ paymentRequest: invoice, timeoutSeconds: 360 })
        return invoicePay
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error)
    }
}

module.exports = {
    createInvoice,
    lookUpInvoiceHash,
    decodeInvoice,
    invoiceLookup,
    getFeeReport,
    payInvoice
}