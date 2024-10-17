// "use client"
//
//
// import {useEffect, useState} from 'react';
// import CodeSnippet from "@/app/CodeSnippet";
//
// export default function RealTimeResponse() {
//     const [message, setMessage] = useState('');
//     let hasFetched = false;
//
//     useEffect(() => {
//
//         if (hasFetched) return;
//         hasFetched = true;
//
//         const fetchData = async () => {
//             const apiKey = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjkxNjEwMjQsInN1YiI6ImE2MmM5MmRiLTQ5MTktNGU4MS04ZjZjLWE5ODEzNTkxMzlhYSJ9.czkKwovLIqFebsHUuhLJ2g9ixUGiwSP-QDP0PVKYrA-7fAECdg0gDcTltNmn3Pg03ZREKmI2V2xysbk4yNnTbQ';
//
//             const response = await fetch('https://api.gpt-fa.ir//chat/generate-answer/', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${apiKey}`,
//                 },
//                 body: JSON.stringify({
//                     messages: [
//                         {
//                             role: 'system',
//                             content: 'You are a helpful and powerful assistant. and give user only the content'
//                         },
//                         {role: 'user', content: 'write helio world nodejs'}
//                     ],
//                     question: 'write helio world nodejs',
//                     conversation_slug: '7937be8f-1ad2-4327-bfd1-6abe788c0424',
//                     model: '4'
//                 })
//             });
//
//
//             const reader = response.body.getReader();
//             const decoder = new TextDecoder();
//             let result = '';
//             let previousLine = '';
//
//             while (true) {
//                 const {done, value} = await reader.read();
//                 if (done) break;
//
//                 // Decode incoming data chunk
//                 result += decoder.decode(value, {stream: true});
//
//
//                 const cleanedLines = result
//                     .split('\n')
//                     .filter(line => line.startsWith('data:')) // Keep only lines with 'data:'
//                     .map(line => line.replace(/^data:\s/, '').replace(/\r/g, '')); // Remove 'data: ' and all '\r'
//
//                 // .map(line => line.replace(/^data:\s/, '')); // Remove 'data: '
//
//                 // console.log(cleanedLines);
//
//                 let newMessage = '';
//
//                 cleanedLines.forEach(currentLine => {
//                     console.log("prev: " + previousLine)
//                     console.log("curr: " + currentLine)
//                     if ((previousLine === '' && currentLine === '') || (previousLine === ' ' && currentLine === '') || (previousLine === '' && currentLine === ' ') || (previousLine === ' ' && currentLine === ' ')) {
//                         // newMessage += '\n'; // Add a line break if both current and previous are empty
//                         newMessage += '\n'; // Add a line break if both current and previous are empty
//                         console.log('lb')
//                     }
//                     if (currentLine !== '') {
//                         newMessage += currentLine; // Append current line only if it's not empty
//                     }
//                     previousLine = currentLine; // Update previous line
//                 });
//
//                 // Update message
//                 setMessage(prevMessage => prevMessage + newMessage);
//
//                 // Clear the result to process the next batch of streamed data
//                 result = '';
//             }
//         };
//
//
//         fetchData();
//     }, []);
//
//     // Function to parse the message and extract code snippets
//     const renderMessage = (msg: string) => {
//         const parts = msg.split(/(```[a-z]*[\s\S]*?```)/g); // Split by code blocks
//         return parts.map((part, index) => {
//             const match = part.match(/^```([a-z]+)\n([\s\S]*?)```$/);
//             if (match) {
//                 const language = match[1];
//                 const code = match[2];
//                 console.log(language)
//                 console.log(code)
//                 return <CodeSnippet key={index} code={code} language={language}/>;
//             }
//             console.log(part)
//             return <span key={index}>{part}</span>; // Render normal text
//         });
//     };
//
//     return (
//         <div>
//             <pre>{renderMessage(message)}</pre>
//         </div>
//     );
// }
