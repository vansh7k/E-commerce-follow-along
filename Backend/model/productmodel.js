const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    ProductName:{
        Type:String,
        required:true
    },
    ProductDescription:{
        Type:String,
        required:true
    },
    ProductPrice:{
        Type:Number,
        required:true
    },
    ProductImages:{
        Type:[String],
        required:true
    }
});

const productModel = mongoose.model("productCollection",productSchema);

module.exports = {productModel};