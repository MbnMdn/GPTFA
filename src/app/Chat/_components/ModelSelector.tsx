import React from 'react';
import gpt from "@/app/_assets/gpt.jpeg";
import o1 from "@/app/_assets/o1.jpeg";
import gemini from "@/app/_assets/gemini.png";

const models = [
    {name: 'ChatGPT', icon: gpt},
    {name: 'OpenAI o1', icon: o1},
    {name: 'Gemini', icon: gemini}
];

interface ModelSelectorProps {
    selectedModel: string;
    setSelectedModel: (model: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({selectedModel, setSelectedModel}) => {
    return (

        <div className="flex gap-2 mb-6 self-center">
            {models.map((model) => (
                <div
                    key={model.name}
                    onClick={() => setSelectedModel(model.name)}
                    className={`flex items-center justify-center content-center align-middle cursor-pointer md:px-4 px-2 py-2 rounded-lg border-2 bg-gray-800  ${selectedModel === model.name ? 'border-cyan-800' : 'border-gray-700'}`}
                >
                    <img src={model.icon.src} alt={model.name} className="w-8 h-8 md:mr-2 rounded-full self-center"/>
                    <span className="hidden md:block font-semibold">{model.name}</span>
                </div>
            ))}
        </div>
    );
};
export default ModelSelector;
