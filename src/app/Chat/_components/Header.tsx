import GPTFA from "@/app/Chat/_components/GPTFA";
import ModelSelector from "@/app/Chat/_components/ModelSelector";
import React from "react";

interface HeaderProps {
    selectedModel: string;
    setSelectedModel: (model: string) => void;
}

const Header: React.FC<HeaderProps> = ({selectedModel, setSelectedModel}) => {
    return (
        <div
            className="flex gap-3 flex-col md:flex-row-reverse md:justify-between border-b-2 border-b-cyan-950 items-end md:items-center">
            <GPTFA/>
            {/* Model Selection */}
            <ModelSelector selectedModel={selectedModel} setSelectedModel={setSelectedModel}/>
        </div>
    )
}

export default Header;
