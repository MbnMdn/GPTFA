// export default async function handler(req, res) {
//     if (req.method === 'POST') {
//         const apiUrl = 'https://api.gpt-fa.ir/chat/generate-answer/';
//         const apiKey = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjkxMDU4MDksInN1YiI6ImE2MmM5MmRiLTQ5MTktNGU4MS04ZjZjLWE5ODEzNTkxMzlhYSJ9.ocKCn8_pkzwwS9dM010Op7RI2Sqer98dhvLN9NFHzEb1GLGrysgxaUJEdLjLBRffpMfYc57Tuv9HBao9oU_6PA';
//
//         const response = await fetch(apiUrl, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${apiKey}`,
//             },
//             body: JSON.stringify(req.body),
//         });
//
//         const data = await response.json();
//
//         if (response.ok) {
//             res.status(200).json(data);
//         } else {
//             res.status(response.status).json(data);
//         }
//     } else {
//         res.setHeader('Allow', ['POST']);
//         res.status(405).end(`Method ${req.method} Not Allowed`);
//     }
// }
