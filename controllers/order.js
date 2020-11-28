const {Order,ProductCart} = require("../models/order");

exports.orderById = (req,res,next,id)=>{
    Order.findById(id)
    .populate("products.product","name price")
    .exec((err,order)=>{
        if(err){
            return res.status(400).json({
                error:"NO Order Found in DB"
            })
        }
        req.order=order;
        next();
    })
}

exports.createOrder = (req,res)=>{
    req.body.order.user = req.profile // coming from params

    const order = new Order(req.body.order)

    order.save((err,order)=>{
        if(err){
            return res.status(400).json({
                error: "Failed to save your order in DB"
            });
        }
        res.json(order);
    });
};

exports.getAllOrders = (req,res)=>{
    Order.find()
    .populate("user","_id name ")
    .exec((err,orders)=>{
        if(err){
            return res.status(400).json({
                error:"NO orders Data Found in DB"
            })
        }
        res.json(orders);
    })
}

exports.getOrderStatus = (req,res)=>{
    // TODO
    res.json(Order.schema.path("status").enumValues);
};

exports.updateOrderStatus = (req,res)=>{
    Order.update(
        {_id:req.body.orderId},
        {$set:{status:req.body.status}},
        (err,order)=>{
            if(err){
                return res.status(400).json({
                    error:"Cannot update  order Status"
                })
            }
            res.json(order);
        }
    )
};