require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.send('API is running.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
