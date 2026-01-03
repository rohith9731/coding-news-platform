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
            secret: process.env.SESSION_SECRET,
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

    app.use('/auth', authRoutes);
    app.use('/article/:id/review', reviewRoutes);
    app.use('/feedback', feedbackRoutes);

    app.get('/', async (req, res) => {
        const articles = await fetchNews();
        const feedbackSuccess = req.query.feedback === 'success';
        res.render('index', { title: 'DevNews', articles: articles, feedbackSuccess });
    });

    app.get('/trends', async (req, res) => {
        // ideally fetch different news or sorted by popularity
        const articles = await fetchNews();
        res.render('trends', { title: 'Trending', articles: articles });
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
