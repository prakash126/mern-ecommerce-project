const express = require("express");

const router = express.Router();

const {isAuthenticated,isSignedIn,isAdmin} = require('../controllers/auth');
const {getUserById,pushOrderInPurchaseList} = require('../controllers/user')
const {updateStock} = require("../controllers/product");

const {orderById,createOrder,getAllOrders,updateOrderStatus,getOrderStatus} = require("../controllers/order");

// prarms
router.param("userId",getUserById);
router.param("orderId",orderById);

// actual routes

// create routes
router.post("/order/create/:userId",isSignedIn,isAuthenticated,pushOrderInPurchaseList,updateStock,createOrder)

// read routes

router.get("/order/all/userId",isSignedIn,isAuthenticated,isAdmin,getAllOrders);

// status of order
router.get("/order/status/:userId",isSignedIn,isAuthenticated,isAdmin,getOrderStatus)
router.put("/order/:orderId/status/:userId",isSignedIn,isAuthenticated,isAdmin,updateOrderStatus)
module.exports = router;