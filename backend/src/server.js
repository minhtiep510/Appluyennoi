const http = require('http');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const apiRoutes = require('./routes/api');
const initPracticeSocket = require('./socket/practiceSocket');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Middlewares
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Luyện giao tiếp AI Backend API & Real-time Socket.IO is running!' });
});

// Khởi tạo Socket.IO cho Luyện nói Real-time
initPracticeSocket(server, CLIENT_URL);

server.listen(PORT, () => {
  console.log(`🚀 Server & Real-time Socket.IO running on http://localhost:${PORT}`);
});
