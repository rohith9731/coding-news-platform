const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register Page
router.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
});

// Login Page
router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

// Register Logic
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.render('register', { error: 'User already exists', title: 'Register' });
        }
        user = new User({ username, email, password });
        await user.save();
        req.session.userId = user._id; // Auto login
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.render('register', { error: 'Server Error', title: 'Register' });
    }
});

// Login Logic
router.post('/login', async (req, res) => {
    console.log('Login attempt:', req.body);
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        console.log('User found:', user ? user.username : 'No user found');

        if (!user) {
            return res.render('login', { error: 'Invalid credentials', title: 'Login' });
        }
        const isMatch = await user.matchPassword(password);
        console.log('Password match:', isMatch);

        if (!isMatch) {
            return res.render('login', { error: 'Invalid credentials', title: 'Login' });
        }
        req.session.userId = user._id;
        req.session.username = user.username; // Store for display
        console.log('Session set for user:', user.username);
        res.redirect('/');
    } catch (err) {
        console.error('Login Error:', err);
        res.render('login', { error: 'Server Error', title: 'Login' });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

// DEBUG: View all users
router.get('/debug-users', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
