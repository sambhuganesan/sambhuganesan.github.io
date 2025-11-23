require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// CORS middleware - IMPORTANT for GitHub Pages to access your API
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Or specify your GitHub Pages URL
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// JSON parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (optional, since your HTML will be on GitHub Pages)
app.use(express.static(__dirname));

// API endpoint for Firebase config
app.get('/api/config', (req, res) => {
    res.json({
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID
    });
});

// API endpoint for admin authentication
app.post('/api/verify-admin', (req, res) => {
    const { password } = req.body;
    const isValid = password === process.env.ADMIN_PASSWORD;
    res.json({ isValid });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});