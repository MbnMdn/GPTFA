// // pages/api/websocketProxy.js
// import { Server } from 'ws';
//
// export default function handler(req, res) {
//     const wss = new Server({ noServer: true });
//
//     // Handle WebSocket upgrade request
//     req.socket.server.on('upgrade', (request, socket, head) => {
//         wss.handleUpgrade(request, socket, head, (ws) => {
//             wss.emit('connection', ws, request);
//         });
//     });
//
//     wss.on('connection', (ws) => {
//         const apiKey = process.env.AUTH_TOKEN;
//
//         // Connect to the real WebSocket server
//         const realSocket = new WebSocket('https://api.gpt-fa.ir/chat/generate-answer');
//
//         realSocket.on('message', (data) => {
//             ws.send(data); // Forward messages from real socket to client
//         });
//
//         ws.on('message', (message) => {
//             // Add any necessary headers/auth before sending
//             realSocket.send(JSON.stringify({ apiKey, message }));
//         });
//
//         ws.on('close', () => {
//             realSocket.close();
//         });
//     });
//
//     res.end(); // End the HTTP response
// }
