import Logo from "@/app/Chat/_components/Logo";
import React from "react";

export default function GPTFA(){
    return (
        <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black">جی پی تی فا</h1>
            <Logo width={40} height={40} stroke={'#0D7285'}/>
        </div>
    )
}