async function testLogin() {
    try {
        const url = 'http://127.0.0.1:3001';
        console.log(`Testing GET ${url}/auth/login...`);
        try {
            const getRes = await fetch(`${url}/auth/login`);
            console.log('GET Login Status:', getRes.status);
            if (getRes.status !== 200) {
                const text = await getRes.text();
                console.log('GET Body:', text.substring(0, 200));
            }
        } catch (e) {
            console.log('GET Failed:', e.cause || e.message);
        }

        const email = `test${Date.now()}@example.com`;

        console.log('Registering...');
        const regRes = await fetch(`${url}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'testuser',
                email: email,
                password: 'password123'
            })
        });
        console.log('Reg Status:', regRes.status);

        console.log('Logging in...');
        const loginRes = await fetch(`${url}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                password: 'password123'
            }),
            redirect: 'manual'
        });

        console.log('Login Status:', loginRes.status);
        console.log('Login Headers:', [...loginRes.headers.entries()]);

    } catch (e) {
        console.error('Test Error:', e);
    }
}

testLogin();
