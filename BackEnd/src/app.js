const express = require('express');
const aiRoutes = require('./routes/ai.routes')
const cors = require('cors')
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth.routes');
const reviewRoutes = require('./routes/review.routes');

const app = express()

app.use(cors())


app.use(express.json())

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.use('/ai', aiRoutes)
app.use('/auth', authRoutes);
app.use('/review', reviewRoutes);

module.exports = app