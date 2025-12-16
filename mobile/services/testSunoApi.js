// Test script to verify Suno API connection
const SUNO_API_KEY = 'adf674a7984fa01559e9329586fe0292';
const SUNO_BASE_URL = 'https://api.sunoapi.org';

async function testAPI() {
    console.log('Testing Suno API connection...');
    console.log('API Key:', SUNO_API_KEY);
    console.log('Base URL:', SUNO_BASE_URL);

    try {
        // Test: Try music generation
        console.log('\n--- Testing music generation ---');
        const payload = {
            customMode: false,
            prompt: 'A happy upbeat pop song',
            instrumental: false,
            model: 'V4_5',
            callBackUrl: 'https://example.com/callback'
        };

        console.log('Payload:', JSON.stringify(payload, null, 2));

        const genResponse = await fetch(`${SUNO_BASE_URL}/api/v1/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUNO_API_KEY}`,
            },
            body: JSON.stringify(payload),
        });

        console.log('Generation Response Status:', genResponse.status);
        const genText = await genResponse.text();
        console.log('Generation Response:', genText);

        if (genResponse.ok) {
            const genData = JSON.parse(genText);
            if (genData.code === 200 && genData.data && genData.data.taskId) {
                console.log('\n✅ API is working!');
                console.log('Task ID:', genData.data.taskId);
                console.log('\nYou can now use the Create tab to generate music!');
            } else {
                console.log('\n⚠️ Unexpected response structure');
            }
        } else {
            console.log('\n❌ API returned an error');
        }

    } catch (error) {
        console.error('\n❌ Test failed:', error);
    }
}

testAPI();
