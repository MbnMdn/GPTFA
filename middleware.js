// // middleware.js
// // import hi from '../src/pages/api/sse'
// import { NextResponse } from 'next/server';
//
// export function middleware(req) {
//     // Here you can modify the request headers
//     const modifiedHeaders = new Headers(req.headers);
//
//     // Optionally remove or change certain headers
//     modifiedHeaders.delete('Authorization');
//     modifiedHeaders.set('X-Custom-Header', 'your-value'); // Add any custom header if needed
//
//     // Forward the modified request
//     const url = req.nextUrl.clone();
//     url.pathname = '/api/sse'; // Redirect to your SSE endpoint
//     return NextResponse.rewrite(url, {
//         headers: modifiedHeaders,
//     });
// }
//
// // Specify paths where the middleware should apply
// export const config = {
//     matcher: '/sse', // Adjust to your route
// };
