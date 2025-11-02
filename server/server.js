require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { Server } = require('socket.io');

// Middleware
const { jwtAuthMiddleware } = require('./middlewares/jwtAuthMiddleware');

// Socket handlers
const { initSocketHandlers } = require('./utils/socket');

// Routes
const userRoutes = require('./routes/userRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

// Error Handler
const { errorHandler } = require('./middlewares/errorHandler.js');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// ✅ Environment-based HOST
const HOST =
  process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

// ✅ Dynamic origins
const getOriginsFromEnv = (envKey) =>
  process.env[envKey]?.split(',').map(o => o.trim()) || [];

const FRONTEND_ORIGIN =
  process.env.NODE_ENV === 'production'
    ? getOriginsFromEnv('FRONTEND_ORIGIN_PROD')
    : getOriginsFromEnv('FRONTEND_ORIGIN_DEV');

const io = new Server(server, {
  cors: {
    origin: FRONTEND_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// ✅ Middlewares
app.use(cookieParser());
app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ✅ Static folder for complaint images
// app.use("/uploads", express.static("./uploads"));

// ✅ Routes
// app.use('/api/users', userRoutes);
// app.use('/api/complaints', jwtAuthMiddleware, complaintRoutes);
// app.use('/api/categories', jwtAuthMiddleware, categoryRoutes);

// ✅ Root route checker
app.get('/', (req, res) => {
  res.send('CivicMind Backend Running ✅');
});

// ✅ Socket namespace for real-time status/notifications
// const civicmind_socket = io.of('/complaints/updates');
// initSocketHandlers(civicmind_socket);

// ✅ Error handler (must be last)
// app.use(errorHandler);

// ✅ Start server
server.listen(PORT, HOST, () => {
  console.log(`✅ Server running at http://${HOST}:${PORT}`);
});

module.exports = app;
