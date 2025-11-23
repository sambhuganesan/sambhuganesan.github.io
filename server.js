// Remove or comment out this line:
// require('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// API endpoint for Firebase config
app.get('/api/config', (req, res) => {
    const config = {
        apiKey: process.env.FIREBASE_CLIENT_API_KEY,
        authDomain: process.env.FIREBASE_CLIENT_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_CLIENT_PROJECT_ID,
        storageBucket: process.env.FIREBASE_CLIENT_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_CLIENT_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_CLIENT_APP_ID,
        measurementId: process.env.FIREBASE_CLIENT_MEASUREMENT_ID
    };

    res.json(config);
});

// API endpoint for admin authentication
app.post('/api/verify-admin', (req, res) => {
    console.log('=== VERIFY ADMIN HIT ===');
    console.log('ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD);
    const { password } = req.body;
    const isValid = password === process.env.ADMIN_PASSWORD;
    console.log('Password valid:', isValid);
    res.json({ isValid });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`=== SERVER STARTED ===`);
    console.log(`Server running on port ${PORT}`);
    console.log('Available env vars:', Object.keys(process.env).filter(k => k.startsWith('FIREBASE') || k === 'ADMIN_PASSWORD'));
    console.log('FIREBASE_CLIENT_API_KEY:', process.env.FIREBASE_CLIENT_API_KEY || 'NOT FOUND');
    console.log('ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD || 'NOT FOUND');
});