const axios = require('axios');

// ---- Fallback articles for when the API is unavailable ----
const fallbackArticles = {
    programming: [
        { id: 'f1', title: 'The Future of JavaScript: What\'s Coming in 2025', summary: 'Explore the upcoming ECMAScript proposals that will reshape how we write JavaScript — from pattern matching to pipe operators.', author: 'Alex Chen', date: 'Mon Mar 03 2026', tags: ['javascript', 'webdev'], image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&q=80&w=1000', url: '#' },
        { id: 'f2', title: 'Building Production-Ready APIs with Node.js and Express 5', summary: 'A comprehensive guide to structuring, securing, and scaling your Node.js REST APIs with the latest Express 5 features.', author: 'Sarah Mitchell', date: 'Sun Mar 02 2026', tags: ['nodejs', 'backend'], image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1000', url: '#' },
        { id: 'f3', title: 'React 19 Deep Dive: Server Components & New Hooks', summary: 'React 19 brings a paradigm shift. We dig into server components, the new use() hook, and how they change the way you think about data fetching.', author: 'James Okafor', date: 'Sat Mar 01 2026', tags: ['react', 'javascript'], image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1000', url: '#' },
        { id: 'f4', title: 'CSS Grid & Container Queries: The Layout Duo of 2025', summary: 'Modern CSS is more powerful than ever. Learn how grid and container queries replace the need for JavaScript-driven responsive layouts.', author: 'Priya Sharma', date: 'Fri Feb 28 2026', tags: ['css', 'webdev'], image: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&q=80&w=1000', url: '#' },
        { id: 'f5', title: 'TypeScript 5.5: Smarter Inference, Faster Builds', summary: 'TypeScript keeps getting better. This release brings isolated declarations, smarter narrowing, and dramatically faster build performance.', author: 'Tom Bradley', date: 'Thu Feb 27 2026', tags: ['typescript', 'javascript'], image: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&q=80&w=1000', url: '#' },
        { id: 'f6', title: 'Open Source in 2025: Trends, Challenges & Opportunities', summary: 'From corporate takeovers to thriving communities, open source development is evolving. Here\'s the state of the ecosystem.', author: 'Mei Lin', date: 'Wed Feb 26 2026', tags: ['opensource', 'community'], image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000', url: '#' },
    ],
    'machine-learning': [
        { id: 'ml1', title: 'GPT-5 Architecture Insights: What We Know So Far', summary: 'With GPT-5 on the horizon, researchers speculate on the architectural innovations OpenAI may deploy to push reasoning further.', author: 'Dr. Yuki Tanaka', date: 'Mon Mar 03 2026', tags: ['ai', 'llm'], image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&q=80&w=1000', url: '#' },
        { id: 'ml2', title: 'Fine-Tuning LLMs on Custom Datasets: A Practical Guide', summary: 'Stop paying for API calls — learn to fine-tune open-source models like Mistral and LLaMA on your own data for domain-specific tasks.', author: 'Ravi Patel', date: 'Sun Mar 02 2026', tags: ['llm', 'python'], image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&q=80&w=1000', url: '#' },
        { id: 'ml3', title: 'Reinforcement Learning from Human Feedback (RLHF) Explained', summary: 'RLHF is the secret sauce behind aligned AI models. Breaking down the math, the process, and how to implement it from scratch.', author: 'Elena Kovacs', date: 'Sat Mar 01 2026', tags: ['ml', 'rlhf'], image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1000', url: '#' },
        { id: 'ml4', title: 'Vector Databases: The Backbone of Modern AI Apps', summary: 'Pinecone, Weaviate, Chroma — which vector DB should you use? We benchmark them across latency, scalability, and developer experience.', author: 'Chris Morgan', date: 'Fri Feb 28 2026', tags: ['ml', 'databases'], image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000', url: '#' },
    ],
    'full-stack': [
        { id: 'fs1', title: 'Next.js 15 + Supabase: The Ultimate Full-Stack Setup', summary: 'From auth to real-time subscriptions — building a complete SaaS with the most productive stack of 2025.', author: 'Diego Reyes', date: 'Mon Mar 03 2026', tags: ['nextjs', 'supabase'], image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&q=80&w=1000', url: '#' },
        { id: 'fs2', title: 'tRPC vs REST vs GraphQL: Choosing Your API in 2025', summary: 'Each API pattern has a time and place. This comparison helps you pick the right tool for your next full-stack project.', author: 'Zara Williams', date: 'Sun Mar 02 2026', tags: ['api', 'fullstack'], image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000', url: '#' },
        { id: 'fs3', title: 'Monorepos with Turborepo: Scale Your Codebase Right', summary: 'Managing shared packages, coordinating builds, and keeping CI fast — Turborepo makes monorepo management painless.', author: 'Sam Torres', date: 'Sat Mar 01 2026', tags: ['monorepo', 'devops'], image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000', url: '#' },
        { id: 'fs4', title: 'Database-Per-Tenant Architecture for SaaS Apps', summary: 'Multi-tenancy done right. Explore strategies from row-level isolation to full database separation and when to use each.', author: 'Fatima Al-Hassan', date: 'Fri Feb 28 2026', tags: ['saas', 'database'], image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1000', url: '#' },
    ],
    'gen-ai': [
        { id: 'ga1', title: 'Building AI Agents That Actually Work in Production', summary: 'Moving beyond demos — here\'s how to build reliable AI agents with proper tool use, memory, and error recovery.', author: 'Nathan Cole', date: 'Mon Mar 03 2026', tags: ['agents', 'llm'], image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000', url: '#' },
        { id: 'ga2', title: 'Prompt Engineering Mastery: Advanced Techniques for 2025', summary: 'Chain-of-thought, few-shot, tree-of-thought — mastering these prompting strategies will make your AI applications dramatically smarter.', author: 'Isabelle Dupont', date: 'Sun Mar 02 2026', tags: ['genai', 'prompts'], image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&q=80&w=1000', url: '#' },
        { id: 'ga3', title: 'Multimodal AI: Building Apps That See, Hear and Reason', summary: 'Text was just the beginning. GPT-4o, Gemini Pro Vision and Claude\'s computer use are reshaping what AI apps can do.', author: 'Lucas Fernandez', date: 'Sat Mar 01 2026', tags: ['multimodal', 'ai'], image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1000', url: '#' },
    ],
    python: [
        { id: 'py1', title: 'Python 3.13: The JIT Compiler That Changes Everything', summary: 'Python is getting fast. The new JIT compiler in 3.13 delivers up to 60% performance improvements on CPU-bound tasks.', author: 'Ananya Reddy', date: 'Mon Mar 03 2026', tags: ['python', 'performance'], image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000', url: '#' },
        { id: 'py2', title: 'FastAPI vs Django REST Framework in 2025', summary: 'Two giants of Python web development go head-to-head. Which should you choose for your next API project?', author: 'Kevin Osei', date: 'Sun Mar 02 2026', tags: ['fastapi', 'django'], image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1000', url: '#' },
        { id: 'py3', title: 'Async Python: Writing Non-Blocking Code That Scales', summary: 'asyncio, trio, and structured concurrency — a practical guide to writing high-performance async Python applications.', author: 'Maria Johansson', date: 'Sat Mar 01 2026', tags: ['python', 'async'], image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&q=80&w=1000', url: '#' },
        { id: 'py4', title: 'Data Engineering with Polars: Replace Pandas Today', summary: 'Polars is up to 30x faster than Pandas for large datasets. Here\'s how to migrate your pipelines and unlock the speed gains.', author: 'Ben Wallace', date: 'Fri Feb 28 2026', tags: ['python', 'data'], image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000', url: '#' },
    ],
    webdev: [
        { id: 'wd1', title: 'Web Performance in 2025: Core Vitals & Beyond', summary: 'INP has replaced FID in the Core Web Vitals. Here\'s what that means for your site\'s performance strategy and Google rankings.', author: 'Grace Kim', date: 'Mon Mar 03 2026', tags: ['performance', 'seo'], image: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&q=80&w=1000', url: '#' },
        { id: 'wd2', title: 'Web Components Are Having Their Moment', summary: 'Framework-agnostic, future-proof UI components finally have a place in modern web development. Here\'s how to use them effectively.', author: 'Oscar Lindberg', date: 'Sun Mar 02 2026', tags: ['webcomponents', 'html'], image: 'https://images.unsplash.com/photo-1623479322729-28b25c16b011?auto=format&fit=crop&q=80&w=1000', url: '#' },
        { id: 'wd3', title: 'Bun 2.0: Is Node.js Finally Being Replaced?', summary: 'Bun\'s second major release is fast, compatible, and now production-ready. We test it against Node in real-world scenarios.', author: 'Chloe Andrews', date: 'Sat Mar 01 2026', tags: ['bun', 'nodejs'], image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1000', url: '#' },
    ],
    startups: [
        { id: 'st1', title: 'AI Startups to Watch in 2025: The Ones Building Real Products', summary: 'Beyond the hype — these 10 AI startups are shipping real value to paying customers and growing fast.', author: 'Raj Mehta', date: 'Mon Mar 03 2026', tags: ['startups', 'ai'], image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000', url: '#' },
        { id: 'st2', title: 'How to Build a Technical Co-Founder Relationship That Lasts', summary: 'The most important relationship in a tech startup. Advice from founders who\'ve navigated equity splits, disagreements, and exits.', author: 'Alicia Nguyen', date: 'Sun Mar 02 2026', tags: ['startups', 'founders'], image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1000', url: '#' },
    ],
    devops: [
        { id: 'do1', title: 'Kubernetes in 2025: Is It Still Worth the Complexity?', summary: 'K8s is powerful but complex. We examine when it\'s overkill and what modern alternatives like Fly.io and Railway offer instead.', author: 'Martin Becker', date: 'Mon Mar 03 2026', tags: ['kubernetes', 'devops'], image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=1000', url: '#' },
        { id: 'do2', title: 'GitHub Actions vs GitLab CI vs CircleCI: 2025 Comparison', summary: 'CI/CD pipelines are the backbone of modern dev teams. We compare pricing, performance, and developer experience across the top platforms.', author: 'Petra Novak', date: 'Sun Mar 02 2026', tags: ['cicd', 'devops'], image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1000', url: '#' },
        { id: 'do3', title: 'Infrastructure as Code with Pulumi vs Terraform', summary: 'Pulumi lets you use real programming languages for IaC. Is that enough to dethrone Terraform after a decade of dominance?', author: 'Jin Park', date: 'Sat Mar 01 2026', tags: ['iac', 'terraform'], image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&q=80&w=1000', url: '#' },
    ],
    cloud: [
        { id: 'cl1', title: 'AWS vs Azure vs GCP in 2025: The Definitive Developer Guide', summary: 'Choosing a cloud provider is a major decision. We cut through the marketing to show where each excels for different workloads.', author: 'Sophie Dubois', date: 'Mon Mar 03 2026', tags: ['cloud', 'aws'], image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1000', url: '#' },
        { id: 'cl2', title: 'Serverless in Production: Lessons from 2 Years at Scale', summary: 'Cold starts, vendor lock-in, debugging challenges — here\'s the honest truth about running a business on 100% serverless architecture.', author: 'Aryan Shah', date: 'Sun Mar 02 2026', tags: ['serverless', 'cloud'], image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000', url: '#' },
    ],
    react: [
        { id: 're1', title: 'React Query v6: The Most Powerful Data Fetching in the Ecosystem', summary: 'TanStack Query v6 adds built-in support for fine-grained subscriptions, automatic garbage collection, and a new DevTools UI.', author: 'Emma Wilson', date: 'Mon Mar 03 2026', tags: ['react', 'tanstack'], image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1000', url: '#' },
        { id: 're2', title: 'Zustand vs Redux Toolkit: Modern State Management Showdown', summary: 'Redux Toolkit has matured, but Zustand is winning developer hearts. An honest comparison with real code examples.', author: 'Hiroshi Yamamoto', date: 'Sun Mar 02 2026', tags: ['react', 'state'], image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000', url: '#' },
        { id: 're3', title: 'React Native vs Expo in 2025: Start with Expo', summary: 'Expo has leveled up with native modules, OTA updates, and full app store delivery. There\'s almost no reason to use bare React Native anymore.', author: 'Layla Mansour', date: 'Sat Mar 01 2026', tags: ['reactnative', 'mobile'], image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1000', url: '#' },
    ],
    javascript: [
        { id: 'js1', title: 'JavaScript Signals: The State Primitive That Changes Everything', summary: 'Signals are coming to the core of JavaScript. Here\'s what Angular, Solid, and Vue have proven, and why the TC39 proposal matters.', author: 'Felix Müller', date: 'Mon Mar 03 2026', tags: ['javascript', 'signals'], image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&q=80&w=1000', url: '#' },
        { id: 'js2', title: 'The Modern JavaScript Toolchain: Vite, Biome & Beyond', summary: 'The JS toolchain has been reinvented — Biome replaces ESLint+Prettier, Vite replaces webpack. Here\'s the 2025 setup you should use.', author: 'Lily Chen', date: 'Sun Mar 02 2026', tags: ['javascript', 'tooling'], image: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&q=80&w=1000', url: '#' },
        { id: 'js3', title: 'Web Workers & Shared Memory: Unlocking True Parallelism', summary: 'JavaScript is single-threaded, but it doesn\'t have to be slow. Using SharedArrayBuffer and Atomics to build real parallel web apps.', author: 'Adrian Costa', date: 'Sat Mar 01 2026', tags: ['javascript', 'performance'], image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&q=80&w=1000', url: '#' },
    ],
};

// Tag aliases: map our category IDs to dev.to tags
const TAG_MAP = {
    'machine-learning': 'machinelearning',
    'full-stack': 'fullstack',
    'gen-ai': 'ai',
    'webdev': 'webdev',
    'startups': 'startup',
    'devops': 'devops',
    'cloud': 'cloud',
    'react': 'react',
    'javascript': 'javascript',
    'python': 'python',
    'programming': 'programming',
};

const fetchNews = async (tag = 'programming', limit = 30) => {
    // Map tag to dev.to tag
    const apiTag = TAG_MAP[tag] || tag;

    try {
        const response = await axios.get(`https://dev.to/api/articles?tag=${apiTag}&per_page=${limit}`, {
            timeout: 5000, // 5 second timeout
        });

        if (!response.data || response.data.length === 0) {
            throw new Error('No articles returned from API');
        }

        const articles = response.data.map(article => ({
            id: article.id,
            title: article.title,
            summary: article.description || 'Read the full article for more details.',
            content: article.body_html || article.description,
            author: article.user.name,
            date: new Date(article.published_at).toDateString(),
            tags: article.tag_list,
            image: article.cover_image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000',
            url: article.url
        }));

        // Shuffle articles to simulate "live" content updates
        for (let i = articles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [articles[i], articles[j]] = [articles[j], articles[i]];
        }

        return articles;
    } catch (error) {
        console.warn(`API unavailable for tag "${tag}", using fallback content.`);

        // Return fallback articles for this category, or programming as default
        const fallback = fallbackArticles[tag] || fallbackArticles['programming'];
        return fallback || [];
    }
};

const getArticleById = async (id) => {
    // Check if it's a fallback article (string ID starting with letters)
    if (typeof id === 'string' && isNaN(id)) {
        for (const category of Object.values(fallbackArticles)) {
            const found = category.find(a => a.id === id);
            if (found) return { ...found, content: `<div class="prose"><p>${found.summary}</p><p>This is a curated article. <a href="${found.url || '#'}">Read the full article →</a></p></div>` };
        }
        return null;
    }

    try {
        const response = await axios.get(`https://dev.to/api/articles/${id}`, { timeout: 5000 });
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
