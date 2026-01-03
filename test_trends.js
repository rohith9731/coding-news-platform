async function testTrends() {
    try {
        const res = await fetch('http://127.0.0.1:3002/trends');
        console.log('Status:', res.status);
        if (res.status === 200) {
            const text = await res.text();
            if (text.includes('Trending Now') && text.includes('DevNews')) {
                console.log('VERIFICATION_SUCCESS');
            } else {
                console.log('VERIFICATION_FAILED: Content missing');
            }
        } else {
            console.log('VERIFICATION_FAILED: ' + res.status);
        }
    } catch (e) {
        console.log('VERIFICATION_ERROR: ' + e.message);
    }
}
testTrends();
