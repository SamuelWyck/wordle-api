const {Router} = require("express");
const utilController = require("../controllers/utilController.js");



const utilRoute = Router();


utilRoute.get("/ping", utilController.serverPing);



module.exports = utilRoute;