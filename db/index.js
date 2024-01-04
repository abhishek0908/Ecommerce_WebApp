const {Product} = require('./Products')
const {User,Admin} = require('./Users')
const {Order,Transaction} = require('./Orders')
const mongoose  = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/EcommerceApp')
    .then(() => {
        console.log("Connected with MongoDB");
    })
    .catch(() => {
        console.log("Failed to connect with MongoDB");
    });
module.exports={
    User,Product,Admin,Transaction,Order
}