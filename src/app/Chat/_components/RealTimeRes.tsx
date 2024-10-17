"use client"

import React, {useEffect, useRef, useState} from 'react';
import CodeSnippet from "@/app/CodeSnippet";
import gpt from "@/app/_assets/gpt.jpeg";
import o1 from "@/app/_assets/o1.jpeg";
import gemini from "@/app/_assets/gemini.png";
import profile from "@/app/_assets/profile.jpeg";
import {LuSend} from "react-icons/lu";
import { FiEdit } from "react-icons/fi";
import { HiOutlineClipboard } from "react-icons/hi";
import { endPoints } from "@/pages/api/endPoints";


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
        assistantDirection: 'ltr' | 'rtl'
    }[]>([]);

    const [input, setInput] = useState('');
    const [selectedModel, setSelectedModel] = useState(models[0].name);
    const [direction, setDirection] = useState<'ltr' | 'rtl'>('rtl');
    const messagesEndRef = useRef(null);
    const [copied, setCopied] = useState(false);

    const fetchData = async (userInput: string) => {
        const apiKey = process.env.AUTH_TOKEN;


        // const response = await fetch('https://api.gpt-fa.ir/chat/generate-answer/', {
        const response = await fetch(endPoints.generate_answer, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                messages: [
                    {role: 'system', content: 'You are a helpful and powerful assistant. Give user only the content.'},
                    {role: 'user', content: userInput}
                ],
                question: userInput,
                conversation_slug: '86e1efbe-a1fb-45da-91a4-61d683102535',
                model: '4'
            })
        });

        const reader = response.body.getReader();
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
                console.log(firstWord)
                const persianRegex = /^[\u0600-\u06FF]/; // Regex to check for Persian characters
                const newDirection = persianRegex.test(firstWord) ? "rtl" : "ltr";
                return [
                    ...prevMessages.slice(0, -1),
                    {
                        user: lastMessage?.user || '',
                        assistant: assistantMessage,
                        userDirection: lastMessage?.userDirection || 'ltr',
                        assistantDirection: newDirection
                    }
                ];
            });
            result = '';
        }
    };



    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            const userDirection = detectLanguageDirection(input); // Use the existing function
            // Append new user message to the message history
            setMessages(prevMessages => [...prevMessages, {
                user: input,
                assistant: '',
                userDirection,
                assistantDirection: 'ltr'
            }]);
            fetchData(input);
            setInput('');
            setDirection("rtl")
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            handleSubmit(e);
        }
    };

    const renderMessage = (msg) => {
        const parts = msg.split(/(```\s*([a-zA-Z]+)\n[\s\S]*?```)/g); // Split by code blocks and capture the language
        return parts.map((part, index) => {
            const match = part.match(/^```(\s*([a-zA-Z]+))?\n([\s\S]*?)```$/);
            if (match) {
                const language = match[2] ? match[2].trim() : 'plaintext';
                const code = match[3];
                return <CodeSnippet key={index} code={code} language={language}/>;
            }
            return <span key={index}>{part}</span>;
        });
    };

    const handleModelSelect = (model: string) => {
        setSelectedModel(model);
    };

    const detectLanguageDirection = (text: string) => {
        const persianRegex = /^[\u0600-\u06FF]/;
        if (persianRegex.test(text.trimStart())) {
            return 'rtl';
        }
        return 'ltr';
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({behavior: "smooth"});
        }
    }, [messages]);


    return (
        <div className="flex px-10 md:px-20 px-20 flex-col h-screen justify-between text-neutral-100 bg-gray-900 p-6">
            <div
                className="flex gap-3 flex-col md:flex-row-reverse md:justify-between border-b-2 border-b-cyan-950 items-end md:items-center">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-black">جی پی تی فا</h1>
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"
                         fill="none" stroke="#0D7285" strokeWidth="2" strokeLinecap="round"
                         strokeLinejoin="round" className="tabler-icon tabler-icon-brand-openai">
                        <path d="M11.217 19.384a3.501 3.501 0 0 0 6.783 -1.217v-5.167l-6 -3.35"></path>
                        <path d="M5.214 15.014a3.501 3.501 0 0 0 4.446 5.266l4.34 -2.534v-6.946"></path>
                        <path
                            d="M6 7.63c-1.391 -.236 -2.787 .395 -3.534 1.689a3.474 3.474 0 0 0 1.271 4.745l4.263 2.514l6 -3.348"></path>
                        <path d="M12.783 4.616a3.501 3.501 0 0 0 -6.783 1.217v5.067l6 3.45"></path>
                        <path
                            d="M18.786 8.986a3.501 3.501 0 0 0 -4.446 -5.266l-4.34 2.534v6.946"></path>
                        <path
                            d="M18 16.302c1.391 .236 2.787 -.395 3.534 -1.689a3.474 3.474 0 0 0 -1.271 -4.745l-4.308 -2.514l-5.955 3.42"></path>
                    </svg>
                </div>

                {/* Model Selection */}
                {/*<div className="flex space-x-4 mb-6 self-center">*/}
                <div className="flex gap-2 mb-6 self-center">
                    {models.map((model) => (
                        <div
                            key={model.name}
                            onClick={() => handleModelSelect(model.name)}
                            className={`flex items-center justify-center content-center align-middle cursor-pointer md:px-4 px-2 py-2 rounded-lg border-2 bg-gray-800  ${selectedModel === model.name ? 'border-cyan-800' : 'border-gray-700'}`}
                        >
                            <img src={model.icon.src} alt={model.name}
                                 className="w-8 h-8 md:mr-2 rounded-full self-center"/>
                            <span className="hidden md:block">{model.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-grow overflow-y-auto mb-4 no-scrollbar">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50"
                             viewBox="0 0 24 24"
                             fill="none" stroke="#6B7280" strokeWidth="2"
                             strokeLinecap="round"
                             strokeLinejoin="round"
                             className="tabler-icon tabler-icon-brand-openai">
                            <path
                                d="M11.217 19.384a3.501 3.501 0 0 0 6.783 -1.217v-5.167l-6 -3.35"></path>
                            <path
                                d="M5.214 15.014a3.501 3.501 0 0 0 4.446 5.266l4.34 -2.534v-6.946"></path>
                            <path
                                d="M6 7.63c-1.391 -.236 -2.787 .395 -3.534 1.689a3.474 3.474 0 0 0 1.271 4.745l4.263 2.514l6 -3.348"></path>
                            <path
                                d="M12.783 4.616a3.501 3.501 0 0 0 -6.783 1.217v5.067l6 3.45"></path>
                            <path
                                d="M18.786 8.986a3.501 3.501 0 0 0 -4.446 -5.266l-4.34 2.534v6.946"></path>
                            <path
                                d="M18 16.302c1.391 .236 2.787 -.395 3.534 -1.689a3.474 3.474 0 0 0 -1.271 -4.745l-4.308 -2.514l-5.955 3.42"></path>
                        </svg>
                        <p className="text-gray-500 text-lg">امروز چطور می توانم به شما کمک کنم؟</p>
                        <p className="text-gray-500 text-lg">برای شروع چت کنید</p>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div key={index}>
                            <div className="flex flex-col p-5">
                                <div className="flex justify-between">
                                    <button onClick={() => setInput(msg.user)} className="text-white rounded-md">
                                        <FiEdit size={18} color={'0d7285'}/>
                                    </button>
                                    <div className="flex justify-end items-center gap-2">
                                        <strong className="flex flex-col items-end">مبینا</strong>
                                        <img className="w-10 rounded-full h-10 items-end" src={profile.src}/>
                                    </div>
                                </div>
                                <p dir={msg.userDirection === 'rtl' ? 'rtl' : 'ltr'}
                                   className={`whitespace-pre-wrap ${msg.userDirection === 'rtl' ? 'pr-12' : ''}`}>
                                    {msg.user}
                                </p>
                            </div>

                            <div className="bg-gray-800 rounded-lg p-5">
                                <div className="flex justify-between">
                                    <button onClick={() => copyToClipboard(msg.assistant)}
                                            className="text-white rounded-md">
                                        <div className="flex gap-2 items-center">
                                            <HiOutlineClipboard size={20} color={'0d7285'}/>
                                            {copied && <span className="text-sm text-cyan-700">کپی شد</span>}
                                        </div>
                                    </button>

                                    <div className="flex justify-end items-center gap-2">
                                        <strong className="flex flex-col items-end">جی پی تی</strong>
                                        <div
                                            className="flex w-10 rounded-full h-10 items-center content-center justify-center bg-cyan-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                 viewBox="0 0 24 24"
                                                 fill="none" stroke="currentColor" strokeWidth="2"
                                                 strokeLinecap="round"
                                                 strokeLinejoin="round"
                                                 className="tabler-icon tabler-icon-brand-openai">
                                                <path
                                                    d="M11.217 19.384a3.501 3.501 0 0 0 6.783 -1.217v-5.167l-6 -3.35"></path>
                                                <path
                                                    d="M5.214 15.014a3.501 3.501 0 0 0 4.446 5.266l4.34 -2.534v-6.946"></path>
                                                <path
                                                    d="M6 7.63c-1.391 -.236 -2.787 .395 -3.534 1.689a3.474 3.474 0 0 0 1.271 4.745l4.263 2.514l6 -3.348"></path>
                                                <path
                                                    d="M12.783 4.616a3.501 3.501 0 0 0 -6.783 1.217v5.067l6 3.45"></path>
                                                <path
                                                    d="M18.786 8.986a3.501 3.501 0 0 0 -4.446 -5.266l-4.34 2.534v6.946"></path>
                                                <path
                                                    d="M18 16.302c1.391 .236 2.787 -.395 3.534 -1.689a3.474 3.474 0 0 0 -1.271 -4.745l-4.308 -2.514l-5.955 3.42"></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <pre dir={msg.assistantDirection === 'rtl' ? 'rtl' : 'ltr'}
                                     className={`whitespace-pre-wrap ${msg.userDirection === 'rtl' ? 'pr-12' : ''}`}>
                         {renderMessage(msg.assistant)}
                    </pre>
                            </div>
                        </div>
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
                            <span className="text-gray-500 text-sm absolute left-2 pl-2">{input.length}</span>
                            <textarea
                                value={input}
                                onChange={(e) => {
                                    setInput(e.target.value);
                                    setDirection(detectLanguageDirection(e.target.value));
                                }}
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
