"use client"

import React, {useEffect, useRef, useState} from 'react';
import gpt from "@/app/_assets/gpt.jpeg";
import o1 from "@/app/_assets/o1.jpeg";
import gemini from "@/app/_assets/gemini.png";
import {LuSend} from "react-icons/lu";
import {endPoints} from "@/pages/api/endPoints";
import {getEncoding} from "js-tiktoken";
import Welcome from "@/app/Chat/_components/Welcome";
import Message from "@/app/Chat/_components/Message";
import Header from "@/app/Chat/_components/Header";

const enc = getEncoding("cl100k_base");

const models = [
    {name: 'ChatGPT', icon: gpt},
    {name: 'OpenAI o1', icon: o1},
    {name: 'Gemini', icon: gemini}
];

export default function RealTimeResponse() {
    const [messages, setMessages] = useState<{
        user: string;
        assistant: string;
        userDirection: 'ltr' | 'rtl';
        assistantDirection: 'ltr' | 'rtl';
        userTokenSize: number;
        assistantTokenSize: number;
    }[]>([]);

    const [input, setInput] = useState('');
    const [selectedModel, setSelectedModel] = useState(models[0].name);
    const [direction, setDirection] = useState<'ltr' | 'rtl'>('rtl');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [tokenCount, setTokenCount] = useState(0);
    const [totalTokens, setTotalTokens] = useState(0);
    const TOKEN_LIMIT = 8192;


    const chatHistory = () => {
        if (totalTokens < TOKEN_LIMIT) {
            return messages.map(msg => `q: ${msg.user}\na: ${msg.assistant}`).join('\\n');
        }

        let countedTokens = 0;
        const history = [];
        for (let i = messages.length - 1; i >= 0; i--) {
            const msg = messages[i];
            const userTokens = msg.userTokenSize;
            const assistantTokens = msg.assistantTokenSize;

            // Check if adding this message exceeds the token limit
            if (countedTokens + userTokens + assistantTokens > TOKEN_LIMIT) {
                break; // Stop
            }

            // Add
            history.push(`q: ${msg.user}\na: ${msg.assistant}`);
            countedTokens += userTokens + assistantTokens;
        }

        console.log("history: " + history)
        return history.join('\\n');
    };

    const fetchData = async (userInput: string) => {
        let apiKey = process.env.AUTH_TOKEN;

        let finalResponse;

        const response = await fetch(endPoints.generate_answer, {
        // const response = await fetch('/api/proxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                messages: [
                    {role: 'system', content: 'You are a helpful and powerful assistant. Give user only the content.'},
                    {
                        role: 'user',
                        content: `this is our chat history in reverse order ('q' is me, 'a' is you):\\n${chatHistory()}\\nbased on our conversation, answer this: ${userInput}`
                    }
                ],
                question: userInput,
                conversation_slug: '86e1efbe-a1fb-45da-91a4-61d683102535',
                model: '4'
            })
        });

        if (response.status === 200) {
            finalResponse = response;
        } else if (response.status === 401) {
            // Fetch new token
            const tokenResponse = await fetch(endPoints.auth_token, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    username: 'mbn.mdn.82@gmail.com',
                    password: 'M14o2b1382@',
                    client_id: '',
                    client_secret: '',
                    scope: ''
                }).toString()
            });

            const tokenData = await tokenResponse.json();
            // process.env.AUTH_TOKEN = tokenData.access_token;
            apiKey = tokenData.access_token; // Update the access token

            // Retry the original request with the new token
            const newResponse = await fetch(endPoints.generate_answer, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a helpful and powerful assistant. Give user only the content.'
                        },
                        {
                            role: 'user',
                            content: `this is our chat history in reverse order ('q' is me, 'a' is you):\\n${chatHistory()}\\nbased on our conversation, answer this: ${userInput}`
                        }
                    ],
                    question: userInput,
                    conversation_slug: '86e1efbe-a1fb-45da-91a4-61d683102535',
                    model: '4'
                })
            });
            finalResponse = newResponse;
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const reader = finalResponse.body.getReader();
        const decoder = new TextDecoder();
        let result = '';
        let previousLine = '';

        while (true) {
            const {done, value} = await reader.read();
            if (done) break;

            result += decoder.decode(value, {stream: true});
            const cleanedLines = result
                .split('\n')
                .filter(line => line.startsWith('data:'))
                .map(line => line.replace(/^data:\s/, '').replace(/\r/g, ''));

            let newMessage = '';
            cleanedLines.forEach(currentLine => {
                if ((previousLine.trim() === '') && (currentLine.trim() === '')) {
                    newMessage += '\n';
                }
                if (currentLine !== '') {
                    newMessage += currentLine;
                }
                previousLine = currentLine;
            });

            // Append assistant's message
            setMessages(prevMessages => {
                const lastMessage = prevMessages[prevMessages.length - 1];
                const assistantMessage = lastMessage?.assistant ? lastMessage.assistant + newMessage : newMessage;

                const firstWord = assistantMessage.split(' ')[0];
                const persianRegex = /^[\u0600-\u06FF]/; // Regex to check for Persian characters
                const newDirection = persianRegex.test(firstWord) ? "rtl" : "ltr";

                const userTokenSize = enc.encode(userInput).length;
                const assistantTokenSize = enc.encode(assistantMessage).length;
                console.log("user: " + userTokenSize);
                console.log("asss: " + assistantTokenSize);
                const newTotalTokens = totalTokens + userTokenSize + assistantTokenSize;
                setTotalTokens(newTotalTokens);
                console.log("total: " + newTotalTokens);

                return [
                    ...prevMessages.slice(0, -1),
                    {
                        user: lastMessage?.user || '',
                        assistant: assistantMessage,
                        userDirection: lastMessage?.userDirection || 'ltr',
                        assistantDirection: newDirection,
                        userTokenSize,
                        assistantTokenSize,
                    }
                ];
            });
            console.log(messages)
            result = '';
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (input.trim()) {
            const userDirection = detectLanguageDirection(input); // Use the existing function
            setMessages(prevMessages => [...prevMessages, {
                user: input,
                assistant: '',
                userDirection,
                assistantDirection: 'ltr',
                userTokenSize: 0,
                assistantTokenSize: 0
            }]);
            fetchData(input);
            setInput('');
            setTokenCount(0);
            setDirection("rtl")
            console.log(messages);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const isDesktop = window.innerWidth > 1000;
        if (isDesktop && e.key === 'Enter' && !e.shiftKey) {
            handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
        }
    };

    const detectLanguageDirection = (text: string) => {
        const persianRegex = /^[\u0600-\u06FF]/;
        if (persianRegex.test(text.trimStart())) {
            return 'rtl';
        }
        return 'ltr';
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const inputText = e.target.value;
        setInput(inputText);
        setDirection(detectLanguageDirection(inputText));

        // Count tokens
        const tokens = enc.encode(inputText);
        setTokenCount(tokens.length);
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div
            className="flex px-3 md:px-20 flex-col h-screen justify-between text-neutral-100 bg-gray-900 p-6">
            <Header selectedModel={selectedModel} setSelectedModel={setSelectedModel} />

            <div className="flex-grow overflow-y-auto mb-4 no-scrollbar">
                {messages.length === 0 ? (
                    <Welcome/>
                ) : (
                    messages.map((msg, index) => (
                        <Message key={index} msg={msg} setInput={setInput} />
                    ))
                )}
                <div ref={messagesEndRef}/>
                {/* This div is the scroll target */}
            </div>

            <div>
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-3">
                        <button type="submit">
                            <div className="text-cyan-700 bg-cyan-200 p-2 rounded-lg">
                                <LuSend size={25}/>
                            </div>
                        </button>
                        <div className="relative flex-grow flex items-center">
                            <span className="text-gray-500 text-sm absolute left-2 pl-2">{tokenCount}</span>
                            <textarea
                                value={input}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange(e)}
                                onKeyPress={handleKeyPress}
                                placeholder="چی تو فکرته؟"
                                className="bg-gray-800 border rounded-lg focus:border-cyan-700 border-gray-600"
                                rows={1}
                                style={{
                                    width: '100%',
                                    padding: '10px 10px 10px 40px',
                                    margin: ' 10px 0 10px 0',
                                    direction: input.length === 0 ? 'rtl' : direction,
                                    overflowY: 'hidden',
                                    resize: 'none',
                                    outline: "none"
                                }}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}