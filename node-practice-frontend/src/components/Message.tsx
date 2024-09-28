import React from "react";
import { IoClose } from "react-icons/io5";

interface MessageProps {
    children: string;
    animate?: boolean;
    onClose?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Message({ children, animate, onClose }: MessageProps) {

    // Classes for modals
    const animateClass = animate ? "success-animation" : "";
    const modalStyle = animate ? "modalStyle" : "";

    return (
    <div className={`${animateClass} ${modalStyle}`}>
        <div className="messageContent">
            {children}
            {onClose && 
            <button className="xButton" onClick={onClose}>
                <IoClose />
            </button>}
        </div>
    </div>
    );
}