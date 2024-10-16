
import React from 'react';
import { FaRegCopy } from 'react-icons/fa';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeSnippetProps {
    code: string;
    language: string;
}

const CodeSnippet: React.FC<CodeSnippetProps> = ({ code, language }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        alert('Code copied!');
    };

    return (
        <div className="p-4">
            <div className="relative mt-4 rounded-lg bg-gray-800 p-4 text-white">
                <div className="absolute right-2 top-22">
                    <button onClick={handleCopy} className="text-gray-300 hover:text-white">
                        <FaRegCopy size={20} />
                    </button>
                </div>

                <p className="mb-2 text-sm font-semibold">{language}</p>
                <SyntaxHighlighter language={language} style={darcula} className="rounded-lg">
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
    );
};

export default CodeSnippet;




