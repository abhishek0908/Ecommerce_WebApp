const express = require("express"); 
const { User, Product,Order,Transaction } = require("../db/index");
const router = express.Router(); 
const bycrypt = require('bcryptjs');
const { secretKey } = require("../config");
const jwt = require('jsonwebtoken')
const {userMiddleware} = require('../middleware/usermiddle')
//User Registration
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body; // Destructure req.body

        const user = new User({
            username,
            email,
            password
        });

        await user.save();
        res.send("User Created Successfully");
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send("Internal Server Error");
    }
});

////User Loginś
router.post('/login',async(req,res)=>{
    try{
    const {email,password,username} = req.headers;
    const user = await User.findOne().or([{ email: email }, { username: username }]);
   
    if(!user){
        return res.send("User Doesn't Exists");
    }
    const isMatch = await bycrypt.compare(password, user.password);
    if(!isMatch){
        return res.send("password is Wrong")
    }
    console.log(username,secretKey)
    const token = jwt.sign({username},secretKey);
    console.log(token)
    res.status(200).json({
        "Login Successfully Here is a token":token
    })
}
catch(error)
{
    res.status(404).send("Internal Server Error")
}
})


router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body; // Destructure req.body

        const user = new User({
            username,
            email,
            password
        });

        await user.save();
        res.send("User Created Successfully");
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send("Internal Server Error");
    }
});

////User Login
router.post('/login',async(req,res)=>{
    try{
    const {email,password,username} = req.headers;
    const user = await User.findOne().or([{ email: email }, { username: username }]);
   
    if(!user){
        return res.send("User Doesn't Exists");
    }
    const isMatch = await bycrypt.compare(password, user.password);
    if(!isMatch){
        return res.send("password is Wrong")
    }
    res.status(200).send("Login Successfully")
}
catch(error)
{
    res.status(404).send("Internal Server Error")
}
})
//Buy a product
router.post('/buyproduct/:product_id',userMiddleware,async (req, res) => {
    const { product_id } = req.params;
    const { user_id, quantity } = req.body;
  
    // Lookup the product
    const product = await Product.findById(product_id);
    if (!product) {
      return res.send("Product Not Found");
    }
  
    // Lookup the user
    const user = await User.findById(user_id);
    if (!user) {
      return res.send("User Not Found");
    }
  
    // Calculate total amount
    const totalamount = product.price * quantity;
  
    const order = new Order({
      user_id: user_id,
      product: {
        product_id: product_id,
        quantity: quantity,
        totalamount: totalamount,
      },
    });
  
    let savedOrder;
    try {
      savedOrder = await order.save();
      console.log('Saved Order:', savedOrder);
    } catch (error) {
      console.error('Error saving order:', error);
      return res.send('Error placing order');
    }
  
    // Create and save the transaction
    const transaction = new Transaction({
      orderId: savedOrder._id,
      paymentMethod: 'CreditCard',
      amount: totalamount,
      status: 'Done',
    });
  
    let savedTransaction;
    try {
      savedTransaction = await transaction.save();
      console.log('Saved Transaction:', savedTransaction);
    } catch (error) {
      console.error('Error saving transaction:', error);
      return res.send('Error processing payment');
    }
  
    // Update the order with the transaction ID
    savedOrder.transaction_id = savedTransaction._id;
    try {
      const updatedOrder = await savedOrder.save();
      console.log('Updated Order:', updatedOrder);
    } catch (error) {
      console.error('Error updating order:', error);
    }
  
    res.send('Congratulations! Your order is placed');
  });
  

//Get Your Products -> Orderd one 
router.get('/purchasedorder',userMiddleware,async(req,res)=>{
  const {user_id} = req.headers;
    try{
    const orders = await Order.find({user_id:user_id})
    res.json(orders)
    }
    catch(error)
    {
        res.send("Internal Error")
    }
})
module.exports = router;
