// // // /pages/api/proxy.ts
// // import { NextApiRequest, NextApiResponse } from 'next';
// //
// // export default async function handler(req: NextApiRequest, res: NextApiResponse) {
// //     const apiKey = process.env.AUTH_TOKEN;
// //
// //     // Read the raw request body
// //     const buffers = [];
// //     for await (const chunk of req) {
// //         buffers.push(chunk);
// //     }
// //     const body = Buffer.concat(buffers).toString();
// //
// //     // Forward request to the actual API endpoint
// //     const response = await fetch('https://api.gpt-fa.ir/chat/generate-answer', {
// //         method: req.method,
// //         headers: {
// //             'Content-Type': 'application/json',
// //             'Authorization': `Bearer ${apiKey}`
// //         },
// //         body: body // Pass the raw body directly
// //     });
// //
// //     if (!response.ok) {
// //         return res.status(response.status).json({ message: 'Error forwarding the request', error: await response.json() });
// //     }
// //
// //     const data = await response.json();
// //     res.status(200).json(data);
// // }
// //
//
//
// // pages/api/proxy.ts
// import { NextApiRequest, NextApiResponse } from 'next';
//
// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     const { method, body, headers } = req;
//
//     const apiKey = process.env.AUTH_TOKEN;
//
//     try {
//         const response = await fetch('https://api.gpt-fa.ir/chat/generate-answer', {
//             method: method,
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${apiKey}`,
//                 ...headers // Pass additional headers if needed
//             },
//             body: JSON.stringify(body)
//         });
//
//         const data = await response.json();
//         res.status(200).json(data);
//     } catch (error) {
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// }
