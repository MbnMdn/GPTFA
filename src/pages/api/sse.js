// // // pages/api/sse.js
// import { NextApiRequest, NextApiResponse } from 'next';
// import { endPoints } from './endPoints';
//
// const handler = async (req, res) => {
//     if (req.method === 'POST') {
//         // Handle POST requests
//         const { userInput } = req.body;
//
//         res.setHeader('Content-Type', 'text/event-stream');
//         res.setHeader('Cache-Control', 'no-cache');
//         res.setHeader('Connection', 'keep-alive');
//
//         const apiKey = process.env.AUTH_TOKEN;
//
//         const response = await fetch(endPoints.generate_answer, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${apiKey}`,
//             },
//             body: JSON.stringify({
//                 messages: [
//                     { role: 'system', content: 'You are a helpful assistant.' },
//                     { role: 'user', content: userInput }
//                 ],
//                 question: userInput,
//                 conversation_slug: '86e1efbe-a1fb-45da-91a4-61d683102535',
//                 model: '4'
//             })
//         });
//
//         const reader = response.body.getReader();
//         const decoder = new TextDecoder();
//         let result = '';
//
//         while (true) {
//             const { done, value } = await reader.read();
//             if (done) break;
//
//             result += decoder.decode(value, { stream: true });
//             const cleanedLines = result.split('\n').filter(line => line.startsWith('data:')).map(line => line.replace(/^data:\s/, ''));
//
//             cleanedLines.forEach(currentLine => {
//                 if (currentLine) {
//                     res.write(`data: ${JSON.stringify({ response: currentLine })}\n\n`);
//                 }
//             });
//             console.log(result)
//             result = ''; // Reset result for the next chunk
//         }
//         res.end(); // End response when done
//     } else {
//         // For GET or other methods
//         res.setHeader('Allow', ['POST']);
//         res.status(405).end(`Method ${req.method} Not Allowed`);
//     }
// };
//
// export default handler;
//
// //
// // import { NextApiRequest, NextApiResponse } from 'next';
// // import { endPoints } from './endPoints';
// //
// // const handler = async (req, res) => {
// //     if (req.method === 'POST') {
// //         const { userInput } = req.body;
// //         const apiKey = process.env.AUTH_TOKEN;
// //
// //         const response = await fetch(endPoints.generate_answer, {
// //             method: 'POST',
// //             headers: {
// //                 'Content-Type': 'application/json',
// //                 'Authorization': `Bearer ${apiKey}`,
// //             },
// //             body: JSON.stringify({
// //                 messages: [
// //                     { role: 'system', content: 'You are a helpful assistant.' },
// //                     { role: 'user', content: userInput }
// //                 ],
// //                 question: userInput,
// //                 conversation_slug: '86e1efbe-a1fb-45da-91a4-61d683102535',
// //                 model: '4'
// //             })
// //         });
// //
// //         const reader = response.body.getReader();
// //         const decoder = new TextDecoder();
// //         let result = '';
// //
// //         while (true) {
// //             const { done, value } = await reader.read();
// //             if (done) break;
// //
// //             result += decoder.decode(value, { stream: true });
// //             const cleanedLines = result.split('\n').filter(line => line.startsWith('data:')).map(line => line.replace(/^data:\s/, ''));
// //
// //             cleanedLines.forEach(currentLine => {
// //                 if (currentLine) {
// //                     res.write(`data: ${JSON.stringify({ response: currentLine })}\n\n`);
// //                 }
// //             });
// //             result = '';
// //         }
// //         res.end();
// //     } else if (req.method === 'GET') {
// //         res.setHeader('Content-Type', 'text/event-stream');
// //         res.setHeader('Cache-Control', 'no-cache');
// //         res.setHeader('Connection', 'keep-alive');
// //
// //         res.write(`data: ${JSON.stringify({ message: 'Connected to SSE' })}\n\n`);
// //
// //         setInterval(() => {
// //             res.write(`data: ${JSON.stringify({ message: 'Ping from server' })}\n\n`);
// //         }, 10000);
// //
// //         req.on('close', () => {
// //             res.end();
// //         });
// //     } else {
// //         res.setHeader('Allow', ['GET', 'POST']);
// //         res.status(405).end(`Method ${req.method} Not Allowed`);
// //     }
// // };
// //
// // export default handler;
