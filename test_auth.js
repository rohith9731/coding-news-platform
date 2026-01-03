const axios = require('axios');
const tough = require('tough-cookie');

const testAuth = async () => {
    try {
        const { wrapper } = await import('axios-cookiejar-support');
        const cookieJar = new tough.CookieJar();

        const client = wrapper(axios.create({
            baseURL: 'http://localhost:3002',
            jar: cookieJar,
            withCredentials: true
        }));

        console.log('Testing Registration...');
        // Use a random email to avoid collision
        const email = `test${Date.now()}@example.com`;
        const regRes = await client.post('/auth/register', {
            username: 'testuser',
            email: email,
            password: 'password123'
        });
        console.log('Registration Status:', regRes.status);

        console.log('Testing Login...');
        const loginRes = await client.post('/auth/login', {
            email: email,
            password: 'password123'
        });
        console.log('Login Status:', loginRes.status);
        console.log('Login Headers:', loginRes.headers);

        // Check if we got redirected to home (means success)
        if (loginRes.request.res.responseUrl && loginRes.request.res.responseUrl.endsWith('/')) {
            console.log('Login SUCCESS: Redirected to home');
        } else {
            console.log('Login MIGHT HAVE FAILED: Not redirected to home', loginRes.request.res.responseUrl);
        }

    } catch (err) {
        console.error('Test Failed:', err.message);
        if (err.response) {
            console.error('Data:', err.response.data);
            console.error('Status:', err.response.status);
        }
    }
};

testAuth();
