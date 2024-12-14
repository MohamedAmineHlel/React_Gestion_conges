const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authenticateToken = require('./middleware/authenticate');
const authRoutes = require('./routes/auth');
const detailUser = require('./routes/detailuser');
const user = require('./routes/user');
const congeRoutes = require('./routes/conge');
const pauseRoutes = require('./routes/pause');
const postRoutes = require('./routes/post'); 
const timesheetRoutes = require('./routes/timesheet');
const notificationRoutes = require('./routes/notification');
const performanceEvaluationRoutes = require('./routes/performanceEvaluation');
const swaggerDoc = require('./swagger');
const dashboardRouter = require('./routes/dashboard');

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Enable CORS
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());

// Use the auth routes for handling authentication
app.use('/auth',authRoutes);
app.use('/user',user);
app.use('/detailuser',detailUser);
app.use('/conge', congeRoutes);
app.use('/pause', pauseRoutes);
app.use('/posts', postRoutes);
app.use('/timesheets', timesheetRoutes);
app.use('/notifications', notificationRoutes);
app.use('/evaluation', performanceEvaluationRoutes);
app.use('/dashboard', dashboardRouter);

// Swagger documentation route
app.use('/api-docs', swaggerDoc.serve, swaggerDoc.setup);

// Set view engine to EJS
app.set('view engine', 'ejs');

// Set the views directory for EJS templates
app.set('views', './views');

// Serve register page
app.get('/register', (req, res) => {
    res.render('register');
});

// Serve login page
app.get('/', (req, res) => {
    res.render('login');
});

// Connect to MongoDB and start the server
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err.message);
    });
