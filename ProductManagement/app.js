const express = require('express')
const cors = require('cors')
const { product, appEvents } = require('./api')
const Table = require('cli-table')
const listAllRoutes = require('express-list-endpoints')
const handleErrors = require('./utils/error-handler')


module.exports = async (app) => {
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(cors("*"))
    app.use(express.static(__dirname + '/public'))

    // Listen to Events
    appEvents(app)

    // API
    product(app)

    // Error handling
    app.use(handleErrors) 
  
    let routesList = listAllRoutes(app)
    routesList = routesList.map((route) => {
        const obj = {}
        obj[route.path] = route.methods.join(" | ")
        return obj
    })
    const table = new Table()
    table.push({ Endpoints: "Methods" }, ...routesList)
    console.log(table.toString())
}