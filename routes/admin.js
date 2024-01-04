const express = require("express"); 
const { User,Admin, Product } = require("../db/index");
const router = express.Router(); 
const {adminMiddleware}= require('../middleware/adminmiddle')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const secretKey = require('../config')
//Admin Registration
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body; // Destructure req.body

        const user = new Admin({
            username,
            email,
            password
        });

        await user.save();
        res.send("Admin Created Successfully");
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send("Internal Server Error");
    }
});

////User Login
router.post('/login',async(req,res)=>{
    try{
    const {email,password,username} = req.headers;
    const user = await Admin.findOne().or([{ email: email }, { username: username }]);
   
    if(!user){
        return res.send("Email or Username Doesn't Exists");
    }
    console.log(password,user.password)
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch)
    if(!isMatch){
        return res.send("password is Wrong")
    }
    const token = jwt.sign({username},secretKey);
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

//User Login
router.post('/login',async(req,res)=>{
    try{
        const {email,password,username} = req.headers;
        const user = await Admin.findOne().or([{ email: email }, { username: username }]);
       
        if(!user){
            return res.send("Admin Doesn't Exists");
        }
        const isMatch = await bycrypt.compare(password, user.password);
        if(!isMatch){
            return res.send("Password is Wrong")
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

//Add Product 
router.post('/addproduct',adminMiddleware,async(req,res)=>{
    const {name,description,price,category} = req.body
    const{listedby} = req.headers
    const product = new Product({
        name:name,
        description:description,
        price:price,
        category:category,
        listedby:listedby
    })
    await product.save();
    res.send("Product Added Successfully")
})

//delete product
router.post('/updateproduct',adminMiddleware, async (req, res) => {
    try {
      const { name, description, price, category, listedby } = req.body;
      const { product_id } = req.headers;

      const product = await Product.findById(product_id);
      if (!product) {
        return res.status(404).send("Product not found");
      }
  

      console.log(product.listedby.toString(), " ", listedby);
      
      if (product.listedby.toString()!==listedby) {
        return res.status(403).send("You are not authorized user to update this product");
      }
  
      // Update the product
      await Product.updateOne(
        { _id: product_id },
        { $set: { name, description, price, category } }
      );
  
      res.send("Product updated successfully");
    } catch (err) {
      console.error("Error updating product:", err);
      res.status(500).send("Internal Server Error");
    }
  });
  

router.post('/deleteproduct',adminMiddleware,async(req,res)=>{
        const{listedby} = req.body;
        const{product_id} = req.headers;
        const product = await Product.findById(product_id);
        if(!product){
            return res.send("Product not found");
        }
        if(product.listedby.toString()!==listedby)
        {
            return res.send("You are not authorize to delete this")
        }
        await Product.deleteOne(product)
        res.send("Product deleted Successfully")
})  

router.get('/allproduct',adminMiddleware,async(req,res)=>{
    const listed_product = await Product.find({});
    res.json({listed_product})
})
module.exports = router;
