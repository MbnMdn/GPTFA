import React from 'react';
import Logo from "@/app/Chat/_components/Logo";

const Welcome = () => (
    <div className="flex flex-col items-center justify-center h-full gap-3">
        <Logo width={50} height={50} stroke={'#6B7280'}/>
        <p className="text-gray-500 text-lg">امروز چطور می توانم به شما کمک کنم؟</p>
        <p className="text-gray-500 text-lg">برای شروع چت کنید</p>
    </div>
);

export default Welcome;
