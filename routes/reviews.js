const express = require('express');
const router = express.Router({ mergeParams: true }); // Access :id from parent route
const Review = require('../models/Review');

router.post('/', async (req, res) => {
    const articleId = req.params.id;
    const { rating, comment } = req.body;

    if (!req.session.userId) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const review = new Review({
            articleId,
            user: req.session.userId,
            rating,
            comment
        });
        await review.save();
        res.redirect(`/article/${articleId}`);
    } catch (err) {
        console.error(err);
        res.redirect(`/article/${articleId}?error=Could not save review`);
    }
});

module.exports = router;
