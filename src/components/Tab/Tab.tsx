import React from "react";
import './Tab.scss'

interface TabProps {
    text: string
    value: string
    onClick(value: string): void
}

export const Tab: React.FC<TabProps> = ({text, value, onClick}: TabProps) => {
    return (
        <div
            className="tab"
            onClick={() => onClick(value)}
            
        >
            <div className="span-wrapper">
                <span>
                    {text}
                </span>
            </div>
        </div>
    )
}