const Product =  require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const { sortBy } = require("lodash");
const category = require("../models/category");

// middleware
exports.getProductById = (req,res,next,id)=>{
    Product.findById(id)
    .populate("category")
    .exec((err,product)=>{
        if(err){
           return res.status(400).json({
                error:'Product not Found'
            })
        }
        req.product=product;
        next();
    })
   
}

// create controller
exports.createProduct = (req,res)=>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    
    form.parse(req,(err,fields,file)=>{
        if(err){
            return res.status(400).json({
                error:"Problem with Image"
            })
        }

        // destructures the fields
        const {name,description,price,category,stock,} = fields;

        if(!name || !description || !price || !category || !stock){
            return res.status(400).json({
                error:"Please include all fields"
            })
        }

        //TODO: restrictions on field
        let product = new Product(fields)

        // handle file here
        if(file.photo){
            if(file.photo.size>3000000){
                return res.status(400).json({
                    error:"File size too big!"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;

        }
        // save to the db

        product.save((err,product)=>{
            if(err){
                return res.status(400).json({
                    error:"Saving tshirt in DB failed"
                })
            }
            res.json(product);
        })
    })
};

exports.getProduct = (req,res)=>{
    Product.find().exec((err,product)=>{
        if(err){
            return res.status(400).json({
                error:"Products not find"
            })
        }
        product.photo = undefined
        res.json(product);
    })
};

// update controller
exports.updateProduct = (req,res,id)=>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    
    form.parse(req,(err,fields,file)=>{
        if(err){
            return res.status(400).json({
                error:"Problem with Image"
            })
        }

        // updation code
        let product = req.product;
        product = _.extend(product,fields)


        // handle file here
        if(file.photo){
            if(file.photo.size>3000000){
                return res.status(400).json({
                    error:"File size too big!"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;

        }
        // save to the db

        product.save((err,product)=>{
            if(err){
                return res.status(400).json({
                    error:"Updation of  product in DB  failed"
                })
            }
            res.json(product);
        })
    })
}

// delete controller
exports.deleteProduct = (req,res)=>{
    let product = req.product;
    product.remove((err,deletedProduct)=>{
        if(err){
            return res.status(400).json({
                error:"Failed to delete the product"
            })
        }
        res.json({
            message:"Deletion was success",
            deleteProduct
        })
    })
}

exports.getAllProducts = (req,res)=>{
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy,"asc"]])
    .limit(limit)
    .exec((err,products)=>{
        if(err){
            return res.status(400).json({
                error:"Products not found"
            })
        }
        res.json(products);
    })
}


// middleware
exports.photo = (req,res,next)=>{
    if(req.product.photo.data){
        res.set("Content-Type",req.product.photo.contentType);
        return res.send(req.product.photo.data)
    }
    next();
};


exports.getAllUniqueCategories = (req,res)=>{
    Product.distinct("category",{},(err,category)=>{
        if(err){
            return res.status(400).json({
                error:"NO Category Found"
            })
        }
        res.json(category);
    })
}

exports.updateStock = (req,res,next)=>{
    let myOperations = req.body.order.products.map(prod => {
        return {
            updateOne:{
                filter: {_id:prod._id},
                update:{$inc:{stock: -prod.count,sold: +prod.count}}
            }
        }
    })

    Product.bulkWrite(myOperations,{},(err,products)=>{
        if(err){
            return res.status(400).json({
                error:"BULK operation failed"
            });
        }
        next();
    })
};


