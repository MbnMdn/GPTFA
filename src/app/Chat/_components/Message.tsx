import React, {useState} from 'react';
import {HiOutlineClipboard} from "react-icons/hi";
import {FiEdit} from "react-icons/fi";
import profile from "@/app/_assets/profile.jpeg";
import Logo from "@/app/Chat/_components/Logo";
import CodeSnippet from "@/app/Chat/_components/CodeSnippet";

interface MessageProps {
    msg: {
        user: string;
        assistant: string;
        userDirection: 'ltr' | 'rtl';
        assistantDirection: 'ltr' | 'rtl';
        userTokenSize: number;
        assistantTokenSize: number;
    };
    setInput: (input: string) => void;
}

const Message: React.FC<MessageProps> = ({msg, setInput}) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const renderMessage = (msg: string) => {
        const parts = msg.split(/(```\s*([a-zA-Z]+)\n[\s\S]*?```)/g); // Split by code blocks and capture the language
        return parts.map((part, index) => {
            const match = part.match(/^```(\s*([a-zA-Z]+))?\n([\s\S]*?)```$/);
            if (match) {
                const language = match[2] ? match[2].trim() : 'plaintext';
                const code = match[3];
                return <CodeSnippet key={index} code={code} language={language}/>;
            }
            if (index === 2) {
                return null;
            }
            return <span key={index}>{part}</span>;
        });
    };

    return (
        <div>
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


            {/* Add assistant message rendering here */}
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
                            <Logo/>
                        </div>
                    </div>
                </div>
                <pre dir={msg.assistantDirection === 'rtl' ? 'rtl' : 'ltr'}
                     className={`whitespace-pre-wrap ${msg.userDirection === 'rtl' ? 'pr-12' : ''}`}>{renderMessage(msg.assistant)}
                </pre>
            </div>
        </div>

    );
};
export default Message;