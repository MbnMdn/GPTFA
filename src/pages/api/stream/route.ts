// // File: app/api/stream/route.ts
//
// export const dynamic = "force-dynamic";
//
// export async function POST(request: Request) {
//     const encoder = new TextEncoder();
//     const reader = request.body.getReader();
//
//     // Create a streaming response
//     const customReadable = new ReadableStream({
//         start(controller) {
//             (async () => {
//                 const decoder = new TextDecoder();
//                 let result = '';
//
//                 while (true) {
//                     const { done, value } = await reader.read();
//                     if (done) break;
//
//                     result += decoder.decode(value, { stream: true });
//
//                     // Simulate processing the input and sending back a response
//                     const message = `data: ${result.trim()}\n\n`;
//                     controller.enqueue(encoder.encode(message));
//                 }
//                 controller.close();
//             })();
//         },
//     });
//
//     return new Response(customReadable, {
//         headers: {
//             'Connection': 'keep-alive',
//             'Cache-Control': 'no-cache',
//             'Content-Type': 'text/event-stream; charset=utf-8',
//         },
//     });
// }
