// server.js
// SE-AWARE backend — Node.js + Express + MySQL
// Created by: Juan Paolo Dente

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const moduleRoutes = require('./routes/modules');
const quizRoutes = require('./routes/quizzes');
const dashboardRoutes = require('./routes/dashboard');
const assessmentRoutes = require('./routes/assessments');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/assessment', assessmentRoutes);

// Fallback error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Group 4 API listening on port ${PORT}`));

module.exports = app;
