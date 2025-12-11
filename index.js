const express = require('express');
const { default: mongoose } = require('mongoose');
const app = express();
require('dotenv').config();
const User = require('./models/user.model');
const bcrypt = require('bcrypt');
const authRouter = require('./routes/auth.route');
const userRouter = require('./routes/user.route');

// connect to mongoDB
(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');

        // default admin setup
        const user = await User.findOne({ userId: "admin" });

        if (!user) {
            console.log('Admin not present');
            // let's create a new admin
            const admin = await User.create({
                name: "Arjun",
                userId: 'admin',
                email: "arjunkorde2004@gmail.com",
                userType: "ADMIN",
                password: bcrypt.hashSync('arjun', 10)
            });
            console.log("admin created: ", admin);

        } else {
            console.log('Admin already present');
        }


    } catch (err) {
        console.log("Error while mongoDB connection: ", err);

    }
})();

// To parse json type of request
app.use(express.json());

// attach routers
app.use('/api/v1', authRouter);
app.use('/api/v1', userRouter);

app.get('/', (req, res) => {
    console.log('Hit / route');
    res.json({ message: "welcome to home route" });
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
    console.log(`server listening on http://localhost:${PORT}`);
});