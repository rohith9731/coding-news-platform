async function test() {
    try {
        const url = 'http://127.0.0.1:3000';
        const email = `test${Date.now()}@example.com`;

        await fetch(`${url}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'u', email, password: 'p' })
        });

        const res = await fetch(`${url}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: 'p' }),
            redirect: 'manual'
        });

        if (res.status === 302) {
            console.log('VERIFICATION_SUCCESS');
        } else {
            console.log('VERIFICATION_FAILED: ' + res.status);
            const text = await res.text();
            console.log(text.substring(0, 2000));
        }
    } catch (e) {
        console.log('VERIFICATION_ERROR: ' + e.message);
    }
}
test();
