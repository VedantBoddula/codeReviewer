require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./src/app');

// ✅ Replace with your MongoDB Compass connection string
const mongoURI = 'mongodb://127.0.0.1:27017/codereviewer'; 

// ✅ Connect to MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch(err => console.error('❌ MongoDB Connection Failed:', err));

// ✅ Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
