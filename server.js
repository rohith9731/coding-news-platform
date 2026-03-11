const express = require('express');
const path = require('path');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3002;

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Database
const connectDB = require('./config/db');

// Session
const session = require('express-session');
const MongoStore = require('connect-mongo').MongoStore || require('connect-mongo');

const startServer = async () => {
    // Connect to DB (Local or Embedded)
    const mongoUri = await connectDB();

    // Session
    const session = require('express-session');
    const MongoStore = require('connect-mongo').MongoStore || require('connect-mongo');

    try {
        app.use(session({
            secret: process.env.SESSION_SECRET || 'my_super_secret_fallback_key',
            resave: false,
            saveUninitialized: false,
            store: MongoStore.create({ mongoUrl: mongoUri })
        }));
    } catch (err) {
        console.error('Session Setup Error:', err);
    }

    // Global Variables
    app.use((req, res, next) => {
        res.locals.user = req.session.userId ? { username: req.session.username, id: req.session.userId } : null;
        next();
    });



    // Routes
    const authRoutes = require('./routes/auth');
    const { fetchNews, getArticleById } = require('./services/newsService');
    const reviewRoutes = require('./routes/reviews');
    const feedbackRoutes = require('./routes/feedback');
    const Review = require('./models/Review');
    const User = require('./models/User');

    app.use('/auth', authRoutes);
    app.use('/article/:id/review', reviewRoutes);
    app.use('/feedback', feedbackRoutes);

    app.get('/favorites', async (req, res) => {
        if (!req.session.userId) return res.redirect('/auth/login');

        try {
            const user = await User.findById(req.session.userId);
            res.render('trends', {
                title: 'My Favorites',
                articles: user.favorites || [],
                // Passing a flag to potentially reuse trends view or create a specific favorites view
            });
        } catch (err) {
            console.error(err);
            res.status(500).send('Error loading favorites');
        }
    });

    app.post('/favorites', async (req, res) => {
        if (!req.session.userId) return res.status(401).json({ success: false, message: 'Please login to save favorites' });

        try {
            const { article } = req.body; // Expect full article object or ID + details
            const user = await User.findById(req.session.userId);

            // Check if already favorites
            const existingIndex = user.favorites.findIndex(fav => fav.id === article.id);

            if (existingIndex > -1) {
                // Remove
                user.favorites.splice(existingIndex, 1);
            } else {
                // Add
                user.favorites.push(article);
            }

            await user.save();
            res.json({ success: true, isFavorite: existingIndex === -1 });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Error updating favorites' });
        }
    });

    // Article counts per category (static approximate counts for sidebar badges)
    const CATEGORY_COUNTS = {
        all: 30, 'machine-learning': 12, 'full-stack': 14, 'gen-ai': 18,
        python: 16, webdev: 20, startups: 8, devops: 11, cloud: 9, react: 15, javascript: 22
    };

    app.get('/', async (req, res) => {
        const limit = req.session.userId ? 100 : 30;
        const articles = await fetchNews('programming', limit);
        const feedbackSuccess = req.query.feedback === 'success';
        res.render('index', { title: 'DevNews', articles, feedbackSuccess, currentTag: 'all', articleCounts: CATEGORY_COUNTS });
    });

    app.get('/trends', async (req, res) => {
        const limit = req.session.userId ? 100 : 30;
        const articles = await fetchNews('programming', limit);
        res.render('trends', { title: 'Trending', articles });
    });

    app.get('/category/:tag', async (req, res) => {
        const tag = req.params.tag;
        const limit = req.session.userId ? 100 : 30;
        const articles = await fetchNews(tag, limit);
        const title = tag.charAt(0).toUpperCase() + tag.slice(1) + ' News';
        res.render('index', { title, articles, feedbackSuccess: false, currentTag: tag, articleCounts: CATEGORY_COUNTS });
    });

    app.get('/article/:id', async (req, res) => {
        const article = await getArticleById(req.params.id);
        if (!article) return res.status(404).send('Article not found');

        // Fetch reviews for this article
        const reviews = await Review.find({ articleId: req.params.id }).populate('user', 'username');

        res.render('article', { title: article.title, article: article, reviews: reviews });
    });

    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
};

startServer();
