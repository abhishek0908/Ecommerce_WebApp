const mongoose = require('mongoose');
const {User}  = require('./Users')
const {Product}  = require('./Products')

const TransactionSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    paymentMethod: String,
    amount: { type: Number, required: true },
    status: { type: String, default: 'Pending' },
});

const OrderSchema =  mongoose.Schema({
    user_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required:true
    },
    product :
        {
            product_id : {
                type:mongoose.Schema.Types.ObjectId,
                ref : 'Product',
                required:true
            },
            quantity : {
                type:Number,
                default:1
            },
            status : {
                type:String,
                enum : ['Initiated','Processing','On The Way','Delivered'],
                default:'Initiated'
            },
        },
        transation_id:{
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Transaction',
        }
})


const Order = mongoose.model('Order',OrderSchema)
const Transaction = mongoose.model('Transaction',TransactionSchema)

module.exports={
    Order,
    Transaction
}