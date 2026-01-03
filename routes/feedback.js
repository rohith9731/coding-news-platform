const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

router.post('/', async (req, res) => {
    const { message } = req.body;
    try {
        const feedback = new Feedback({
            userId: req.session.userId || null,
            message
        });
        await feedback.save();
        res.redirect('/?feedback=success');
    } catch (err) {
        console.error(err);
        res.redirect('/?feedback=error');
    }
});

module.exports = router;
