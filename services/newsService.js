const axios = require('axios');

const fetchNews = async () => {
    try {
        const response = await axios.get('https://dev.to/api/articles?tag=programming&top=1&per_page=6');
        return response.data.map(article => ({
            id: article.id,
            title: article.title,
            summary: article.description,
            content: article.body_html || article.description, // dev.to returns body_html or markdown
            author: article.user.name,
            date: new Date(article.published_at).toDateString(),
            tags: article.tag_list,
            image: article.cover_image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000', // content image fallback
            url: article.url // Original link
        }));
    } catch (error) {
        console.error('Error fetching news:', error.message);
        return []; // Return empty array or fallback data
    }
};

const getArticleById = async (id) => {
    try {
        const response = await axios.get(`https://dev.to/api/articles/${id}`);
        const article = response.data;
        return {
            id: article.id,
            title: article.title,
            summary: article.description,
            content: article.body_html || article.description,
            author: article.user.name,
            date: new Date(article.published_at).toDateString(),
            tags: article.tags,
            image: article.cover_image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000',
            url: article.url
        };
    } catch (error) {
        console.error(`Error fetching article ${id}:`, error.message);
        return null;
    }
};

module.exports = { fetchNews, getArticleById };
