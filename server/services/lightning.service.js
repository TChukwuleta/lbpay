const lnrpc = require("@radar/lnrpc")
const ApiError = require("../helper/ApiError")
require("dotenv").config()

const connectRpc = async () => {
    try {
        const host = process.env.LND_RPC_URL
        const macaroon = process.env.LND_MACAROON
        const cert = process.env.LND_RPC_PATH

        const lnRpcClient = await lnrpc.createLnRpc({
            server: host,
            cert: Buffer.from(cert, 'hex').toString('utf-8'),
            macaroon
        })
        
        const routerClient = await lnrpc.createRouterRpc({
            server: host,
            cert: Buffer.from(cert, 'hex').toString('utf-8'),
            macaroon
            // there is macaroon path
        })
        const pubkey = await lnRpcClient.getInfo()
        //console.log(pubkey.identityPubkey)
        return { lnRpcClient, routerClient }
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error)
    }
}

const connectBobRpc = async () => {
    try {
        const host = process.env.BOB_LND_RPC_URL
        const macaroon = process.env.BOB_LND_MACAROON
        const cert = process.env.BOB_LND_RPC_PATH

        const lnRpcClient = await lnrpc.createLnRpc({
            server: host,
            cert: Buffer.from(cert, 'hex').toString('utf-8'),
            macaroon
        })
        
        const routerClient = await lnrpc.createRouterRpc({
            server: host,
            cert: Buffer.from(cert, 'hex').toString('utf-8'),
            macaroon
            // there is macaroon path
        })
        const pubkey = await lnRpcClient.getInfo()
        //console.log(pubkey.identityPubkey)
        return { lnRpcClient, routerClient }
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error)
    }
}

const createInvoice = async (amount) => {
    try {
        console.log(amount.amount)
        const { lnRpcClient, routerClient } = await connectRpc()
        const invoice = await lnRpcClient.addInvoice({ value: amount.amount.toString() })
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

const lookUpInvoiceHash = async (data) => {
    const { lnRpcClient, routerClient } = await connectRpc()
    console.log(data)
    const rHash = Buffer.from(data.hash, 'base64')
    const { settled } = await lnRpcClient.lookupInvoice({ rHash });
    if(!settled){
        throw new Error("The payment has not been made!")
    }
    return settled
}

// const lookUpInvoiceHash = async (data) => {
//     try {
//         const { lnRpcClient, routerClient } = await connectRpc()
//         const key = await lnRpcClient.getInfo()
//         console.log(key)
//         console.log("friyoyo")
//         const rHash = Buffer.from(data.Hash, 'base64')
//         console.log(rHash) 
//         console.log("Hello")
//         const { settled } = await lnRpcClient.lookupInvoice({ rHash })
//         if(!settled) throw new ApiError(400, "Payment has not been made")
//         return settled
//     } catch (error) {
//         throw new ApiError(error.code || 500, error.message || error)
//     }
// }

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
        console.log("Pre")
        const decoded = await decodeInvoice(invoice)
        console.log("Step one")
        console.log(decoded) 
        console.log("Step two")
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
        const { lnRpcClient, routerClient } = await connectBobRpc()
        console.log("gotten here")
        //const test = await routerClient.sendPayment({ paymentHash: invoice, timeoutSeconds: 360 })
        //console.log(test)
        // const first = await lnRpcClient.sendPayment({ paymentRequest: invoice })
        // console.log("First test")
        // console.log(first)
        const invoicePay = await routerClient.sendPaymentV2({ paymentRequest: invoice })
        console.log("Payment test two")
        console.log(invoicePay)
        return JSON.parse(JSON.stringify(invoicePay))
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error)
    }
}

const subscribeToInvoice = async (invoice) => {
    try {
        const { lnRpcClient, routerClient } = await connectRpc()
        const subscribe = await lnRpcClient.subscribeInvoices({ addIndex: invoice.addIndex })
        subscribe.on('data', async (response) => {
            const paymentValue = Number(response.value)
            // convert satoshi to BTC
            const btcValue = paymentValue / 100000000
            if(response.settled){
                return response
            }
            else{
                console.log(response)
                throw new ApiError(400, "an error occured")
            }
        })
    } catch (error) {
        
    }
}

module.exports = {
    createInvoice,
    lookUpInvoiceHash,
    decodeInvoice,
    invoiceLookup, 
    getFeeReport,
    payInvoice,
    connectRpc
}