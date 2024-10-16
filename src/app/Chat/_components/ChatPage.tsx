"use client";
import gpt from '../../_assets/gpt.jpeg'
import o1 from '../../_assets/o1.jpeg'
import gemini from '../../_assets/Gemini.jpeg'
import React, {useEffect, useRef, useState} from 'react';
import profile from '../../../profile.jpeg';
import {LuSend} from "react-icons/lu";

// Define the message structure
interface Message {
    text: string;
    isAnswer: boolean;
    sender: 'user' | 'bot';
}

// Define the list of models
const models = [
    {name: 'ChatGPT', icon: gpt},
    {name: 'OpenAI o1', icon: o1},
    // { name: 'GPT-4o', icon: '/path/to/gpt-4o-icon.svg' },
    {name: 'Gemini', icon: gemini}
];

const ChatPage: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [textDirection, setTextDirection] = useState<'rtl' | 'ltr'>('rtl');
    const [isFocused, setIsFocused] = useState(false);
    const [selectedModel, setSelectedModel] = useState(models[0].name); // State for selected model

    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    // Mock API call (this can be customized to handle different models)
    const mockApiCall = async (text: string) => {
        const response = {
            data:  {answer: '```System.out.print```'}
        };
        return response.data;
    };

    const handleSubmit = async () => {
        if (!inputText.trim()) return;

        const newMessage: Message = {text: inputText, isAnswer: false, sender: 'user'};
        setMessages([...messages, newMessage]);

        const apiResponse = await mockApiCall(inputText);
        const answerMessage: Message = {text: apiResponse.answer, isAnswer: true, sender: 'bot'};

        setMessages([...messages, newMessage, answerMessage]);
        setInputText('');
        adjustTextareaHeight();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const scrollHeight = textareaRef.current.scrollHeight;
            const maxHeight = 120;

            if (scrollHeight > maxHeight) {
                textareaRef.current.style.height = `${maxHeight}px`;
                textareaRef.current.style.overflowY = 'scroll';
            } else {
                textareaRef.current.style.height = `${scrollHeight}px`;
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setInputText(value);
        adjustTextareaHeight();
        setTextDirection(detectLanguageDirection(value));
    };

    const detectLanguageDirection = (text: string) => {
        const persianRegex = /^[\u0600-\u06FF]/;
        if (persianRegex.test(text.trimStart())) {
            return 'rtl';
        }
        return 'ltr';
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text)
            .then(() => alert('Message copied to clipboard!'))
            .catch(() => alert('Failed to copy the message.'));
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({behavior: 'smooth'});
        }
    }, [messages]);

    const isPersian = (text: string) => {
        const persianRegex = /^[\u0600-\u06FF]/;
        return persianRegex.test(text);
    };

    // Model selection handler
    const handleModelSelect = (model: string) => {
        setSelectedModel(model);
    };

    return (
        <div className="flex flex-col h-screen justify-between bg-gray-900 p-6">
            {/* Model Selection */}
            <div className="flex space-x-4 mb-6">
                {models.map((model) => (
                    <div
                        key={model.name}
                        onClick={() => handleModelSelect(model.name)}
                        className={`flex items-center cursor-pointer px-4 py-2 rounded-lg ${selectedModel === model.name ? 'bg-gray-200' : 'bg-gray-600'}`}
                    >
                        <img src={model.icon.src} alt={model.name} className="w-8 h-8 mr-2 rounded-full"/>
                        <span>{model.name}</span>
                    </div>
                ))}


            </div>

            {/* Chat Messages */}
            <div className="flex-grow overflow-y-auto mb-4">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`p-4 mb-2 rounded-lg relative flex ${message.isAnswer ? 'bg-gray-800 text-neutral-100' : 'text-neutral-100'}`}
                        style={{
                            direction: 'rtl',
                            unicodeBidi: 'plaintext',
                        }}
                    >
                        {/* Profile Picture */}
                        <div className="ml-3">
                            {message.sender === 'user' ? (
                                <img src={profile.src} alt="User Profile" className="w-10 h-10 rounded-full"/>
                            ) : (
                                <div className="bg-cyan-600 rounded-full p-1 w-10 h-10 flex items-center justify-center">
                                    {/* Bot icon */}
                                </div>
                            )}
                        </div>

                        <div className="flex-grow">
                            {/* Username or Bot label */}
                            <div className="flex items-center mb-2">
                                {message.sender === 'user' ? (
                                    <span className="font-bold">مبینا</span>
                                ) : (
                                    <span className="font-bold">جی پی تی</span>
                                )}
                            </div>

                            <p className={`whitespace-pre-wrap ${isPersian(message.text) ? 'text-right' : 'text-left'} flex-row-reverse`}>
                                {message.text}
                            </p>
                        </div>

                        {/* Copy Button */}
                        {message.sender === 'bot' && (
                            <button
                                onClick={() => handleCopy(message.text)}
                                className="absolute top-3 left-3 bg-gray-600 text-white px-2 py-1 rounded-lg text-sm"
                            >
                                Copy
                            </button>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef}/>
            </div>

            {/* Input and Send Button */}
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-3">
                <button
                    type="button"
                    className="ml-2 bg-cyan-600 text-white p-2 rounded-lg"
                    onClick={handleSubmit}
                >
                    <LuSend size={20}/>
                </button>
                <div className="relative flex-grow flex items-center">
          <span className="text-gray-500 text-sm absolute left-2 pl-2">
            {inputText.length}
          </span>
                    <textarea
                        ref={textareaRef}
                        className={`flex-grow pl-10 p-2 ${isFocused ? 'border border-cyan-600' : 'border border-gray-400'} text-neutral-100 rounded-lg bg-gray-600 resize-none overflow-auto`}
                        value={inputText}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="چی تو فکرته؟"
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        style={{minHeight: '30px', maxHeight: '120px'}}
                        dir={inputText.length === 0 ? 'rtl' : textDirection}
                    />
                </div>
            </form>
        </div>
    );
};

export default ChatPage;