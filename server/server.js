require('dotenv').config();
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Server } = require('socket.io');
const morgan = require('morgan');
const { jwtAuthMiddleware } = require('./middlewares/jwtAuthMiddleware');
const cookieParser = require('cookie-parser');
const { initSocketHandlers } = require('./utils/socket');
require('./utils/autoUpdateExamStatus'); // For auto-updating past exams status
require('./utils/autoliveExamStatus'); // For auto-updating live status

// Import Routes
const userRoutes = require('./routes/userRoutes');
const examRoutes = require('./routes/examRoutes');
const questionsRoutes = require('./routes/questionRoutes');


// Initialize the app
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;

const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

// Function to get origins from environment variables
const getOriginsFromEnv = (envVar) =>
  process.env[envVar]?.split(',').map(origin => origin.trim()) || [];

const FRONTEND_ORIGIN =
  process.env.NODE_ENV === 'production'
    ? getOriginsFromEnv('FRONTEND_ORIGIN_PROD')
    : getOriginsFromEnv('FRONTEND_ORIGIN_DEV');


const io = new Server(server, {
  cookie: true,
  cors: {
    origin: FRONTEND_ORIGIN, // Allow frontend origin
    methods: ['GET', 'POST'], // Specify HTTP methods
    credentials: true, // Allow credentials (cookies)
  },
});

// Middlewares
app.use(cookieParser());
app.use(
  cors({
    origin: FRONTEND_ORIGIN, // Update this to your frontend URL deployed on Render
    credentials: true, // Allow cookies to be sent
  })
);

app.use(express.json());
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true })); // Handle form-data requests properly

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
// app.use("/uploads", express.static(path.resolve("./uploads")));

// Routes
app.use('/api/users', userRoutes, fileRoutes);
app.use('/api/token', tokenRoutes);
app.use('/api/exams', jwtAuthMiddleware, examRoutes, fileRoutes);


const start_exam = io.of('/exams/start-exam');

// Initialize Socket.IO handlers
initSocketHandlers(start_exam);

// Ensure a response for the root route
app.get('/', (req, res) => {
  res.send('Server is running!'); // Generic message for Render health checks
});

app.get('/api/security/stats', jwtAuthMiddleware, async (req, res) => {
  try {
    const stats = await ipGuardianService.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});


// Centralized error handling middleware
app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

module.exports = app;
