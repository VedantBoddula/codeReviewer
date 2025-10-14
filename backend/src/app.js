// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const aiRoutes = require('./routes/ai.routes');
const userRoutes = require('./routes/user.routes'); // ✅ new file for signup/login

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)

.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Default route
app.get('/', (req, res) => {
    res.send("Hello, World! MongoDB Connected ✅");
});

// ✅ Routes
app.use('/ai', aiRoutes);
app.use('/user', userRoutes); // for login/signup routes


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


module.exports = app;
