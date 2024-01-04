const mongoose = require('mongoose');
const allowedCategories = ['Fashion', 'Mobile', 'Watches', 'Electronics'];
const {Admin} = require('./Users')
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: allowedCategories
    },
    listedby:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        default: '65956f2e5c481f181f999423'
    }
});


const Product = mongoose.model('Product', productSchema);

module.exports = {
    Product
};
