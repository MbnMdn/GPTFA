"use client"

import { useState } from 'react';

const GenerateAnswer = () => {
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGenerateAnswer = async () => {
        setLoading(true);
        const apiKey = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjkxMDU4MDksInN1YiI6ImE2MmM5MmRiLTQ5MTktNGU4MS04ZjZjLWE5ODEzNTkxMzlhYSJ9.ocKCn8_pkzwwS9dM010Op7RI2Sqer98dhvLN9NFHzEb1GLGrysgxaUJEdLjLBRffpMfYc57Tuv9HBao9oU_6PA';

        const res = await fetch('https://api.gpt-fa.ir/chat/generate-answer/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: 'You are a helpful and powerful assistant. and give user only the content' },
                    { role: 'user', content: 'write helio world nodejs' },
                ],
                question: 'write helio world nodejs',
                conversation_slug: '7937be8f-1ad2-4327-bfd1-6abe788c0424',
                model: '4',
            }),
        });

        const data = await res.json();
        setResponse(data);
        setLoading(false);
    };

    return (
        <div>
            <button onClick={handleGenerateAnswer} disabled={loading}>
                {loading ? 'Loading...' : 'Generate Answer'}
            </button>
            {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
        </div>
    );
};

export default GenerateAnswer;
