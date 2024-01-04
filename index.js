const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const adminRouter = require('./routes/admin');
const userRouter = require('./routes/user');
// Middleware
app.use(bodyParser.json());

// Routes
app.use("/user", userRouter);
app.use("/admin", adminRouter);


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
