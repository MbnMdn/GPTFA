
import React, {useState} from 'react';
import { FaRegCopy } from 'react-icons/fa';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeSnippetProps {
    code: string;
    language: string;
}

const CodeSnippet: React.FC<CodeSnippetProps> = ({ code, language }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-4">
            <div className="relative mt-4 rounded-lg bg-gray-700 p-4 text-white">
                <div className="absolute right-5 top-22">
                    <button onClick={handleCopy} className="text-gray-300 hover:text-white">
                        <div  className="flex gap-2 items-center">
                            {copied && <span className="text-sm text-neutral-100">کپی شد</span>}
                            <FaRegCopy size={20}/>
                        </div>
                    </button>
                </div>
                <p className="mb-2 text-sm font-semibold">{language}</p>
                <SyntaxHighlighter language={language} style={materialDark} className="rounded-lg">
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
    );
};

export default CodeSnippet;




